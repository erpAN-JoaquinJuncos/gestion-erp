"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

export function ModeToggle() {
    const { setTheme, theme } = useTheme()

    return (
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-full border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <button
                onClick={() => setTheme("light")}
                className={`p-1.5 rounded-full transition-all ${theme === 'light' ? 'bg-white text-yellow-500 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'}`}
                title="Modo Claro"
            >
                <Sun className="h-4 w-4" />
            </button>
            <button
                onClick={() => setTheme("system")}
                className={`p-1.5 rounded-full transition-all ${theme === 'system' ? 'bg-white text-blue-500 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'}`}
                title="Sistema"
            >
                <Monitor className="h-4 w-4" />
            </button>
            <button
                onClick={() => setTheme("dark")}
                className={`p-1.5 rounded-full transition-all ${theme === 'dark' ? 'bg-white text-purple-500 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'}`}
                title="Modo Oscuro"
            >
                <Moon className="h-4 w-4" />
            </button>
        </div>
    )
}
