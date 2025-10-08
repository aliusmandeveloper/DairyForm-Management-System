"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SignUp } from "../../actions/auth";
import AuthButton from "./AuthButton";

const SignUpForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await SignUp(formData);

    if (result.status === "success") router.push("/login");
    else setError(result.status);

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        name="username"
        placeholder="Username"
        className="border rounded-md px-3 py-2"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="border rounded-md px-3 py-2"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="border rounded-md px-3 py-2"
        required
      />

      {/* Role select */}
      <select
        name="role"
        className="border rounded-md px-3 py-2 bg-white text-gray-700"
      >
        <option value="admin">Admin (Dairy Manager)</option>
        <option value="super_admin">Super Admin</option>
      </select>

      <AuthButton type="Sign up" loading={loading} />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
};

export default SignUpForm;
