"use client";
import React, { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Calendar, ArrowLeftRight, Download, Share2, Info } from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useParams } from "next/navigation";
import Link from "next/link";
import handleError from "@/lib/handleError";
import axiosInstance from "@/lib/axiosInstance";
import Breadcrumb from "@/components/pages/specification/Breadcrumb";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);

export default function Page() {
  const { duration, pair } = useParams();
  const [from, to] = pair.toUpperCase().split("-TO-");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axiosInstance.get(`/website/currency/history/${pair}/${duration}`);
        setHistory(data?.data || []);
      } catch (error) {
        handleError(error);
      }
    };
    getData();
  }, [duration, pair]);

  // Calculate statistics
  const rates = history.map((h) => h.rate);
  const currentRate = rates[rates.length - 1] || 0;
  const previousRate = rates[0] || 0;
  const change = currentRate - previousRate;
  const changePercent = ((change / previousRate) * 100).toFixed(2);
  const highRate = Math.max(...rates);
  const lowRate = Math.min(...rates);
  const avgRate = (rates.reduce((a, b) => a + b, 0) / rates.length).toFixed(2);

  const isPositive = change >= 0;

  const durations = [
    { label: "7D", value: "7d" },
    { label: "30D", value: "30d" },
    { label: "90D", value: "90d" },
    { label: "1Y", value: "1y" },
  ];

  const data = {
    labels: history.map((h) =>
      new Date(h.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    ),
    datasets: [
      {
        label: "Exchange Rate",
        data: history.map((h) => h.rate),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(59, 130, 246, 0.3)");
          gradient.addColorStop(1, "rgba(59, 130, 246, 0.0)");
          return gradient;
        },
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "rgb(59, 130, 246)",
        pointHoverBorderColor: "white",
        pointHoverBorderWidth: 3,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(59, 130, 246, 0.5)",
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          label: function (context) {
            return `${to} ${context.parsed.y.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#9ca3af",
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 8,
        },
      },
      y: {
        position: "right",
        grid: {
          color: "rgba(156, 163, 175, 0.1)",
        },
        ticks: {
          color: "#9ca3af",
          callback: function (value) {
            return `${to} ` + value.toFixed(2);
          },
        },
      },
    },
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Currency Converter", href: "/currency-converter" },
    { label: `${from} to ${to}`, href: `/currency-converter/${pair}` },
    { label: "History" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className=" mb-3">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 capitalize">{`${from} to ${to}`}</h1>
                <div className="p-2 bg-red-100 rounded-lg">
                  <ArrowLeftRight className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Stats Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6">
          <div className="p-6 sm:p-8 bg-gradient-to-r from-red-600 to-red-700">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-white/80 text-sm mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Current Rate</span>
                </div>
                <div className="text-4xl sm:text-5xl font-bold text-white mb-3">
                  {to} {currentRate.toFixed(2)}
                </div>
                <div className="flex items-center gap-2">
                  {isPositive ? (
                    <TrendingUp className="w-5 h-5 text-emerald-300" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-300" />
                  )}
                  <span
                    className={`text-lg font-semibold ${isPositive ? "text-emerald-300" : "text-red-300"}`}
                  >
                    {isPositive ? "+" : ""}
                    {change.toFixed(2)} ({isPositive ? "+" : ""}
                    {changePercent}%)
                  </span>
                  <span className="text-white/70 text-sm">vs 30 days ago</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {durations.map((dur) => (
                  <Link
                    key={dur.value}
                    href={`/currency-converter/${pair}/history/${dur.value}`}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      duration === dur.value
                        ? "bg-white text-red-600 shadow-md"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {dur.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="p-6 sm:p-8">
            <div className="h-80 sm:h-96">
              <Line data={data} options={options} />
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-sm text-gray-600 font-medium">Highest</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {to} {highRate.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-sm text-gray-600 font-medium">Lowest</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {to} {lowRate.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <Info className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-sm text-gray-600 font-medium">Average</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {to} {avgRate}
            </div>
            <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
          </div>
        </div>
      </div>
    </div>
  );
}
