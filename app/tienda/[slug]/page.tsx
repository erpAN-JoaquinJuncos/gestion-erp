import { getProducts } from "@/lib/product-service";
import { getUserSheetId } from "@/lib/tenant-service";
import { ShoppingCart, MessageCircle, Store } from "lucide-react";
import StoreClient from "./store-client";

interface Props {
    params: {
        slug: string;
    }
}

export default async function StorePage({ params }: Props) {
    // El slug es el email del usuario (dueño de la tienda)
    // Decodificamos el slug (por si viene con %40)
    const ownerEmail = decodeURIComponent(params.slug);

    // 1. Resolvemos el ID de su hoja
    // OJO: getUserSheetId lanzará error si no existe. Deberíamos manejarlo.
    let sheetId = "";
    try {
        sheetId = await getUserSheetId(ownerEmail);
    } catch (e) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-xl shadow-lg">
                    <Store className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <h1 className="text-xl font-bold text-gray-800">Tienda no encontrada</h1>
                    <p className="text-gray-500 mt-2">El usuario {ownerEmail} no tiene una tienda activa.</p>
                </div>
            </div>
        );
    }

    // 2. Obtenemos sus productos
    const products = await getProducts(sheetId);

    // Filtramos solo los que tienen stock
    const availableProducts = products.filter(p => p.stock > 0);

    return (
        <div className="min-h-screen bg-gray-50">
            <StoreClient
                products={availableProducts}
                ownerEmail={ownerEmail}
                storeName={`Tienda de ${ownerEmail.split('@')[0]}`} // Fallback name
            />
        </div>
    );
}
