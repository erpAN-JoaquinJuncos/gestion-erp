import { getGoogleSheetsConnection } from "./googleSheets";

export { getGoogleSheetsConnection };

const DEFAULT_SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

export async function appendToSheet(tabName: string, values: any[], spreadsheetId: string = DEFAULT_SPREADSHEET_ID!) {
    if (!spreadsheetId) throw new Error("ID de hoja no configurado");
    const sheets = await getGoogleSheetsConnection();

    const response = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${tabName}!A:A`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
            values: [values],
        },
    });

    return response.data;
}

export async function readSheet(tabName: string, range = "A:Z", spreadsheetId: string = DEFAULT_SPREADSHEET_ID!) {
    if (!spreadsheetId) throw new Error("ID de hoja no configurado");
    const sheets = await getGoogleSheetsConnection();

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId, // Shorthand property
        range: `${tabName}!${range}`,
    });

    return response.data.values || [];
}
