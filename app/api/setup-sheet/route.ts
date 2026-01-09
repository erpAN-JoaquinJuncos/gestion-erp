import { NextResponse } from "next/server";
import { getGoogleSheetsConnection } from "@/lib/googleSheets";

export async function GET() {
    try {
        const sheets = await getGoogleSheetsConnection();
        const spreadsheetId = process.env.GOOGLE_SHEET_ID;

        if (!spreadsheetId) {
            return NextResponse.json({ error: "Falta el ID de la hoja" }, { status: 500 });
        }

        // Definimos la estructura de todas las pestañas
        const tabsStructure: Record<string, string[]> = {
            "Ventas": ["ID", "Fecha", "Cliente", "Items", "Total", "Estado", "Método Pago", "Usuario"],
            "Compras": ["ID", "Fecha", "Proveedor", "Detalle", "Monto", "Estado", "Comprobante", "Usuario"],
            "Productos": ["ID", "Nombre", "Descripción", "Precio", "Costo", "Stock", "Categoría", "Imagen"],
            "Caja": ["ID", "Fecha", "Tipo", "Categoría", "Descripción", "Monto", "Método Pago", "Usuario"],
            "Clientes": ["ID", "Nombre", "Teléfono", "Email", "Dirección", "Notas"],
        };

        const results = [];

        // Iteramos por cada pestaña para crearla y poner cabeceras
        for (const [tabName, headers] of Object.entries(tabsStructure)) {
            try {
                // 1. Intentamos añadir la pestaña (fallará si ya existe, no importa)
                await sheets.spreadsheets.batchUpdate({
                    spreadsheetId,
                    requestBody: {
                        requests: [
                            {
                                addSheet: {
                                    properties: { title: tabName },
                                },
                            },
                        ],
                    },
                }).catch(() => { }); // Ignoramos error si ya existe

                // 2. Escribimos los encabezados
                await sheets.spreadsheets.values.update({
                    spreadsheetId,
                    range: `'${tabName}'!A1:Z1`,
                    valueInputOption: "USER_ENTERED",
                    requestBody: {
                        values: [headers],
                    },
                });

                results.push(`✅ ${tabName} configurada`);
            } catch (err: any) {
                results.push(`❌ Error en ${tabName}: ${err.message}`);
            }
        }

        return NextResponse.json({
            success: true,
            message: "Estructura generada exitosamente.",
            details: results
        });

    } catch (error: any) {
        console.error("Error general:", error);
        return NextResponse.json({
            error: error.message,
            success: false
        }, { status: 500 });
    }
}
