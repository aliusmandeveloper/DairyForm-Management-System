"use client";
import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabaseClient";
// import { supabase } from "@/utils/supabase/client";
import { supabase } from "../../../../utils/supabase/client";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);

  const fetchCustomers = async () => {
    const { data } = await supabase
      .from("customers")
      .select("id, name, created_at, milk_sales(quantity)");
    const formatted =
      data?.map((c) => ({
        id: c.id,
        name: c.name,
        totalBuy:
          c.milk_sales?.reduce((sum, s) => sum + Number(s.quantity), 0) || 0,
      })) || [];
    setCustomers(formatted);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAddCustomer = () => {
    alert("Add Customer button clicked — form function will be added later!");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Customers</h2>
        <button
          onClick={handleAddCustomer}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Customer
        </button>
      </div>

      <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Customer Name</th>
            <th className="px-4 py-2 text-left">Total Milk Bought (Today)</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id} className="border-b">
              <td className="px-4 py-2">{c.name}</td>
              <td className="px-4 py-2">{c.totalBuy} L</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
