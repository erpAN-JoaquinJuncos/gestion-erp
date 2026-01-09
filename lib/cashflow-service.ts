import { readSheet } from "@/lib/data";

export interface CashMovement {
    id: string;
    fecha: string;
    tipo: "Ingreso" | "Egreso";
    categoria: string;
    descripcion: string;
    monto: number;
    metodoPago: string;
    usuario: string;
}

export async function getCashFlow(): Promise<CashMovement[]> {
    try {
        const rows = await readSheet("Caja");
        // Headers: "ID", "Fecha", "Tipo", "Categoría", "Descripción", "Monto", "Método Pago", "Usuario"

        return rows.slice(1).reverse().map((row) => ({
            id: row[0],
            fecha: row[1],
            tipo: row[2] as "Ingreso" | "Egreso",
            categoria: row[3],
            descripcion: row[4],
            monto: Number(row[5]) || 0,
            metodoPago: row[6],
            usuario: row[7],
        }));
    } catch (error) {
        console.error("Error obteniendo caja:", error);
        return [];
    }
}
