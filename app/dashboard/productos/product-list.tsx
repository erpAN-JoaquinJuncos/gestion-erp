import { getProducts } from "@/lib/product-service";
import { Edit, Trash2 } from "lucide-react";

export default async function ProductList() {
    const products = await getProducts();

    if (products.length === 0) {
        return (
            <div className="text-center p-8 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500">No hay productos registrados aún.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700 font-medium">
                        <tr>
                            <th className="px-6 py-3">Nombre</th>
                            <th className="px-6 py-3">Categoría</th>
                            <th className="px-6 py-3">Stock</th>
                            <th className="px-6 py-3">Precio</th>
                            <th className="px-6 py-3 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    {product.nombre}
                                    <div className="text-xs text-gray-500 font-normal">{product.descripcion}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {product.categoria}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`font-semibold ${product.stock <= 5 ? "text-red-600" : "text-gray-700"}`}>
                                        {product.stock}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-green-600 font-bold">
                                    ${product.precio.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-600">
                                            <Edit className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
