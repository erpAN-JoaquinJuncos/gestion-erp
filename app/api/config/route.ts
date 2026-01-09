import { NextResponse } from "next/server";
import { getConfig, saveConfig } from "@/lib/config-service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
    const config = await getConfig();
    return NextResponse.json(config);
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

        const body = await request.json();
        await saveConfig(body);

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Error guardando configuración:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
