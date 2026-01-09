import { getClients } from "@/lib/client-service";
import { User, Phone, MapPin } from "lucide-react";

export default async function ClientList() {
    const clients = await getClients();

    if (clients.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500 bg-white rounded-xl border border-gray-200 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-400">
                No hay clientes registrados aún.
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden dark:bg-gray-900 dark:border-gray-800 transition-colors">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <h3 className="font-semibold text-gray-700 dark:text-gray-200">Cartera de Clientes ({clients.length})</h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {clients.map((client) => (
                    <div key={client.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 font-bold">
                                {client.nombre.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">{client.nombre}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">ID: {client.documento}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                            {client.telefono && client.telefono !== '-' && (
                                <div className="flex items-center gap-1">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                    {client.telefono}
                                </div>
                            )}
                            {client.direccion && client.direccion !== '-' && (
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4 text-gray-400" />
                                    <span className="truncate max-w-[200px]">{client.direccion}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
