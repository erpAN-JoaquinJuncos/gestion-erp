export default function DashboardPage() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Tarjetas de Resumen (Ejemplo) */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-800 transition-colors">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Ventas Totales</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">$0.00</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-800 transition-colors">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Clientes Nuevos</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">0</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-800 transition-colors">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Pedidos Pendientes</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">0</p>
            </div>
        </div>
    );
}
