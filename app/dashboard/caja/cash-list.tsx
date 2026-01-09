import { getCashFlow } from "@/lib/cashflow-service";
import { TrendingUp, TrendingDown } from "lucide-react";

export default async function CashList() {
    const movements = await getCashFlow();

    if (movements.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500 bg-white rounded-xl border border-gray-200 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-400">
                No hay movimientos registrados en caja.
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden dark:bg-gray-900 dark:border-gray-800 transition-colors">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <h3 className="font-semibold text-gray-700 dark:text-gray-200">Historial Reciente</h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {movements.slice(0, 15).map((mov) => (
                    <div key={mov.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-full ${mov.tipo === 'Ingreso' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                                {mov.tipo === 'Ingreso' ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">{mov.descripcion}</p>
                                <div className="flex gap-2 text-xs text-gray-500 dark:text-gray-400">
                                    <span>{mov.fecha}</span>
                                    <span>•</span>
                                    <span>{mov.categoria}</span>
                                </div>
                            </div>
                        </div>
                        <div className={`text-right font-bold ${mov.tipo === 'Ingreso' ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                            {mov.tipo === 'Ingreso' ? '+' : '-'}${mov.monto.toFixed(2)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
