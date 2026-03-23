"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  BarChart3,
  TrendingUp,
  Briefcase,
  Percent,
  Activity,
  ArrowLeftRight,
  Home as HomeIcon,
  ShoppingCart,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

// --- Mock Data ---

const cpiData = [
  { date: "2021-01", value: 261.6 },
  { date: "2021-04", value: 265.7 },
  { date: "2021-07", value: 272.3 },
  { date: "2021-10", value: 277.0 },
  { date: "2022-01", value: 281.9 },
  { date: "2022-04", value: 289.1 },
  { date: "2022-07", value: 296.3 },
  { date: "2022-10", value: 298.0 },
  { date: "2023-01", value: 300.5 },
  { date: "2023-04", value: 303.4 },
  { date: "2023-07", value: 305.7 },
  { date: "2023-10", value: 307.7 },
  { date: "2024-01", value: 309.7 },
  { date: "2024-04", value: 313.2 },
  { date: "2024-07", value: 314.5 },
  { date: "2024-10", value: 315.5 },
  { date: "2025-01", value: 317.7 },
  { date: "2025-04", value: 318.2 },
  { date: "2025-07", value: 316.8 },
  { date: "2025-10", value: 319.5 },
  { date: "2026-01", value: 321.1 },
];

const unemploymentData = [
  { date: "2021-01", value: 6.7 },
  { date: "2021-04", value: 6.0 },
  { date: "2021-07", value: 5.4 },
  { date: "2021-10", value: 4.6 },
  { date: "2022-01", value: 4.0 },
  { date: "2022-04", value: 3.6 },
  { date: "2022-07", value: 3.5 },
  { date: "2022-10", value: 3.7 },
  { date: "2023-01", value: 3.4 },
  { date: "2023-04", value: 3.4 },
  { date: "2023-07", value: 3.5 },
  { date: "2023-10", value: 3.9 },
  { date: "2024-01", value: 3.7 },
  { date: "2024-04", value: 3.9 },
  { date: "2024-07", value: 4.3 },
  { date: "2024-10", value: 4.1 },
  { date: "2025-01", value: 4.0 },
  { date: "2025-04", value: 4.2 },
  { date: "2025-07", value: 4.1 },
  { date: "2025-10", value: 4.0 },
  { date: "2026-01", value: 4.1 },
];

const bondYield10YData = [
  { date: "2021-01", value: 1.09 },
  { date: "2021-04", value: 1.63 },
  { date: "2021-07", value: 1.32 },
  { date: "2021-10", value: 1.55 },
  { date: "2022-01", value: 1.78 },
  { date: "2022-04", value: 2.84 },
  { date: "2022-07", value: 2.90 },
  { date: "2022-10", value: 3.98 },
  { date: "2023-01", value: 3.53 },
  { date: "2023-04", value: 3.46 },
  { date: "2023-07", value: 3.96 },
  { date: "2023-10", value: 4.62 },
  { date: "2024-01", value: 4.10 },
  { date: "2024-04", value: 4.50 },
  { date: "2024-07", value: 4.25 },
  { date: "2024-10", value: 4.28 },
  { date: "2025-01", value: 4.57 },
  { date: "2025-04", value: 4.35 },
  { date: "2025-07", value: 4.40 },
  { date: "2025-10", value: 4.30 },
  { date: "2026-01", value: 4.45 },
];

const rates3MonthData = [
  { date: "2021-01", value: 0.06 },
  { date: "2021-04", value: 0.03 },
  { date: "2021-07", value: 0.05 },
  { date: "2021-10", value: 0.05 },
  { date: "2022-01", value: 0.22 },
  { date: "2022-04", value: 0.83 },
  { date: "2022-07", value: 2.40 },
  { date: "2022-10", value: 3.98 },
  { date: "2023-01", value: 4.64 },
  { date: "2023-04", value: 5.07 },
  { date: "2023-07", value: 5.40 },
  { date: "2023-10", value: 5.35 },
  { date: "2024-01", value: 5.36 },
  { date: "2024-04", value: 5.37 },
  { date: "2024-07", value: 5.25 },
  { date: "2024-10", value: 4.60 },
  { date: "2025-01", value: 4.35 },
  { date: "2025-04", value: 4.30 },
  { date: "2025-07", value: 4.25 },
  { date: "2025-10", value: 4.20 },
  { date: "2026-01", value: 4.30 },
];

// --- Navigation Items ---

const navItems = [
  { label: "Key Indicators", icon: BarChart3, active: true },
  { label: "Inflation", icon: TrendingUp },
  { label: "Employment", icon: Briefcase },
  { label: "Interest Rates", icon: Percent },
  { label: "Economic Growth", icon: Activity },
  { label: "Exchange Rates", icon: ArrowLeftRight },
  { label: "Housing", icon: HomeIcon },
  { label: "Consumer Spending", icon: ShoppingCart },
];

// --- Chart Card Component ---

function ChartCard({
  title,
  data,
  color = "#4a7fc1",
  yDomain,
}: {
  title: string;
  data: { date: string; value: number }[];
  color?: string;
  yDomain?: [number, number];
}) {
  return (
    <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-gray-800">{title}</h3>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-bold text-gray-700 tracking-wide">FRED</span>
        <span className="text-[10px] text-gray-400 truncate">
          {title}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            tickFormatter={(v) => {
              const [year, month] = v.split("-");
              return month === "01" ? year : "";
            }}
            interval={0}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            domain={yDomain || ["auto", "auto"]}
            width={40}
          />
          <Tooltip
            contentStyle={{ fontSize: 12 }}
            labelFormatter={(label) => {
              const [year, month] = label.split("-");
              const monthName = new Date(Number(year), Number(month) - 1).toLocaleString("default", { month: "short" });
              return `${monthName} ${year}`;
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="mt-2 text-[9px] text-gray-400">
        Source: Organization for Economic Cooperation and Development via FRED
      </p>
    </div>
  );
}

// --- Main Page ---

export default function Home() {
  const [activeNav, setActiveNav] = useState("Key Indicators");

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      {/* Sidebar */}
      <aside className="w-64 min-h-screen bg-[var(--sidebar-bg)] border-r border-[var(--card-border)] flex flex-col">
        <div className="p-5 pb-4">
          <h1 className="text-lg font-bold text-gray-900">FRED Indicators</h1>
          <p className="text-xs text-gray-500">Economic Data Dashboard</p>
        </div>
        <nav className="flex-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.label;
            return (
              <button
                key={item.label}
                onClick={() => setActiveNav(item.label)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 mb-0.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--sidebar-active)] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon size={18} />
                <span className="flex-1 text-left">{item.label}</span>
                {isActive ? (
                  <ChevronDown size={16} className="text-white/70" />
                ) : (
                  <ChevronRight size={16} className="text-gray-400" />
                )}
              </button>
            );
          })}
        </nav>
        <div className="p-4 text-[10px] text-gray-400 leading-tight">
          Data provided by Federal Reserve Economic Data (FRED)
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          Economic Indicators Dashboard
        </h1>
        <p className="text-gray-500 mb-8">
          Real-time economic data from the Federal Reserve Economic Data (FRED) system
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="CPI - last five years"
            data={cpiData}
            color="#4a7fc1"
          />
          <ChartCard
            title="Intra-Annual Labor Statistics: Unemployment Rate Total"
            data={unemploymentData}
            color="#4a7fc1"
            yDomain={[0, 8]}
          />
          <ChartCard
            title="Interest Rates: Long-Term Government Bond Yields: 10-Year"
            data={bondYield10YData}
            color="#4a7fc1"
          />
          <ChartCard
            title="Interest Rates: 3-Month or 90-Day Rates and Yields"
            data={rates3MonthData}
            color="#4a7fc1"
          />
        </div>
      </main>
    </div>
  );
}
