"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

type FakeNewsAlertType = {
  title: string;
  description: string;
};

export default function FakeNewsAlert() {
  const [fakeNewsAlert, setFakeNewsAlert] = useState<FakeNewsAlertType | null>(null);

  useEffect(() => {
    const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

    const fetchFakeNewsAlert = async () => {
      try {
        const response = await fetch(
          `https://factchecktools.googleapis.com/v1alpha1/claims:search?query=fake%20news&languageCode=en&key=${GOOGLE_API_KEY}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch fake news alert");
        }

        const data = await response.json();

        // Extract a trending fake news claim from the API response
        if (data.claims && data.claims.length > 0) {
          const trendingClaim = data.claims[0]; // Get the first claim
          setFakeNewsAlert({
            title: trendingClaim.text,
            description: trendingClaim.claimReview[0]?.textualRating || "No rating provided",
          });
        } else {
          setFakeNewsAlert({
            title: "No trending fake news claims found",
            description: "Check back later for updates.",
          });
        }
      } catch (error) {
        console.error(error);
        setFakeNewsAlert({
          title: "Error fetching fake news alerts",
          description: "There was an issue fetching the latest claims. Please try again later.",
        });
      }
    };

    fetchFakeNewsAlert();
  }, []);

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="bg-red-500 text-white">
        <CardTitle className="text-lg font-semibold">Fake News Alert</CardTitle>
      </CardHeader>
      <CardContent className="mt-4">
        <Alert variant="destructive" className="border-red-500">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="font-semibold">
            {fakeNewsAlert?.title || "Loading..."}
          </AlertTitle>
          <AlertDescription>
            {fakeNewsAlert?.description || "Fetching the latest updates..."}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
