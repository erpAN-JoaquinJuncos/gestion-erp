"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileSpreadsheet, Settings, LogOut, Package, ShoppingCart, ShoppingBag, Wallet, BarChart3, Users } from "lucide-react";
import { signOut } from "next-auth/react";
import { ModeToggle } from "./mode-toggle";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Productos", href: "/dashboard/productos", icon: Package },
    { name: "Ventas", href: "/dashboard/ventas", icon: ShoppingCart },
    { name: "Compras", href: "/dashboard/compras", icon: ShoppingBag },
    { name: "Caja", href: "/dashboard/caja", icon: Wallet },
    { name: "Clientes", href: "/dashboard/clientes", icon: Users },
    { name: "Reportes", href: "/dashboard/reportes", icon: BarChart3 },
    { name: "Configuración", href: "/dashboard/configuracion", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200 dark:bg-gray-900 dark:border-gray-800">
            <div className="flex h-16 items-center justify-center border-b border-gray-200 px-4 dark:border-gray-800">
                <div className="text-center">
                    <h1 className="text-2xl font-black text-blue-600 tracking-tighter">erpAN</h1>
                    <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">Por Joaquin Juncos</p>
                </div>
            </div>
            <nav className="flex-1 space-y-1 px-2 py-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive
                                ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                                }`}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
            <div className="border-t border-gray-200 p-4 space-y-4 dark:border-gray-800">
                <div className="flex justify-center">
                    <ModeToggle />
                </div>
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors dark:hover:bg-red-900/10"
                >
                    <LogOut className="h-5 w-5" />
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
}
