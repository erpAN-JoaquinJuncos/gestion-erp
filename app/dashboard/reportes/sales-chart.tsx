"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface SalesChartProps {
    data: { mes: string; total: number }[];
}

export function SalesChart({ data }: SalesChartProps) {
    if (data.length === 0) {
        return <div className="h-[300px] flex items-center justify-center text-gray-500">Sin datos de ventas suficientes</div>;
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis
                    dataKey="mes"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar
                    dataKey="total"
                    fill="currentColor"
                    radius={[4, 4, 0, 0]}
                    className="fill-blue-600 dark:fill-blue-500"
                />
            </BarChart>
        </ResponsiveContainer>
    );
}
