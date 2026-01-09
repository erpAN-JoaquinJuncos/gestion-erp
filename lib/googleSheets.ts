import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";

export async function getAuth() {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    const accessToken = session?.accessToken;

    if (!accessToken) {
        throw new Error("No hay sesión activa o falta el token de acceso");
    }

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });
    return auth;
}

export async function getGoogleSheetsConnection() {
    const auth = await getAuth();
    return google.sheets({ version: "v4", auth });
}

export async function getGoogleDriveConnection() {
    const auth = await getAuth();
    return google.drive({ version: "v3", auth });
}
