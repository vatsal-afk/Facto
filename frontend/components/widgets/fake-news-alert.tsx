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
  const [fakeNewsAlerts, setFakeNewsAlerts] = useState<FakeNewsAlertType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to strip HTML tags from a string
  const stripHtmlTags = (text: string) => {
    const doc = new DOMParser().parseFromString(text, "text/html");
    return doc.body.textContent || "";
  };

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
        console.log("Fake News Alert Data:", data);

        if (data.claims && data.claims.length > 0) {
          const alerts = data.claims.map((claim: any) => ({
            title: stripHtmlTags(claim.text), // Strip HTML tags from the title
            description: stripHtmlTags(
              claim.claimReview[0]?.textualRating || "No rating provided"
            ), // Strip HTML tags from description
          }));
          setFakeNewsAlerts(alerts);
        } else {
          setFakeNewsAlerts([]);
        }
      } catch (error) {
        console.error("Error fetching fake news alert:", error);
      }
    };

    fetchFakeNewsAlert();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % fakeNewsAlerts.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + fakeNewsAlerts.length) % fakeNewsAlerts.length
    );
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="bg-red-500 text-white rounded-t-md">
        <CardTitle className="text-lg font-semibold">Whats's the B(l)uff?</CardTitle>
      </CardHeader>
      <CardContent className="mt-4 relative">
        {fakeNewsAlerts.length > 0 ? (
          <div className="flex justify-center items-center">
            {/* Left Arrow */}
            <button
              onClick={prevSlide}
              className="absolute left-0  text-red-500 px-1"
            >
              &lt;
            </button>

            <Alert variant="destructive" className="border-red-500">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="font-semibold">
                {fakeNewsAlerts[currentIndex].title}
              </AlertTitle>
              <AlertDescription>
                {fakeNewsAlerts[currentIndex].description}
              </AlertDescription>
            </Alert>

            {/* Right Arrow */}
            <button
              onClick={nextSlide}
              className="absolute right-0 text-red-500 px-1"
            >
              &gt;
            </button>
          </div>
        ) : (
          <p>Wait up.. we'll be right there</p>
        )}
      </CardContent>
    </Card>
  );
}
