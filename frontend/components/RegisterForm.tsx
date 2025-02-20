"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    // setLoading(true);
  
    if (!role || !email || !password) {
      setError("All fields are necessary.");
      // setLoading(false);
      return;
    }

    try {
      const resUserExists = await fetch("/api/userExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!resUserExists.ok) {
        throw new Error(`Server error: ${resUserExists.status}`);
      }

      const data = await resUserExists.json();

      if (!data.success) {
        setError(data.error || "Error checking user existence");
        // setLoading(false);
        return;
      }

      if (data.user) {
        setError("User already exists.");
        // setLoading(false);
        return;
      }

      // Continue with registration...
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          email,
          password,
        }),
      }); 

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Registration failed");
      }

      const result = await res.json();
      
      if (result.success) {
        const form = e.target as HTMLFormElement;
        form.reset();
        router.push("/signin");
      } else {
        setError(result.error || "Registration failed");
      }
    } catch (error) {
      console.error("Error during registration: ", error);
      setError(error instanceof Error ? error.message : "Registration failed");
    } finally {
      // setLoading(false);
    }
};

  return (
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-5 rounded-lg border-t-4 border-green-400">
        <h1 className="text-xl font-bold my-4">Register</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          
          
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Email"
            className="px-4 py-2 border rounded-lg"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="px-4 py-2 border rounded-lg"
          />
          <div className="flex gap-4 items-center">
            <p>ROLE:</p>
            <div className="flex items-center">
              <input
                type="radio"
                id="user"
                name="role"
                value="user"
                checked={role === "user"}
                onChange={(e) => setRole(e.target.value)}
                className="mr-2"
              />
              <label htmlFor="user">User</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="admin"
                name="role"
                value="admin"
                checked={role === "admin"}
                onChange={(e) => setRole(e.target.value)}
                className="mr-2"
              />
              <label htmlFor="admin">Admin</label>
            </div>
          </div>
          <button className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2 rounded-lg hover:bg-green-700">
            Register
          </button>

          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}

          <Link className="text-sm mt-3 text-right" href={"/signin"}>
            Already have an account? <span className="underline">Login</span>
          </Link>
        </form>
      </div>
    </div>
  );
}