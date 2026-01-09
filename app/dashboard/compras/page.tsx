import { getProducts } from "@/lib/product-service";
import PurchaseForm from "./purchase-form";
import { ShoppingBag } from "lucide-react";

export default async function ComprasPage() {
    const products = await getProducts();

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2 dark:text-white">
                        <ShoppingBag className="h-8 w-8 text-blue-600 dark:text-blue-500" />
                        Compras y Abastecimiento
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">Repone stock y registra egresos de mercadería</p>
                </div>
            </div>

            <PurchaseForm initialProducts={products} />
        </div>
    );
}
