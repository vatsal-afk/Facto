"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const LokSabhaBills: React.FC = () => {
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bills/get_bills`);
        if (!response.ok) {
          throw new Error("Failed to fetch bills data.");
        }
        const data = await response.json();
        setBills(data.bills.slice(0, 3)); // Limit to 2–3 bills
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching the bills.");
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="bg-orange-500 text-white rounded-t-md">
        <CardTitle className="text-lg font-semibold">Legislative Section - Stay Updated with the Bills!</CardTitle>
      </CardHeader>
      <CardContent className="mt-4">
        {loading && <p>Loading bills...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <ul className="space-y-4">
            {bills.length === 0 ? (
              <p>No bills found.</p>
            ) : (
              bills.map((bill) => (
                <li key={bill.index} className="flex items-center justify-between">
                  <span>
                    <a
                      href={bill.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {bill.title}
                    </a>
                  </span>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    {bill.status}
                  </Badge>
                </li>
              ))
            )}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default LokSabhaBills;
