"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const FACT_CHECK_API_URL = "https://factchecktools.googleapis.com/v1alpha1/claims:search";
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

export default function BreakingNewsBanner() {
  const [newsText, setNewsText] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFakeNews = async () => {
      try {
        const response = await fetch(`${FACT_CHECK_API_URL}?query=misinformation&languageCode=en&key=${GOOGLE_API_KEY}`);
        const data = await response.json();
        if (data.claims) {
          const fakeNews = data.claims.map((claim: any) => claim.text).slice(0, 5);
          const news = fakeNews.join(" • ");
          setNewsText(news + " • " + news); // loop the fake news headlines
        }
      } catch (error) {
        console.error("Error fetching fake news:", error);
      }
    };

    fetchFakeNews();

    const animate = () => {
      if (containerRef.current) {
        if (containerRef.current.scrollLeft >= containerRef.current.scrollWidth / 2) {
          containerRef.current.scrollLeft = 0;
        } else {
          containerRef.current.scrollLeft += 1;
        }
      }
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <Card className="bg-red-600 text-white mb-6 overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-center">
          <div className="bg-red-700 p-4 flex-shrink-0">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div
            ref={containerRef}
            className="overflow-hidden whitespace-nowrap flex-1"
            style={{
              maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            }}
          >
            <div className="py-4 px-6 inline-block">
              {newsText}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
