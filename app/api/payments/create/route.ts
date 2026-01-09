import { NextResponse } from "next/server";
import { createPaymentPreference } from "@/lib/mercadopago";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { items, payerEmail } = body;

        // TODO: Validar items

        const preferenceId = await createPaymentPreference(items, payerEmail);

        return NextResponse.json({ preferenceId });

    } catch (error: any) {
        console.error("Error creating payment:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
