import { getProducts } from "@/lib/product-service";
import { getClients } from "@/lib/client-service";
import { getConfig } from "@/lib/config-service";
import PosForm from "./pos-form";
import SalesList from "./sales-list";
import { ShoppingCart } from "lucide-react";
import { Suspense } from "react";

export default async function VentasPage() {
    const products = await getProducts();
    const clients = await getClients();
    const config = await getConfig();

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2 dark:text-white">
                        <ShoppingCart className="h-8 w-8 text-green-600 dark:text-green-500" />
                        Nueva Venta
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">Registra salidas y movimientos de caja</p>
                </div>
            </div>

            <PosForm initialProducts={products} initialClients={clients} initialConfig={config} />

            <Suspense fallback={<div>Cargando historial...</div>}>
                <SalesList />
            </Suspense>
        </div>
    );
}
