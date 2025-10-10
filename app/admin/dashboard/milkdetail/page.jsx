"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../../../utils/supabase/client";
import { PlusCircle, Eye, Users, Milk, Calendar, TrendingUp } from "lucide-react";

export default function MilkPage() {
  const [customers, setCustomers] = useState([]);
  const [milkRecords, setMilkRecords] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [viewMode, setViewMode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    totalMilk: "",
    distributions: [],
  });

  useEffect(() => {
    fetchCustomers();
    fetchMilkRecords();
  }, []);

  const fetchCustomers = async () => {
    const { data } = await supabase.from("customers").select("id, name");
    setCustomers(data || []);
  };

  const fetchMilkRecords = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("milk_records")
      .select("id, session, total_milk, date, milk_distribution(customer_id, quantity, customers(name))")
      .order("date", { ascending: false });
    setMilkRecords(data || []);
    setLoading(false);
  };

  const handleFormChange = (customerId, value) => {
    setFormData((prev) => {
      const updated = [...prev.distributions];
      const existing = updated.find((d) => d.customer_id === customerId);
      if (existing) existing.quantity = Number(value);
      else updated.push({ customer_id: customerId, quantity: Number(value) });
      return { ...prev, distributions: updated };
    });
  };

  const handleSubmit = async () => {
    if (!formData.totalMilk) {
      alert("Please enter total milk quantity!");
      return;
    }

    const { data: record, error: recordErr } = await supabase
      .from("milk_records")
      .insert([{ session: selectedSession, total_milk: formData.totalMilk }])
      .select()
      .single();

    if (recordErr) return alert("Error adding record: " + recordErr.message);

    const distributions = formData.distributions
      .filter(d => d.quantity > 0)
      .map((d) => ({
        milk_record_id: record.id,
        customer_id: d.customer_id,
        quantity: d.quantity,
      }));

    const { error: distErr } = await supabase
      .from("milk_distribution")
      .insert(distributions);

    if (distErr) alert("Error saving distributions: " + distErr.message);
    else {
      alert("Milk record added successfully! ✅");
      setFormData({ totalMilk: "", distributions: [] });
      fetchMilkRecords();
      setViewMode(null);
    }
  };

  // Calculate statistics
  const getSessionStats = (session) => {
    const sessionRecords = milkRecords.filter(r => r.session === session);
    const totalMilk = sessionRecords.reduce((sum, r) => sum + (r.total_milk || 0), 0);
    const totalDistributions = sessionRecords.reduce((sum, r) => 
      sum + (r.milk_distribution?.reduce((distSum, d) => distSum + (d.quantity || 0), 0) || 0), 0
    );
    
    return {
      totalRecords: sessionRecords.length,
      totalMilk,
      totalDistributions,
      remaining: totalMilk - totalDistributions
    };
  };

  const morningStats = getSessionStats("morning");
  const eveningStats = getSessionStats("evening");

  const renderTable = (session) => {
    const records = milkRecords.filter((r) => r.session === session);
    if (!records.length) return (
      <div className="text-center py-8 text-gray-500 bg-white rounded-lg border-2 border-dashed border-gray-200">
        <Milk className="w-12 h-12 mx-auto text-gray-400 mb-3" />
        <p className="text-lg font-medium">No milk records found</p>
        <p className="text-sm">Start by adding your first milk record</p>
      </div>
    );

    return records.map((r) => {
      const totalAssigned = r.milk_distribution?.reduce((sum, d) => sum + (d.quantity || 0), 0) || 0;
      const remaining = r.total_milk - totalAssigned;

      return (
        <div key={r.id} className="border border-gray-200 rounded-xl p-6 mb-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <p className="font-semibold text-gray-800">Date: {new Date(r.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}</p>
            </div>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Total: {r.total_milk} L
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase border-b">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase border-b">Quantity (L)</th>
                </tr>
              </thead>
              <tbody>
                {r.milk_distribution?.map((d, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-800">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {d.customers?.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{d.quantity}</td>
                  </tr>
                ))}
                <tr className="bg-gradient-to-r from-blue-50 to-blue-100 font-semibold">
                  <td className="px-4 py-3 text-sm text-blue-800">Remaining Milk</td>
                  <td className="px-4 py-3 text-sm text-blue-800 font-bold">{remaining} L</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
    });
  };

  const renderForm = (session) => (
    <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-lg mt-4">
      <div className="flex items-center gap-3 mb-6">
        <PlusCircle className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">Enter {session.charAt(0).toUpperCase() + session.slice(1)} Milk Details</h3>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Total Milk Collection (Liters)</label>
        <input
          type="number"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          value={formData.totalMilk}
          onChange={(e) => setFormData({ ...formData, totalMilk: e.target.value })}
          placeholder="Enter total milk in liters"
          min="0"
          step="0.1"
        />
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-gray-800">Distribute to Customers</h3>
        </div>
        
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {customers.map((c) => (
            <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-white transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {c.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="font-medium text-gray-800">{c.name}</span>
              </div>
              <input
                type="number"
                className="border border-gray-300 rounded-lg px-3 py-2 w-24 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                placeholder="0.0"
                min="0"
                step="0.1"
                onChange={(e) => handleFormChange(c.id, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={() => setViewMode(null)}
          className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition duration-200 font-medium flex items-center justify-center gap-2"
        >
          <PlusCircle size={18} />
          Save Milk Record
        </button>
      </div>
    </div>
  );

  const renderSessionCard = (session) => {
    const stats = getSessionStats(session);
    const isActive = selectedSession === session && viewMode;

    return (
      <div className={`border rounded-xl p-6 shadow-sm transition-all duration-200 ${
        isActive ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white hover:shadow-md'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              session === 'morning' ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'
            }`}>
              <Milk className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 capitalize">{session} Milk</h2>
              <p className="text-sm text-gray-600">Manage {session.toLowerCase()} milk records</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-800">{stats.totalRecords}</div>
            <div className="text-sm text-gray-500">Records</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
            <TrendingUp className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-blue-700">{stats.totalMilk}L</div>
            <div className="text-xs text-blue-600">Total Milk</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
            <Users className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-green-700">{stats.totalDistributions}L</div>
            <div className="text-xs text-green-600">Distributed</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-100">
            <Milk className="w-5 h-5 text-orange-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-orange-700">{stats.remaining}L</div>
            <div className="text-xs text-orange-600">Remaining</div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              setSelectedSession(session);
              setViewMode("view");
            }}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition duration-200 font-medium flex items-center justify-center gap-2"
          >
            <Eye size={18} />
            View Details
          </button>
          <button
            onClick={() => {
              setSelectedSession(session);
              setViewMode("form");
            }}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition duration-200 font-medium flex items-center justify-center gap-2"
          >
            <PlusCircle size={18} />
            Add Record
          </button>
        </div>

        {selectedSession === session && viewMode === "view" && renderTable(session)}
        {selectedSession === session && viewMode === "form" && renderForm(session)}
      </div>
    );
  };

  return (
    <div className="p-6 mt-10 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Milk className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Milk Management</h1>
              <p className="text-gray-600 mt-2">Track and distribute milk collection efficiently</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading milk records...</p>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {renderSessionCard("morning")}
            {renderSessionCard("evening")}
          </div>
        )}
      </div>
    </div>
  );
}