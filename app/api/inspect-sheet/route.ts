import { NextResponse, NextRequest } from "next/server";
import { getGoogleSheetsConnection } from "@/lib/googleSheets";

export async function GET(request: NextRequest) {
    try {
        const sheets = await getGoogleSheetsConnection();
        const spreadsheetId = process.env.GOOGLE_SHEET_ID;

        if (!spreadsheetId) {
            return NextResponse.json({ error: "Falta el ID de la hoja" }, { status: 500 });
        }

        // Obtenemos el parámetro 'tab' de la URL
        const { searchParams } = new URL(request.url);
        const tabName = searchParams.get("tab");

        if (tabName) {
            // Si hay nombre de pestaña, leemos su primera fila (encabezados)
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range: `'${tabName}'!A1:Z1`,
            });
            return NextResponse.json({
                success: true,
                tab: tabName,
                headers: response.data.values?.[0] || [],
                message: `Columnas encontradas en '${tabName}'`
            });
        }

        // Si no hay tab, listamos todas las pestañas (comportamiento anterior)
        // Obtenemos los metadatos de la hoja completa
        const response = await sheets.spreadsheets.get({
            spreadsheetId,
        });

        // Extraemos los títulos de las pestañas (hojas individuales)
        const tabs = response.data.sheets?.map(sheet => sheet.properties?.title) || [];

        return NextResponse.json({
            success: true,
            tabs,
            message: `Encontré ${tabs.length} pestañas.`
        });

    } catch (error: any) {
        console.error("Error al inspeccionar hoja:", error);
        return NextResponse.json({
            error: error.message,
            success: false
        }, { status: 500 });
    }
}
