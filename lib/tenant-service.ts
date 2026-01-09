import { readSheet, appendToSheet } from "./data"; // appendToSheet usa data.ts que usa connection.
import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";
import { getGoogleDriveConnection } from "./googleSheets";
import { setupSheetStructure } from "./sheet-setup";

const MASTER_SHEET_ID = process.env.GOOGLE_SHEET_ID;

// Cache simple
const userSheetCache: Record<string, string> = {};

export async function getUserSheetId(email?: string): Promise<string> {
    if (!email) {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) throw new Error("Usuario no identificado");
        email = session.user.email;
    }

    // 1. Check Cache
    if (userSheetCache[email!]) return userSheetCache[email!];

    // 2. Check Master Sheet ("Usuarios")
    if (!MASTER_SHEET_ID) throw new Error("MASTER_SHEET_ID no configurado");

    try {
        // Leemos la hoja Maestra explícitamente pasando su ID
        const users = await readSheet("Usuarios", "A:C", MASTER_SHEET_ID);
        const userRow = users.find(row => row[0] === email);

        if (userRow && userRow[1]) {
            userSheetCache[email!] = userRow[1];
            return userRow[1];
        }
    } catch (e) {
        console.warn("Error leyendo tabla Usuarios, intentando provisión...", e);
    }

    // 3. Auto-Provisioning (Activado para SaaS)
    console.log(`Usuario nuevo ${email} detectado. Iniciando Auto-Provisioning...`);
    try {
        const newSheetId = await createSheetForUser(email!);
        userSheetCache[email!] = newSheetId;
        return newSheetId;
    } catch (error) {
        console.error("Fallo crítico en Auto-Provisioning:", error);
        // Fallback a Master Sheet para no romper la app, pero esto mezclará datos si falla
        return MASTER_SHEET_ID;
    }
}

async function createSheetForUser(email: string): Promise<string> {
    const drive = await getGoogleDriveConnection();

    // 1. Crear Archivo en Drive
    const fileMetadata = {
        name: `ERP - ${email}`,
        mimeType: 'application/vnd.google-apps.spreadsheet',
    };

    const file = await drive.files.create({
        requestBody: fileMetadata,
        fields: 'id',
    });

    const spreadsheetId = file.data.id;
    if (!spreadsheetId) throw new Error("No se pudo crear la hoja de cálculo");

    // 2. Compartir con el usuario (Writer)
    // Esto permite que el usuario vea su propia hoja en SU Google Drive
    try {
        await drive.permissions.create({
            fileId: spreadsheetId,
            requestBody: {
                role: 'writer',
                type: 'user',
                emailAddress: email
            }
        });
    } catch (e) {
        console.warn("No se pudo compartir hoja con usuario (quizás email inválido o permissions insuficientes):", e);
        // Continuamos, la app podrá usarla porque el ServiceAccount es dueño
    }

    // 3. Configurar Estructura (Tabs)
    await setupSheetStructure(spreadsheetId);

    // 4. Registrar en Master Sheet
    // [Email, SpreadsheetId, Plan, Fecha]
    const newUserRow = [email, spreadsheetId, "Free", new Date().toISOString()];

    // Usamos appendToSheet forzando el ID de la Master Sheet
    if (MASTER_SHEET_ID) {
        await appendToSheet("Usuarios", newUserRow, MASTER_SHEET_ID);
    }

    return spreadsheetId;
}
