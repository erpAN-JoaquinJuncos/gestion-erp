import { NextResponse } from "next/server";
import { getGoogleSheetsConnection } from "@/lib/googleSheets";

export async function GET() {
    try {
        const sheets = await getGoogleSheetsConnection();
        const spreadsheetId = process.env.GOOGLE_SHEET_ID;

        if (!spreadsheetId) {
            return NextResponse.json({ error: "Falta el ID de la hoja" }, { status: 500 });
        }

        // Leemos la primera fila (encabezados)
        try {
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range: "A1:Z1", // Asumimos que los títulos están en la primera fila
            });
            const headers = response.data.values?.[0] || [];
            return NextResponse.json({ success: true, headers, message: "Conexión exitosa" });
        } catch (sheetError: any) {
            console.error("Error detallado de Sheets:", JSON.stringify(sheetError, null, 2));
            throw sheetError;
        }

    } catch (error: any) {
        console.error("Error General:", error);
        return NextResponse.json({
            error: error.message,
            details: error.response?.data || "Sin detalles",
            success: false
        }, { status: 500 });
    }
}
