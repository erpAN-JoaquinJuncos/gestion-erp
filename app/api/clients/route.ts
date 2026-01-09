import { NextResponse } from "next/server";
import { appendToSheet } from "@/lib/data";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { v4 as uuidv4 } from "uuid";
import { getClients } from "@/lib/client-service";
import { getUserSheetId } from "@/lib/tenant-service";

export async function GET() {
    const clients = await getClients();
    return NextResponse.json(clients);
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

        const body = await request.json();
        const { nombre, documento, telefono, email, direccion } = body;

        if (!nombre) {
            return NextResponse.json({ error: "Nombre es requerido" }, { status: 400 });
        }

        const sheetId = await getUserSheetId(session.user?.email || undefined);

        // "ID", "Nombre", "Documento", "Teléfono", "Email", "Dirección", "Fecha Registro"
        const newClient = [
            uuidv4(),
            nombre,
            documento || "-",
            telefono || "-",
            email || "-",
            direccion || "-",
            new Date().toISOString().split("T")[0]
        ];

        await appendToSheet("Clientes", newClient, sheetId);

        return NextResponse.json({ success: true, message: "Cliente registrado" });

    } catch (error: any) {
        console.error("Error creando cliente:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
