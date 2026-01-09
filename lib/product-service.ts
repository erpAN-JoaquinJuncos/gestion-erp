import { readSheet } from "./data";
import { getUserSheetId } from "./tenant-service";

export interface Product {
    id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    costo: number;
    stock: number;
    categoria: string;
    imagen: string;
}

export async function getProducts(explicitSheetId?: string): Promise<Product[]> {
    try {
        const sheetId = explicitSheetId || await getUserSheetId();
        const rows = await readSheet("Productos", "A:H", sheetId);

        // Skip header
        const dataRows = rows.slice(1);

        return dataRows.map(row => ({
            id: row[0],
            nombre: row[1],
            descripcion: row[2],
            precio: Number(row[3]),
            costo: Number(row[4]),
            stock: Number(row[5]),
            categoria: row[6],
            imagen: row[7]
        }));
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}
