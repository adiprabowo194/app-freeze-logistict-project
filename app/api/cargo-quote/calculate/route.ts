import { ShippingRates, Carriers } from "@/models";
import { NextResponse, NextRequest } from "next/server";

// ✅ Type untuk cargo
type Cargo = {
  unit?: string;
  qty?: number;
};

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
      zone_type: String;
      cargos: Cargo[];
    };

    // ✅ Validasi basic
    if (!customer_code || !origin_state || !dest_state) {
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

    // ✅ Ambil shipping rates + relasi carrier
    const rates = await ShippingRates.findAll({
      where: { customer_code, origin_state, dest_state, zone_type },
      include: [
        {
          model: Carriers,
          as: "carrier_details", // ⚠️ harus sama dengan relasi
          attributes: ["carrier_name", "carrier_code"],
          where: { is_active: 1 },
          required: false, // LEFT JOIN
        },
      ],
    });

    if (!rates.length) {
      return NextResponse.json([]);
    }

    // ✅ Hitung pricing
    // ✅ Hitung pricing dengan spesifikasi rumus logistik
    const results = rates
      .map((rate: any) => {
        let totalBasePrice = 0;

        for (const cargo of cargos) {
          const unit = (cargo.unit ?? "").toLowerCase();
          const packageType = (rate.package_type ?? "").toLowerCase();

          // Pastikan unit cargo cocok dengan package_type di rate
          if (unit !== packageType) continue;

          const qty = Number(cargo.qty ?? 0);
          const basePricePerMin = Number(rate.carrier_price ?? 0); // Harga untuk min_qty
          const nextUnitPrice = Number(rate.next_price_carrier ?? 0); // Harga per unit setelah min_qty
          const minQty = Number(rate.min_qty ?? 0);

          let cargoPrice = 0;

          if (qty <= minQty) {
            // Jika qty masih di bawah atau sama dengan minimum, pakai basePrice
            cargoPrice = basePricePerMin;
          } else {
            // Rumus: Base Price + (Qty Sisa * Harga per Unit Sisa)
            const extraQty = qty - minQty;
            cargoPrice = basePricePerMin + extraQty * nextUnitPrice;
          }

          totalBasePrice += cargoPrice;
        }

        // Jika tidak ada cargo yang cocok dengan rate ini, harganya 0
        if (totalBasePrice === 0) return null;

        // ✅ Logika Rumus Finansial
        const markupFixed = Number(rate.markup_fixed ?? 0);
        const marginPercent = Number(rate.margin_percent ?? 0);
        const taxPercent = Number(rate.tax_percent ?? 0);

        // 1. Tambahkan Margin Keuntungan (Base + Margin %)
        // Contoh: 100.000 + (100.000 * 10%) = 110.000
        let priceWithMargin = totalBasePrice * (1 + marginPercent / 100);

        // 2. Tambahkan Markup Tetap (Flat Fee)
        // Contoh: 110.000 + 5.000 = 115.000
        let priceWithMarkup = priceWithMargin + markupFixed;

        // 3. Tambahkan Pajak (Dihitung dari total setelah markup & margin)
        // Contoh: 115.000 * 1.11 (PPN 11%)
        const finalPrice = priceWithMarkup * (1 + taxPercent / 100);

        return {
          rate_id: rate.id,
          carrier_code: rate.carrier_details?.carrier_code,
          name: rate.carrier_details?.carrier_name,
          price: Math.ceil(finalPrice), // Pembulatan ke atas untuk keamanan margin (rounding up)

          breakdown: {
            total_base_cost: totalBasePrice,
            margin_applied: marginPercent + "%",
            markup_fixed: markupFixed,
            tax_applied: taxPercent + "%",
            is_tax_inclusive: true,
          },

          pickup_eta: "1-2 Days",
          delivery_eta: "3-5 Days",
          zone_type,
        };
      })
      .filter(Boolean); // Hapus hasil null (rate yang tidak cocok)

    // ✅ Sort harga termurah
    results.sort((a, b) => a.price - b.price);

    return NextResponse.json(results);
  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      { message: err.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
