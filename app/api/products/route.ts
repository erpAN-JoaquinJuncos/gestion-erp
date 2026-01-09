import { NextResponse } from "next/server";
import { appendToSheet } from "@/lib/data";
import { getUserSheetId } from "@/lib/tenant-service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { v4 as uuidv4 } from "uuid";
import { getConfig } from "@/lib/config-service";
import { getProducts } from "@/lib/product-service";

// Estructura esperada en Sheet "Productos":
// ["ID", "Nombre", "Descripción", "Precio", "Costo", "Stock", "Categoría", "Imagen"]

// ... existing imports ...

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        // Resolve Tenant ID
        const sheetId = await getUserSheetId(session.user?.email || undefined);

        const body = await request.json();
        const { nombre, descripcion, precio, costo, stock, categoria, imagen } = body;

        // Validación básica
        if (!nombre || !precio) {
            return NextResponse.json({ error: "Nombre y Precio son obligatorios" }, { status: 400 });
        }

        const config = await getConfig(); // getConfig uses getUserSheetId internally
        if (config.plan === "Free") {
            const currentProducts = await getProducts(); // getProducts uses getUserSheetId internally
            if (currentProducts.length >= 50) {
                return NextResponse.json({
                    error: "Límite de productos alcanzado (50). Actualiza a PRO para ilimitados."
                }, { status: 403 });
            }
        }

        const newProduct = [
            uuidv4(), // ID único
            nombre,
            descripcion || "",
            precio,
            costo || 0,
            stock || 0,
            categoria || "General",
            imagen || ""
        ];

        await appendToSheet("Productos", newProduct, sheetId);

        return NextResponse.json({ success: true, message: "Producto guardado correctamente" });

    } catch (error: any) {
        console.error("Error guardando producto:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
