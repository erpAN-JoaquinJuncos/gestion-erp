import { NextResponse } from "next/server";
import { getGoogleSheetsConnection } from "@/lib/googleSheets";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

        const body = await request.json();
        const { tipo, categoria, descripcion, monto, metodoPago } = body;

        // Validación
        if (!tipo || !monto) {
            return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
        }

        const sheets = await getGoogleSheetsConnection();
        const spreadsheetId = process.env.GOOGLE_SHEET_ID;

        // "ID", "Fecha", "Tipo", "Categoría", "Descripción", "Monto", "Método Pago", "Usuario"
        const newMovement = [
            uuidv4(),
            new Date().toISOString().split("T")[0],
            tipo, // "Ingreso" o "Egreso"
            categoria, // "Servicios", "Impuestos", "Retiro", "Ajuste"
            descripcion,
            monto,
            metodoPago || "Efectivo",
            session.user?.name || "Desconocido"
        ];

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: "Caja!A:H",
            valueInputOption: "USER_ENTERED",
            requestBody: { values: [newMovement] },
        });

        return NextResponse.json({
            success: true,
            message: "Movimiento registrado correctamente."
        });

    } catch (error: any) {
        console.error("Error registrando caja:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
