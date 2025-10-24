"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../../utils/supabase/client";
import { 
  FaCrow,       // 'Total Cows' के लिए इस्तेमाल किया गया आइकन (चूंकि FaCow उपलब्ध नहीं है)
  FaTint,       // 'Milk' के लिए इस्तेमाल किया गया आइकन (चूंकि FaMilk उपलब्ध नहीं है)
  FaSun, 
  FaMoon, 
  FaDollarSign, 
  FaWarehouse,
  FaChartLine,
  FaPercentage 
} from "react-icons/fa";

export default function DairyFormManagement() {
  const [stats, setStats] = useState({
    totalCows: 0,
    milkToday: 0,
    morningMilk: 0,
    eveningMilk: 0,
    saleToday: 0,
    remainingMilk: 0,
    avgPerCow: 0,
    utilization: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const today = new Date().toISOString().split("T")[0];

      // 🐄 1️⃣ Fetch total cows
      const { data: cows } = await supabase.from("cows").select("id");

      // 🥛 2️⃣ Fetch today's milk collection
      const { data: milkRecords } = await supabase
        .from("milk_records")
        .select("id, session, total_milk, date");

      const morningMilk =
        milkRecords
          ?.filter((m) => m.session === "morning" && m.date === today)
          .reduce((sum, m) => sum + Number(m.total_milk), 0) || 0;

      const eveningMilk =
        milkRecords
          ?.filter((m) => m.session === "evening" && m.date === today)
          .reduce((sum, m) => sum + Number(m.total_milk), 0) || 0;

      const milkToday = morningMilk + eveningMilk;

      // 💰 3️⃣ Fetch sales (milk_distribution joined with milk_records)
      const { data: distributions } = await supabase
        .from("milk_distribution")
        .select(`
          quantity,
          milk_records!inner(date)
        `);

      const saleToday =
        distributions?.reduce((sum, d) => {
          if (d.milk_records?.date === today)
            return sum + Number(d.quantity);
          return sum;
        }, 0) || 0;

      // 🧮 4️⃣ Derived values
      const remainingMilk = milkToday - saleToday;
      const cowsCount = cows?.length || 0;
      const avgPerCow = cowsCount ? (milkToday / cowsCount).toFixed(2) : 0;
      const utilization = milkToday
        ? ((saleToday / milkToday) * 100).toFixed(1)
        : 0;

      // ✅ 5️⃣ Update UI
      setStats({
        totalCows: cowsCount,
        milkToday,
        morningMilk,
        eveningMilk,
        saleToday,
        remainingMilk,
        avgPerCow,
        utilization,
      });
    };

    fetchStats();
  }, []);

  const cards = [
    { 
      label: "Total Cows", 
      value: stats.totalCows, 
      icon: <FaCrow className="w-5 h-5" />, // Icon size reduced
      color: "from-blue-500 to-blue-600",
      textColor: "text-blue-600"
    },
    { 
      label: "Morning Milk", 
      value: `${stats.morningMilk} L`, 
      icon: <FaSun className="w-5 h-5" />, // Icon size reduced
      color: "from-orange-500 to-orange-600",
      textColor: "text-orange-600"
    },
    { 
      label: "Evening Milk", 
      value: `${stats.eveningMilk} L`, 
      icon: <FaMoon className="w-5 h-5" />, // Icon size reduced
      color: "from-purple-500 to-purple-600",
      textColor: "text-purple-600"
    },
    { 
      label: "Total Milk Today", 
      value: `${stats.milkToday} L`, 
      icon: <FaTint className="w-5 h-5" />, // Icon size reduced
      color: "from-green-500 to-green-600",
      textColor: "text-green-600"
    },
    { 
      label: "Sale Today", 
      value: `${stats.saleToday} L`, 
      icon: <FaDollarSign className="w-5 h-5" />, // Icon size reduced
      color: "from-indigo-500 to-indigo-600",
      textColor: "text-indigo-600"
    },
    { 
      label: "Remaining Milk", 
      value: `${stats.remainingMilk} L`, 
      icon: <FaWarehouse className="w-5 h-5" />, // Icon size reduced
      color: "from-gray-500 to-gray-600",
      textColor: "text-gray-600"
    },
    { 
      label: "Avg Per Cow", 
      value: `${stats.avgPerCow} L`, 
      icon: <FaChartLine className="w-5 h-5" />, // Icon size reduced
      color: "from-pink-500 to-pink-600",
      textColor: "text-pink-600"
    },
    { 
      label: "Utilization Rate", 
      value: `${stats.utilization}%`, 
      icon: <FaPercentage className="w-5 h-5" />, // Icon size reduced
      color: "from-teal-500 to-teal-600",
      textColor: "text-teal-600"
    },
  ];

  return (
    <div className="mt-10 p-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto"> 
        {/* Header */}
        <div className="mb-6 mt-10"> 
          <div className="flex items-center gap-3 mb-3"> 
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md"> {/* Pading कम की */}
              <FaCrow className="w-6 h-6 text-white" />  </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Dairy Dashboard</h1> {/* Font size कम किया */}
              <p className="text-sm text-gray-600 mt-1">Real-time overview of your dairy farm operations</p> {/* Font size कम किया */}
            </div>
          </div>
          
          {/* Date Display */}
          <div className="bg-white rounded-md p-3 shadow-sm border border-gray-200 inline-block"> {/* Pading कम की */}
            <p className="text-xs text-gray-600"> {/* Font size कम किया */}
              Today: {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        {/* Stats Cards Grid */}
        {/* Grid Gap को 4 किया */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, i) => (
            <div
              key={i}
              // Rounded corners को 2xl से xl किया, Shadow को भी थोड़ा कम किया
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 border border-gray-100 overflow-hidden"
            >
              {/* Card Header with Gradient */}
              <div className={`bg-gradient-to-r ${card.color} p-3`}> {/* Pading कम की */}
                <div className="flex items-center justify-between">
                  <div className="p-1 bg-white bg-opacity-20 rounded-md"> {/* Pading कम की */}
                    {card.icon}
                  </div>
                  <div className="text-right">
                    <p className="text-white text-opacity-90 text-xs font-medium">{card.label}</p> {/* Font size कम की */}
                  </div>
                </div>
              </div>
              
              {/* Card Content */}
              <div className="p-4"> {/* Pading 6 से 4 किया */}
                <p className={`text-2xl font-bold ${card.textColor} text-center`}> {/* Font size 3xl से 2xl किया */}
                  {card.value}
                </p>
                
                {/* Progress bar for utilization */}
                {card.label === "Utilization Rate" && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-gradient-to-r from-teal-500 to-teal-600 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${stats.utilization}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-center">
                      Milk utilization efficiency
                    </p>
                  </div>
                )}
                
                {/* Trend indicator for milk values */}
                {(card.label.includes("Milk") || card.label.includes("Sale")) && stats[card.label.toLowerCase().replace(/\s+/g, '')] > 0 && (
                  <div className="mt-2 flex justify-center">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <FaChartLine className="w-3 h-3 mr-1" />
                      Active
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Summary Section */}
        <div className="mt-6 grid lg:grid-cols-3 gap-4"> {/* Margin और Gap कम किया */}
          {/* Performance Summary */}
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 lg:col-span-2"> {/* Pading और Corner radius कम किया */}
            <h3 className="text-base font-semibold text-gray-800 mb-3">Today's Performance Summary</h3> {/* Font size कम किया */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg"> {/* Pading कम की */}
                <p className="text-xl font-bold text-blue-600">{stats.milkToday}L</p> {/* Font size कम किया */}
                <p className="text-xs text-gray-600">Total Production</p> {/* Font size कम किया */}
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg"> {/* Pading कम की */}
                <p className="text-xl font-bold text-green-600">{stats.saleToday}L</p> {/* Font size कम किया */}
                <p className="text-xs text-gray-600">Total Sales</p> {/* Font size कम किया */}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100"> {/* Pading और Corner radius कम किया */}
            <h3 className="text-base font-semibold text-gray-800 mb-3">Quick Stats</h3> {/* Font size कम किया */}
            <div className="space-y-2"> {/* Space कम किया */}
              <div className="flex justify-between items-center text-sm"> {/* Font size कम किया */}
                <span className="text-gray-600">Morning Session</span>
                <span className="font-semibold text-orange-600">{stats.morningMilk}L</span>
              </div>
              <div className="flex justify-between items-center text-sm"> {/* Font size कम किया */}
                <span className="text-gray-600">Evening Session</span>
                <span className="font-semibold text-purple-600">{stats.eveningMilk}L</span>
              </div>
              <div className="flex justify-between items-center text-sm"> {/* Font size कम किया */}
                <span className="text-gray-600">Available Stock</span>
                <span className="font-semibold text-gray-600">{stats.remainingMilk}L</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}