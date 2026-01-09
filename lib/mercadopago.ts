import MercadoPagoConfig, { Preference } from 'mercadopago';

// NOTA PARA USUARIO:
// Necesitas un ACCESS_TOKEN de MercadoPago Developers (Credenciales de Prueba o Producción).
// Por ahora usaremos un token placeholder o environment variable.
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || "TEST-00000000-0000-0000-0000-000000000000";

const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
const preference = new Preference(client);

export interface PaymentItem {
    id: string;
    title: string;
    unit_price: number;
    quantity: number;
}

export async function createPaymentPreference(items: PaymentItem[], payerEmail?: string) {
    try {
        const response = await preference.create({
            body: {
                items: items,
                payer: {
                    email: payerEmail || "test@user.com"
                },
                back_urls: {
                    success: "http://localhost:3000/dashboard/ventas?status=success",
                    failure: "http://localhost:3000/dashboard/ventas?status=failure",
                    pending: "http://localhost:3000/dashboard/ventas?status=pending"
                },
                auto_return: "approved",
            }
        });

        return response.id; // Init Point se usa en el frontend
    } catch (error) {
        console.error("Error MercadoPago:", error);
        throw error;
    }
}
