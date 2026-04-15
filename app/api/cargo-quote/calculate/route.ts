import { ShippingRates, Carriers } from "@/models";
import { NextResponse, NextRequest } from "next/server";

// ✅ Type Definitions
type Cargo = {
  unit?: string;
  qty?: number;
};

interface RateResult {
  rate_id: any;
  carrier_code: string;
  name: string;
  price: number;
  breakdown: {
    total_base_cost: number;
    margin_applied: string;
    markup_fixed: number;
    tax_applied: string;
    is_tax_inclusive: boolean;
  };
  pickup_eta: string;
  delivery_eta: string;
  zone_type: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      customer_code,
      origin_state,
      dest_state,
      zone_type,
      cargos = [],
    } = body as {
      customer_code: string;
      origin_state: string;
      dest_state: string;
      zone_type: string; // Fix: use 'string' instead of 'String'
      cargos: Cargo[];
    };

    // ✅ Basic Validation
    if (!customer_code || !origin_state || !dest_state) {
      // console.log([customer_code, origin_state, dest_state]);
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!Array.isArray(cargos)) {
      return NextResponse.json(
        { message: "cargos must be an array" },
        { status: 400 },
      );
    }

    // ✅ Fetch rates with Carrier relation
    const rates = await ShippingRates.findAll({
      where: { customer_code, origin_state, dest_state, zone_type },
      include: [
        {
          model: Carriers,
          as: "carrier_details",
          attributes: ["carrier_name", "carrier_code"],
          where: { is_active: 1 },
          required: false,
        },
      ],
      // raw: true jika tidak butuh instance sequelize,
      // tapi jika pakai 'include' lebih aman pakai default atau .get({plain: true})
    });

    if (!rates.length) {
      return NextResponse.json([]);
    }

    // ✅ Calculate Pricing
    const results = rates
      .map((rate: any) => {
        let totalBasePrice = 0;
        const rateData = rate.get({ plain: true }); // Mengonversi instance Sequelize ke object biasa

        for (const cargo of cargos) {
          const unit = (cargo.unit ?? "").toLowerCase();
          const packageType = (rateData.package_type ?? "").toLowerCase();

          // Match unit cargo with rate package_type
          if (unit !== packageType) continue;

          const qty = Number(cargo.qty ?? 0);
          const basePricePerMin = Number(rateData.carrier_price ?? 0);
          const nextUnitPrice = Number(rateData.next_price_carrier ?? 0);
          const minQty = Number(rateData.min_qty ?? 0);

          let cargoPrice = 0;

          if (qty <= minQty) {
            cargoPrice = basePricePerMin;
          } else {
            const extraQty = qty - minQty;
            cargoPrice = basePricePerMin + extraQty * nextUnitPrice;
          }

          totalBasePrice += cargoPrice;
        }

        if (totalBasePrice === 0) return null;

        // ✅ Financial Formulas
        const markupFixed = Number(rateData.markup_fixed ?? 0);
        const marginPercent = Number(rateData.margin_percent ?? 0);
        const taxPercent = Number(rateData.tax_percent ?? 0);

        // 1. Margin
        let priceWithMargin = totalBasePrice * (1 + marginPercent / 100);
        // 2. Markup
        let priceWithMarkup = priceWithMargin + markupFixed;
        // 3. Tax
        const finalPrice = priceWithMarkup * (1 + taxPercent / 100);

        return {
          rate_id: rateData.id,
          carrier_code: rateData.carrier_details?.carrier_code || "N/A",
          name: rateData.carrier_details?.carrier_name || "Unknown Carrier",
          price: Math.ceil(finalPrice),
          breakdown: {
            total_base_cost: totalBasePrice,
            margin_applied: marginPercent + "%",
            markup_fixed: markupFixed,
            tax_applied: taxPercent + "%",
            is_tax_inclusive: true,
          },
          pickup_eta: "1-2 Days",
          delivery_eta: "3-5 Days",
          zone_type: zone_type,
        } as RateResult;
      })
      .filter((item): item is RateResult => item !== null); // ✅ Type Guard: Menghapus null dan meyakinkan TS

    // ✅ Sort by cheapest price (Garis merah hilang)
    results.sort((a, b) => a.price - b.price);

    return NextResponse.json(results);
  } catch (err: any) {
    console.error("Pricing Error:", err);
    return NextResponse.json(
      { message: err.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
