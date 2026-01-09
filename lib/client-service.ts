import { readSheet } from "./data";
import { getUserSheetId } from "./tenant-service";

export interface Client {
    id: string;
    nombre: string;
    documento: string;
    telefono: string;
    email: string;
    direccion: string;
}

export async function getClients(): Promise<Client[]> {
    try {
        const sheetId = await getUserSheetId();
        const rows = await readSheet("Clientes", "A:F", sheetId);

        // Skip header
        const dataRows = rows.slice(1);

        return dataRows.map(row => ({
            id: row[0],
            nombre: row[1],
            documento: row[2],
            telefono: row[3],
            email: row[4],
            direccion: row[5]
        }));
    } catch (error) {
        console.error("Error fetching clients:", error);
        return [];
    }
}
