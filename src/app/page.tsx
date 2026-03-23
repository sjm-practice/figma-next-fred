"use client";

import { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";

// --- Types ---

type DataPoint = { date: string; value: number };

// --- FRED Series Config ---

const chartConfigs = [
  {
    seriesId: "CPIAUCSL",
    title: "CPI - last five years",
    source: "U.S. Bureau of Labor Statistics",
  },
  {
    seriesId: "UNRATE",
    title: "Intra-Annual Labor Statistics: Unemployment Rate Total",
    source: "U.S. Bureau of Labor Statistics",
    yDomain: [0, 8] as [number, number],
  },
  {
    seriesId: "GS10",
    title: "Interest Rates: Long-Term Government Bond Yields: 10-Year",
    source: "Board of Governors of the Federal Reserve System (US)",
  },
  {
    seriesId: "TB3MS",
    title: "Interest Rates: 3-Month or 90-Day Rates and Yields",
    source: "Board of Governors of the Federal Reserve System (US)",
  },
];

// --- Navigation Items ---

const navItems = [
  { label: "Key Indicators", icon: BarChart3 },
  { label: "Inflation", icon: TrendingUp },
  { label: "Employment", icon: Briefcase },
  { label: "Interest Rates", icon: Percent },
  { label: "Economic Growth", icon: Activity },
  { label: "Exchange Rates", icon: ArrowLeftRight },
  { label: "Housing", icon: HomeIcon },
  { label: "Consumer Spending", icon: ShoppingCart },
];

// --- Data Fetching Hook ---

function useFredData(seriesId: string) {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/fred?series_id=${seriesId}`);
        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.error || `HTTP ${res.status}`);
        }
        const json = await res.json();
        setData(json.observations);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [seriesId]);

  return { data, loading, error };
}

// --- Chart Card Component ---

function ChartCard({
  title,
  seriesId,
  source,
  color = "#4a7fc1",
  yDomain,
}: {
  title: string;
  seriesId: string;
  source: string;
  color?: string;
  yDomain?: [number, number];
}) {
  const { data, loading, error } = useFredData(seriesId);

  return (
    <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-gray-800">{title}</h3>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-bold text-gray-700 tracking-wide">FRED</span>
        <span className="text-[10px] text-gray-400 truncate">{title}</span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[200px] text-gray-400">
          <Loader2 size={24} className="animate-spin" />
          <span className="ml-2 text-sm">Loading data...</span>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[200px] text-red-400 text-sm">
          {error}
        </div>
      ) : (
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
                const monthName = new Date(Number(year), Number(month) - 1).toLocaleString(
                  "default",
                  { month: "short" }
                );
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
      )}

      <p className="mt-2 text-[9px] text-gray-400">
        Source: {source} via FRED
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
          {chartConfigs.map((config) => (
            <ChartCard
              key={config.seriesId}
              title={config.title}
              seriesId={config.seriesId}
              source={config.source}
              color="#4a7fc1"
              yDomain={config.yDomain}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
