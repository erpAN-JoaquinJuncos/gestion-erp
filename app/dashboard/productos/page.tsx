import ProductForm from "./product-form";
import ProductList from "./product-list";
import { Package, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function Page() {
    return (
        <div className="space-y-8">

            {/* Cabecera */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="h-6 w-6 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Package className="h-8 w-8 text-blue-600" />
                        Gestión de Productos
                    </h1>
                    <p className="text-gray-500">Administra tu inventario y precios</p>
                </div>
            </div>

            {/* Formulario de Carga (Cliente) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Agregar Nuevo Producto</h2>
                <ProductForm />
            </div>

            {/* Lista de Productos (Servidor) */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800">Inventario Actual</h2>
                <Suspense fallback={<div className="text-center p-4">Cargando productos...</div>}>
                    <ProductList />
                </Suspense>
            </div>

        </div>
    );
}
