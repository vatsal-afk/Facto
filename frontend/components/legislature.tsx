"use client"

import React, { useState, useEffect } from "react";

interface Bill {
  Link: string;
  Published: string;
  Summary: string;
  Title: string;
}

const Legislature: React.FC = () => {
  // State to store bills data
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Fetch bills data from the Flask API
  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bills/get_bills`);
        if (!response.ok) {
          throw new Error("Failed to fetch bills data.");
        }
        const data: { bills: Bill[] } = await response.json(); // Ensure correct type
        setBills(data.bills);
      } catch (err) {
        setError((err as Error).message || "An error occurred while fetching the bills.");
      } finally {
        setLoading(false);
      }
    };    

    fetchBills();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* <h1 className="text-2xl font-semibold mb-4">Legislative Bills</h1> */}

      {loading && <p>Loading bills...</p>}

      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-4">
        {bills.length === 0 ? (
          <p></p> // No bills found
        ) : (
          bills.map((bill, index) => (
            <div key={index} className="bg-gray p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">
                <a href={bill.Link} target="_blank" rel="noopener noreferrer">
                  {bill.Title}
                </a>
              </h3>
              <p className="text-sm text-gray-500">Published: {bill.Published}</p>
              <p className="mt-2 text-gray-700">{bill.Summary}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Legislature;
