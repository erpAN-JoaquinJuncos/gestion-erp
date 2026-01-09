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
        const { proveedor, items, total, metodoPago } = body;
        // items: array de { id, nombre, cantidad, costo }

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Lista de compra vacía" }, { status: 400 });
        }

        const sheets = await getGoogleSheetsConnection();
        const spreadsheetId = process.env.GOOGLE_SHEET_ID;

        // 1. LEER PRODUCTOS para obtener indices y stock actual
        const productsRes = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: "Productos!A:F",
        });
        const productRows = productsRes.data.values || [];

        // Mapeo ID -> { rowIndex, currentStock }
        const productMap = new Map();
        productRows.forEach((row, index) => {
            if (index > 0) { // Saltamos header
                productMap.set(row[0], {
                    rowIndex: index + 1,
                    currentStock: parseInt(row[5] || "0")
                });
            }
        });

        // 2. PREPARAR ACTUALIZACIONES DE STOCK (SUMAR)
        const updateRequests = [];

        for (const item of items) {
            const productInfo = productMap.get(item.id);

            if (productInfo) {
                const newStock = productInfo.currentStock + item.cantidad; // SUMAMOS STOCK

                updateRequests.push({
                    range: `Productos!F${productInfo.rowIndex}`,
                    values: [[newStock.toString()]]
                });
            }
        }

        // 3. EJECUTAR BATCH UPDATE (STOCK)
        if (updateRequests.length > 0) {
            await sheets.spreadsheets.values.batchUpdate({
                spreadsheetId,
                requestBody: {
                    valueInputOption: "USER_ENTERED",
                    data: updateRequests
                }
            });
        }

        // 4. REGISTRAR LA COMPRA
        // "ID", "Fecha", "Proveedor", "Items", "Total", "Estado", "Método Pago", "Usuario"
        const itemsResumen = items
            .map((i: any) => `${i.cantidad}x ${i.nombre}`)
            .join(", ");

        const newPurchase = [
            uuidv4(),
            new Date().toISOString().split("T")[0],
            proveedor || "Proveedor General",
            itemsResumen,
            total,
            "Completada",
            metodoPago || "Efectivo",
            session.user?.name || "Desconocido"
        ];

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: "Compras!A:H", // Asumiendo hoja Compras existe con esa estructura
            valueInputOption: "USER_ENTERED",
            requestBody: { values: [newPurchase] },
        });

        // 5. REGISTRAR MOVIMIENTO EN CAJA (EGRESO)
        const newCashMovement = [
            uuidv4(),
            new Date().toISOString().split("T")[0],
            "Egreso", // TIPO
            "Compra Mercadería", // CATEGORIA
            `Compra a ${proveedor || "Proveedor"} - ${itemsResumen}`,
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
            message: "Compra registrada, stock repuesto y caja actualizada."
        });

    } catch (error: any) {
        console.error("Error procesando compra:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
