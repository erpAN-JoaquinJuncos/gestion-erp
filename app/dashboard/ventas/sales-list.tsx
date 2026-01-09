import { getSales } from "@/lib/sales-service";

export default async function SalesList() {
    const sales = await getSales();

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden dark:bg-gray-900 dark:border-gray-800 transition-colors">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Últimas Ventas Registradas</h2>
            </div>

            {sales.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    No hay ventas registradas aún.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-700 font-medium dark:bg-gray-800 dark:text-gray-300">
                            <tr>
                                <th className="px-6 py-3">Fecha</th>
                                <th className="px-6 py-3">Cliente</th>
                                <th className="px-6 py-3">Detalle</th>
                                <th className="px-6 py-3">Pago</th>
                                <th className="px-6 py-3 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {sales.slice(0, 10).map((sale) => (
                                <tr key={sale.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                                        {sale.fecha}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200">
                                        {sale.cliente}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate dark:text-gray-400" title={sale.items}>
                                        {sale.items}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                            {sale.metodoPago}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-gray-900 dark:text-white">
                                        ${sale.total.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
