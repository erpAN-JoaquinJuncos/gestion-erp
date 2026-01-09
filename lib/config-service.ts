import { readSheet, appendToSheet, getGoogleSheetsConnection } from "./data";
import { getUserSheetId } from "./tenant-service";

export interface Config {
    empresaNombre: string;
    empresaDireccion: string;
    ticketHeader: string;
    ticketFooter: string;
    plan: "Free" | "Pro";
}

const DEFAULT_CONFIG: Config = {
    empresaNombre: "Mi Empresa",
    empresaDireccion: "-",
    ticketHeader: "Sistema de Gestión",
    ticketFooter: "¡Gracias por su compra!",
    plan: "Free"
};

export async function getConfig(): Promise<Config> {
    try {
        const sheetId = await getUserSheetId();
        const rows = await readSheet("Configuracion", "A:Z", sheetId);
        // Formato Key-Value: [["Clave", "Valor"], ["empresaNombre", "Mi Tienda"], ...]

        if (rows.length < 1) return DEFAULT_CONFIG;

        const configMap: Record<string, string> = {};
        rows.forEach(row => {
            if (row[0]) configMap[row[0]] = row[1] || "";
        });

        return {
            empresaNombre: configMap["empresaNombre"] || DEFAULT_CONFIG.empresaNombre,
            empresaDireccion: configMap["empresaDireccion"] || DEFAULT_CONFIG.empresaDireccion,
            ticketHeader: configMap["ticketHeader"] || DEFAULT_CONFIG.ticketHeader,
            ticketFooter: configMap["ticketFooter"] || DEFAULT_CONFIG.ticketFooter,
            plan: (configMap["plan"] as "Free" | "Pro") || DEFAULT_CONFIG.plan,
        };
    } catch (error) {
        console.warn("Error leyendo configuración, usando defaults:", error);
        return DEFAULT_CONFIG;
    }
}

export async function saveConfig(newConfig: Partial<Config>) {
    // Esta función es truculenta con Sheets porque es Key-Value.
    // Lo más fácil es "Borrar y Escribir todo" o "Upsert".
    // Dado el bajo volumen, re-escribiremos la hoja 'Configuracion'.

    const sheets = await getGoogleSheetsConnection();
    const spreadsheetId = await getUserSheetId();

    // Construir array de filas
    const current = await getConfig();
    const merged = { ...current, ...newConfig };

    const rows = [
        ["Clave", "Valor"],
        ["empresaNombre", merged.empresaNombre],
        ["empresaDireccion", merged.empresaDireccion],
        ["ticketHeader", merged.ticketHeader],
        ["ticketFooter", merged.ticketFooter],
        ["plan", merged.plan],
    ];

    // Limpiar y escribir
    await sheets.spreadsheets.values.clear({
        spreadsheetId,
        range: "Configuracion!A:B",
    });

    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: "Configuracion!A1",
        valueInputOption: "USER_ENTERED",
        requestBody: { values: rows },
    });

    return true;
}
