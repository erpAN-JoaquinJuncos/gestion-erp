import { readSheet } from "@/lib/data";
import { getUserSheetId } from "@/lib/tenant-service";

export interface Sale {
    id: string;
    fecha: string;
    cliente: string;
    items: string;
    total: number;
    estado: string;
    metodoPago: string;
    usuario: string;
}

export async function getSales(): Promise<Sale[]> {
    try {
        const sheetId = await getUserSheetId();
        const rows = await readSheet("Ventas", "A:H", sheetId);
        // Headers: ["ID", "Fecha", "Cliente", "Items", "Total", "Estado", "Método Pago", "Usuario"]

        // Invertimos el array (.reverse()) para mostrar las últimas ventas primero
        return rows.slice(1).reverse().map((row) => ({
            id: row[0],
            fecha: row[1],
            cliente: row[2],
            items: row[3],
            total: Number(row[4]) || 0,
            estado: row[5],
            metodoPago: row[6],
            usuario: row[7],
        }));
    } catch (error) {
        console.error("Error obteniendo ventas:", error);
        return [];
    }
}
