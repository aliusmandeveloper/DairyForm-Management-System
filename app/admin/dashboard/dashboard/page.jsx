"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../../utils/supabase/client";

export default function DashboardTab() {
  const [stats, setStats] = useState({
    totalCows: 0,
    milkToday: 0,
    remainingMilk: 0,
    saleToday: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { data: cows } = await supabase.from("cows").select("id");
      const { data: milk } = await supabase
        .from("cows")
        .select("morning_milk, evening_milk, created_at");

      const today = new Date().toISOString().split("T")[0];
      const todayMilk =
        milk?.reduce((sum, m) => {
          if (m.created_at.startsWith(today)) {
            return sum + (Number(m.morning_milk) + Number(m.evening_milk));
          }
          return sum;
        }, 0) || 0;

      const { data: dairy } = await supabase
        .from("dairyforms")
        .select("milk_remaining")
        .order("created_at", { ascending: false })
        .limit(1);

      const { data: sales } = await supabase
        .from("milk_sales")
        .select("quantity, sale_date");

      const todaySales =
        sales?.reduce((sum, s) => {
          if (s.sale_date === today) return sum + Number(s.quantity);
          return sum;
        }, 0) || 0;

      setStats({
        totalCows: cows?.length || 0,
        milkToday: todayMilk,
        remainingMilk: dairy?.[0]?.milk_remaining || 0,
        saleToday: todaySales,
      });
    };
    fetchStats();
  }, []);

  return (
    <div className="mt-10">
      <div className="p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Cows", value: stats.totalCows },
          { label: "Milk Today", value: `${stats.milkToday} L` },
          { label: "Remaining Milk", value: `${stats.remainingMilk} L` },
          { label: "Sale Today", value: `${stats.saleToday} L` },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center justify-center hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold">{card.label}</h3>
            <p className="text-3xl font-bold mt-2 text-green-600">
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
