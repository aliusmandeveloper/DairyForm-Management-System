"use client";
import { useState } from "react";
import { supabase } from "../../../../../utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddCowPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    batch_number: "",
    vaccination_status: "Pending",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      console.log("Form Data:", formData); // Debug log

      const { data, error } = await supabase.from("cows").insert([
        {
          name: formData.name,
          batch_number: formData.batch_number,
          vaccination_status: formData.vaccination_status,
          created_at: new Date(),
        },
      ]);
      console.log("Supabase Response - Data:", data); // Debug log
      console.log("Supabase Response - Error:", error); // Debug log

      if (error) {
        console.error("Error adding cow:", error);
        alert(`Error adding cow: ${error.message}`);
        return;
      }

      alert("Cow added successfully!");
      router.push("/admin/dashboard/cows");
    } catch (error) {
      console.error("Catch Error:", error);
      alert(`An error occurred: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 mt-10 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Link
              href="/admin/dashboard/cows"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 transition duration-200"
            >
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Cows
            </Link>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-800">Add New Cow</h2>
            <p className="text-gray-600 mt-2">
              Add a new cow to your cattle management system
            </p>
          </div>
        </div>

        {/* Add Form */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cow Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Cow Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Enter cow name"
              />
            </div>

            {/* Batch Number */}
            <div>
              <label
                htmlFor="batch_number"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Batch Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="batch_number"
                name="batch_number"
                value={formData.batch_number}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Enter batch number"
              />
            </div>

            {/* Vaccination Status */}
            <div>
              <label
                htmlFor="vaccination_status"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Vaccination Status
              </label>
              <select
                id="vaccination_status"
                name="vaccination_status"
                value={formData.vaccination_status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              >
                <option value="Pending">Pending</option>
                <option value="Done">Done</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
              <Link
                href="/admin/dashboard/cows"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 font-medium"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add Cow
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
