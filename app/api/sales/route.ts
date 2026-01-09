import { NextResponse } from "next/server";
import { getGoogleSheetsConnection } from "@/lib/googleSheets";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { v4 as uuidv4 } from "uuid";
import { getUserSheetId } from "@/lib/tenant-service";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

        const body = await request.json();
        const { cliente, items, total, metodoPago } = body;
        // items es un array de { id, nombre, cantidad, precio }

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Carrito vacío" }, { status: 400 });
        }

        const sheets = await getGoogleSheetsConnection();
        // Resolve Tenant ID
        const spreadsheetId = await getUserSheetId(session.user?.email || undefined);

        // 1. LEER PRODUCTOS para obtener sus índices de fila y stock actual
        const productsRes = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: "Productos!A:F", // Leemos ID (A) hasta Stock (F)
        });
        const productRows = productsRes.data.values || [];

        // Mapeo ID -> { rowIndex, currentStock, name }
        const productMap = new Map();
        productRows.forEach((row, index) => {
            // index + 1 es el número de fila real en Sheets (1-based)
            if (index > 0) { // Saltamos header
                productMap.set(row[0], {
                    rowIndex: index + 1,
                    currentStock: parseInt(row[5] || "0"),
                    name: row[1]
                });
            }
        });

        // 2. PREPARAR ACTUALIZACIONES DE STOCK
        const updateRequests = [];

        for (const item of items) {
            const productInfo = productMap.get(item.id);

            if (productInfo) {
                const newStock = Math.max(0, productInfo.currentStock - item.cantidad);

                // Agregar update a la cola: Escribe en la celda F{rowIndex}
                updateRequests.push({
                    range: `Productos!F${productInfo.rowIndex}`,
                    values: [[newStock.toString()]] // Debe ser array de arrays
                });
            }
        }

        // 3. EJECUTAR ACTUALIZACIONES DE STOCK (Batch Update de Values)
        if (updateRequests.length > 0) {
            await sheets.spreadsheets.values.batchUpdate({
                spreadsheetId,
                requestBody: {
                    valueInputOption: "USER_ENTERED",
                    data: updateRequests
                }
            });
        }

        // 4. REGISTRAR LA VENTA (Append)
        const itemsResumen = items
            .map((i: any) => `${i.cantidad}x ${i.nombre}`)
            .join(", ");

        const newSale = [
            uuidv4(),
            new Date().toISOString().split("T")[0],
            cliente || "Consumidor Final",
            itemsResumen,
            total,
            "Completada",
            metodoPago || "Efectivo",
            session.user?.name || "Desconocido"
        ];

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: "Ventas!A:H",
            valueInputOption: "USER_ENTERED",
            requestBody: { values: [newSale] },
        });

        // 5. REGISTRAR MOVIMIENTO EN CAJA (Nuevo!)
        // "ID", "Fecha", "Tipo", "Categoría", "Descripción", "Monto", "Método Pago", "Usuario"
        const newCashMovement = [
            uuidv4(),
            new Date().toISOString().split("T")[0],
            "Ingreso",
            "Venta",
            `Venta a ${cliente || "Consumidor Final"} - ${itemsResumen}`,
            total,
            metodoPago || "Efectivo",
            session.user?.name || "Desconocido"
        ];

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: "Caja!A:H",
            valueInputOption: "USER_ENTERED",
            requestBody: { values: [newCashMovement] },
        });

        return NextResponse.json({
            success: true,
            message: "Venta registrada, stock actualizado y caja ingresada."
        });

    } catch (error: any) {
        console.error("Error procesando venta:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
