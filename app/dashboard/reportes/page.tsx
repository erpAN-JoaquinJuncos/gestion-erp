import { getDashboardStats } from "@/lib/reports-service";
import { SalesChart } from "./sales-chart";
import { ProductsChart } from "./products-chart";
import { BarChart3, TrendingUp, TrendingDown, Package, DollarSign } from "lucide-react";

export default async function ReportsPage() {
    const stats = await getDashboardStats();

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2 dark:text-white">
                        <BarChart3 className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                        Reportes y Métricas
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">Visión general del rendimiento de tu negocio</p>
                </div>
            </div>

            {/* Tarjetas de Resumen (KPIs) */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Ventas Totales</h3>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                        ${stats.totalVentas.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        En {stats.ventasCount} operaciones
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Compras (Costo)</h3>
                        <ShoppingBagIcon className="h-4 w-4 text-blue-500" />
                    </div>
                    <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                        ${stats.totalCompras.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        En {stats.comprasCount} operaciones
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Balance de Caja</h3>
                        <WalletIcon className="h-4 w-4 text-purple-500" />
                    </div>
                    <p className={`mt-2 text-2xl font-bold ${stats.balanceCaja >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        ${stats.balanceCaja.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Dinero líquido disponible
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Top Producto</h3>
                        <Package className="h-4 w-4 text-orange-500" />
                    </div>
                    <p className="mt-2 text-lg font-bold text-gray-900 truncate dark:text-white">
                        {stats.topProductos[0]?.nombre || "N/A"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {stats.topProductos[0]?.cantidad || 0} unidades vendidas
                    </p>
                </div>
            </div>

            {/* Gráficos */}
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                    <h3 className="text-lg font-semibold mb-6 text-gray-800 dark:text-white">Evolución de Ventas</h3>
                    <SalesChart data={stats.ventasPorMes} />
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                    <h3 className="text-lg font-semibold mb-6 text-gray-800 dark:text-white">Productos Más Vendidos</h3>
                    <ProductsChart data={stats.topProductos} />
                </div>
            </div>

        </div>
    );
}

function ShoppingBagIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
    )
}

function WalletIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
            <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
        </svg>
    )
}
