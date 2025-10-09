"use client";
import { useEffect, useState } from "react";
// import { supabase } from "@/utils/supabase/client";
import { supabase } from "../../../../utils/supabase/client";

export default function ManageDairyFormPage() {
  const [cows, setCows] = useState([]);
  const [summary, setSummary] = useState({
    totalMilk: 0,
    milkSold: 0,
    milkRemaining: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data: cowsData } = await supabase
        .from("cows")
        .select("id, name, batch_number, on_vacation, morning_milk, evening_milk, total_milk");

      const { data: dairy } = await supabase
        .from("dairyforms")
        .select("total_milk, milk_sold, milk_remaining")
        .order("created_at", { ascending: false })
        .limit(1);

      setCows(cowsData || []);
      if (dairy && dairy.length > 0) {
        setSummary(dairy[0]);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Manage Dairy Form</h2>
      <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Cow Name</th>
            <th className="px-4 py-2 text-left">Batch #</th>
            <th className="px-4 py-2 text-left">On Vacation</th>
            <th className="px-4 py-2 text-left">Morning Milk</th>
            <th className="px-4 py-2 text-left">Evening Milk</th>
            <th className="px-4 py-2 text-left">Total Milk</th>
          </tr>
        </thead>
        <tbody>
          {cows.map((cow) => (
            <tr key={cow.id} className="border-b">
              <td className="px-4 py-2">{cow.name}</td>
              <td className="px-4 py-2">{cow.batch_number}</td>
              <td className="px-4 py-2">
                {cow.on_vacation ? "Yes" : "No"}
              </td>
              <td className="px-4 py-2">{cow.morning_milk}</td>
              <td className="px-4 py-2">{cow.evening_milk}</td>
              <td className="px-4 py-2">{cow.total_milk}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <div className="bg-green-100 px-4 py-3 rounded-lg flex-1 text-center">
          <p className="font-semibold">Total Milk: {summary.totalMilk} L</p>
        </div>
        <div className="bg-blue-100 px-4 py-3 rounded-lg flex-1 text-center">
          <p className="font-semibold">Milk Sold: {summary.milkSold} L</p>
        </div>
        <div className="bg-yellow-100 px-4 py-3 rounded-lg flex-1 text-center">
          <p className="font-semibold">Remaining: {summary.milkRemaining} L</p>
        </div>
      </div>
    </div>
  );
}
