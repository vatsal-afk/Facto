"use client"

import React, { useState, useEffect } from "react";

const Legislature: React.FC = () => {
  // State to store bills data
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Fetch bills data from the Flask API
  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await fetch("http://localhost:5000/get_bills"); // Adjust URL as necessary
        if (!response.ok) {
          throw new Error("Failed to fetch bills data.");
        }
        const data = await response.json();
        setBills(data.bills);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching the bills.");
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Legislative Bills</h1>

      {loading && <p>Loading bills...</p>}

      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-4">
        {bills.length === 0 ? (
          <p>No bills found.</p>
        ) : (
          bills.map((bill) => (
            <div key={bill.index} className="bg-gray p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">
                <a href={bill.link} target="_blank" rel="noopener noreferrer">
                  {bill.title}
                </a>
              </h3>
              <p className="text-sm text-gray-500">Status: {bill.status}</p>
              <p className="mt-2 text-gray-700">{bill.summary}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Legislature;
