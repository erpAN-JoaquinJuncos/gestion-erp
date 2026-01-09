import { getGoogleSheetsConnection } from "./googleSheets";

export async function setupSheetStructure(spreadsheetId: string) {
    const sheets = await getGoogleSheetsConnection();

    // Estructura de pestañas con columnas "SaaS Ready"
    // Añadimos 'Usuario' en todas para tracking
    const tabsStructure: Record<string, string[]> = {
        "Ventas": ["ID", "Fecha", "Cliente", "Items", "Total", "Estado", "Método Pago", "Usuario"],
        "Compras": ["ID", "Fecha", "Proveedor", "Detalle", "Monto", "Estado", "Comprobante", "Usuario"],
        "Productos": ["ID", "Nombre", "Descripción", "Precio", "Costo", "Stock", "Categoría", "Imagen"],
        "Caja": ["ID", "Fecha", "Tipo", "Categoría", "Descripción", "Monto", "Método Pago", "Usuario"],
        "Clientes": ["ID", "Nombre", "Documento", "Teléfono", "Email", "Dirección", "Fecha Registro"],
        "Configuracion": ["Clave", "Valor"], // Para guardar nombre empresa, plan, etc.
    };

    const results = [];

    for (const [tabName, headers] of Object.entries(tabsStructure)) {
        try {
            // 1. Crear Pestaña (Si existe, ignora error)
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
            }).catch(() => { });

            // 2. Escribir Encabezados
            await sheets.spreadsheets.values.update({
                spreadsheetId,
                range: `'${tabName}'!A1:Z1`,
                valueInputOption: "USER_ENTERED",
                requestBody: {
                    values: [headers],
                },
            });

            // 3. (Opcional) Borrar "Hoja 1" si es una hoja nueva
            // No lo haremos para evitar errores si es la única hoja

            results.push(`✅ ${tabName}`);
        } catch (err: any) {
            console.error(`Error setup ${tabName}:`, err);
            results.push(`❌ ${tabName}`);
        }
    }

    // Insertar Configuración Default
    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: "Configuracion!A:B",
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [
                    ["empresaNombre", "Mi Negocio Nuevo"],
                    ["ticketHeader", "Sistema ERP"],
                    ["ticketFooter", "Gracias por su compra"],
                    ["plan", "Free"] // Por defecto Free
                ]
            }
        });
    } catch (e) { }

    return results;
}
