"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../../../../utils/supabase/client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function EditCowPage() {
  const params = useParams();
  const router = useRouter();
  const cowId = params.id;

  const [cow, setCow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    batch_number: "",
    vaccination_status: "Pending",
  });

  // Fetch cow data
  const fetchCow = async () => {
    try {
      const { data, error } = await supabase
        .from("cows")
        .select("*")
        .eq("id", cowId)
        .single();

      if (error) {
        console.error("Error fetching cow:", error);
        return;
      }

      if (data) {
        setCow(data);
        setFormData({
          name: data.name || "",
          batch_number: data.batch_number || "",
          vaccination_status: data.vaccination_status || "Pending",
        });
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cowId) {
      fetchCow();
    }
  }, [cowId]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from("cows")
        .update({
          name: formData.name,
          batch_number: formData.batch_number,
          vaccination_status: formData.vaccination_status,
         
        })
        .eq("id", cowId);

      if (error) {
        console.error("Error updating cow:", error);
        alert("Error updating cow details. Please try again.");
        return;
      }

      alert("Cow details updated successfully!");
      router.push("/admin/dashboard/cows");
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 mt-10 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading cow details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cow) {
    return (
      <div className="p-6 mt-10 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 mx-auto text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Cow not found
            </h3>
            <p className="mt-2 text-gray-500">
              The cow you're looking for doesn't exist.
            </p>
            <Link
              href="/admin/dashboard/cows"
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Back to Cows List
            </Link>
          </div>
        </div>
      </div>
    );
  }

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

          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                Edit Cow Details
              </h2>
              <p className="text-gray-600 mt-2">
                Update information for {cow.name}
              </p>
            </div>
            <div className="text-sm text-gray-500 bg-white px-3 py-2 rounded-lg border">
              ID: {cowId}
            </div>
          </div>
        </div>

        {/* Edit Form */}
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

            {/* Status Preview */}
            <div className="p-4 bg-gray-50 rounded-lg border">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Status Preview:
              </h4>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  formData.vaccination_status === "Done"
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                }`}
              >
                {formData.vaccination_status === "Done" ? (
                  <>
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Done
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Pending
                  </>
                )}
              </span>
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
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Update Cow Details
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
