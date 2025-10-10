"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../../utils/supabase/client";

export default function DairyFormManagement() {
  const [stats, setStats] = useState({
    totalCows: 0,
    milkToday: 0,
    morningMilk: 0,
    eveningMilk: 0,
    remainingMilk: 0,
    saleToday: 0,
    avgPerCow: 0,
    utilization: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const today = new Date().toISOString().split("T")[0];

      // 🐄 Total cows
      const { data: cows } = await supabase.from("cows").select("id");

      // 🥛 Milk Records
      const { data: milk } = await supabase
        .from("milk_records")
        .select("session, total_milk, date");

      // 🧾 Dairy remaining milk
      const { data: dairy } = await supabase
        .from("dairyforms")
        .select("milk_remaining")
        .order("created_at", { ascending: false })
        .limit(1);

      // 💰 Sales
      const { data: sales } = await supabase
        .from("milk_sales")
        .select("quantity, sale_date");

      // ✅ Calculate totals for today
      const morningMilk =
        milk
          ?.filter((m) => m.session === "morning" && m.date === today)
          .reduce((sum, m) => sum + Number(m.total_milk), 0) || 0;

      const eveningMilk =
        milk
          ?.filter((m) => m.session === "evening" && m.date === today)
          .reduce((sum, m) => sum + Number(m.total_milk), 0) || 0;

      const milkToday = morningMilk + eveningMilk;

      const todaySales =
        sales?.reduce((sum, s) => {
          const saleDate = new Date(s.sale_date).toISOString().split("T")[0];
          if (saleDate === today) return sum + Number(s.quantity);
          return sum;
        }, 0) || 0;

      const remaining = dairy?.[0]?.milk_remaining || 0;
      const cowsCount = cows?.length || 0;
      const avg = cowsCount ? (milkToday / cowsCount).toFixed(2) : 0;
      const utilization = milkToday
        ? ((todaySales / milkToday) * 100).toFixed(1)
        : 0;

      setStats({
        totalCows: cowsCount,
        milkToday,
        morningMilk,
        eveningMilk,
        remainingMilk: remaining,
        saleToday: todaySales,
        avgPerCow: avg,
        utilization,
      });
    };

    fetchStats();
  }, []);

  const cards = [
    { label: "Total Cows", value: stats.totalCows, color: "text-blue-600" },
    {
      label: "Morning Milk",
      value: `${stats.morningMilk} L`,
      color: "text-orange-500",
    },
    {
      label: "Evening Milk",
      value: `${stats.eveningMilk} L`,
      color: "text-purple-500",
    },
    {
      label: "Total Milk (Today)",
      value: `${stats.milkToday} L`,
      color: "text-green-600",
    },
    {
      label: "Sale Today",
      value: `${stats.saleToday} L`,
      color: "text-indigo-600",
    },
    {
      label: "Remaining Milk",
      value: `${stats.remainingMilk} L`,
      color: "text-gray-600",
    },
  ];

  return (
    <div className="mt-10 p-6">
      <h2 className="text-2xl font-semibold mb-6">Dairy Overview</h2>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center justify-center hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold">{card.label}</h3>
            <p className={`text-3xl font-bold mt-2 ${card.color}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
