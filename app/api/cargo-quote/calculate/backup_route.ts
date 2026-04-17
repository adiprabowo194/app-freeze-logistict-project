import { ShippingRates, Carriers } from "@/models";
import { NextResponse, NextRequest } from "next/server";
import { getSessionUser } from "@/lib/auth";

// 1. Definisikan Interface untuk Carrier agar tidak "Red Line"
interface CarrierInstance {
  id: number;
  carrier_code: string;
  carrier_name: string;
  is_active: number;
}

interface RateResult {
  carrier_code: string;
  name: string;
  price: number;
  price_excl_tax: number;
  tax_amount: number;
  pickup_eta: string;
  delivery_eta: string;
  zone_type: string;
  breakdown_per_unit: any[];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customerCode = user.customer_code;
    const { origin_state, dest_state, zone_type, cargos = [] } = body;

    // 2. Grouping Cargo
    const groupedCargos = cargos.reduce((acc: any, cargo: any) => {
      const unit = cargo.unit?.toLowerCase();
      if (unit) {
        acc[unit] = (acc[unit] || 0) + Number(cargo.qty || 0);
      }
      return acc;
    }, {});

    const requestedUnits = Object.keys(groupedCargos);
    if (requestedUnits.length === 0) return NextResponse.json([]);

    // 3. Ambil Carriers dengan Type Assertion
    const carriers = (await Carriers.findAll({
      where: { is_active: 1 },
      raw: true, // Mengambil data mentah (plain object)
    })) as unknown as CarrierInstance[];

    const results: RateResult[] = [];

    for (const carrier of carriers) {
      let totalCarrierExclTax = 0;
      let totalCarrierTax = 0;
      let breakdownPerUnit = [];
      let canHandleAllUnits = true;

      for (const unit of requestedUnits) {
        const totalQty = groupedCargos[unit];

        const rate = await ShippingRates.findOne({
          where: {
            customer_code: customerCode,
            origin_state,
            dest_state,
            zone_type,
            package_type: unit,
            carrier_id: carrier.id, // Sekarang aman dari error merah
          },
        });

        if (!rate) {
          canHandleAllUnits = false;
          break;
        }

        const rateData = rate.get({ plain: true });

        const fuelPct = Number(rateData.margin_fuel_levy ?? 0) / 100;
        const marginPct = Number(rateData.margin_percent ?? 0) / 100;
        const taxPct = Number(rateData.tax_percent ?? 0) / 100;
        const basePrice = Number(rateData.carrier_price ?? 0);
        const nextPrice = Number(rateData.next_price_carrier ?? 0);

        // Rumus
        const firstUnitPriceMatured =
          basePrice * (1 + fuelPct) * (1 + marginPct);
        const nextUnitPriceMatured =
          nextPrice * (1 + fuelPct) + (1 + marginPct);

        let unitSubtotalExclTax = 0;
        if (totalQty === 1) {
          unitSubtotalExclTax = firstUnitPriceMatured;
        } else {
          unitSubtotalExclTax =
            firstUnitPriceMatured + (totalQty - 1) * nextUnitPriceMatured;
        }

        const unitTaxAmount = unitSubtotalExclTax * taxPct;

        totalCarrierExclTax += unitSubtotalExclTax;
        totalCarrierTax += unitTaxAmount;

        breakdownPerUnit.push({
          unit: unit,
          total_qty: totalQty,
          subtotal_excl_tax: parseFloat(unitSubtotalExclTax.toFixed(2)),
        });
      }

      if (canHandleAllUnits && breakdownPerUnit.length > 0) {
        results.push({
          carrier_code: carrier.carrier_code || "N/A", // Sekarang aman
          name: carrier.carrier_name || "Unknown Carrier", // Sekarang aman
          price: parseFloat((totalCarrierExclTax + totalCarrierTax).toFixed(2)),
          price_excl_tax: parseFloat(totalCarrierExclTax.toFixed(2)),
          tax_amount: parseFloat(totalCarrierTax.toFixed(2)),
          pickup_eta: "1 - 2 Days",
          delivery_eta: "3 - 5 Days",
          zone_type: zone_type,
          breakdown_per_unit: breakdownPerUnit,
        });
      }
    }

    results.sort((a, b) => a.price - b.price);
    return NextResponse.json(results);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
