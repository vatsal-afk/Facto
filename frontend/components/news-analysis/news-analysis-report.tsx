"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SentimentAnalysis } from "./sentiment-analysis";
import { ReadabilityScore } from "./readability-score";
import { MetricsAnalysis } from "./metrics-analysis";
import { KnowledgeGraph } from "./knowledge-graph";
import { FactDensity } from "./fact-density";
import { LexicalDiversity } from "./lexical-diversity";
import { Similarity } from "./similarity";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface Scores {
  fact_density: number;
  lexical_diversity: number;
  readability: number;
  sentiment_consistency: number;
}

interface AnalysisData {
  results: {
    knowledge_graph: string;
    maximum_similarity: number;
    scores: Scores;
    verdict: string;
  };
  status: string;
}

export function NewsAnalysisReport() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dataParam = params.get("data");

    if (dataParam) {
      try {
        const parsedData: AnalysisData = JSON.parse(dataParam);
        setAnalysisData(parsedData);
      } catch (error) {
        console.error("Error parsing data:", error);
      }
    }
  }, []);

  const getVerdictDisplay = () => {
    if (!analysisData?.results) {
      return {
        icon: null,
        text: "Loading...",
        colors: "from-gray-100 to-gray-200",
      };
    }

    const verdict = analysisData.results.verdict?.toLowerCase();
    if (verdict === "real news") {
      return {
        icon: <CheckCircle2 className="w-24 h-24 text-green-600 mb-4" />,
        text: "Real News",
        colors: "from-green-100 to-green-200",
      };
    } else if (verdict === "fake news") {
      return {
        icon: <XCircle className="w-24 h-24 text-red-600 mb-4" />,
        text: "Fake News",
        colors: "from-red-100 to-red-200",
      };
    } else {
      return {
        icon: <AlertCircle className="w-24 h-24 text-yellow-600 mb-4" />,
        text: "Unverified",
        colors: "from-yellow-100 to-yellow-200",
      };
    }
  };

  const verdictDisplay = getVerdictDisplay();

  const metricsData = analysisData?.results?.scores
    ? [
        { metric: "Fact Density", value: analysisData.results.scores.fact_density },
        { metric: "Lexical Diversity", value: analysisData.results.scores.lexical_diversity },
        { metric: "Readability", value: analysisData.results.scores.readability / 100 },
        { metric: "Sentiment Consistency", value: analysisData.results.scores.sentiment_consistency },
        { metric: "Maximum Similarity", value: analysisData.results.maximum_similarity },
      ]
    : [];

  return (
    <div className="space-y-8">
      <Card className={`bg-gradient-to-r ${verdictDisplay.colors}`}>
        <CardHeader>
          <CardTitle className="text-center text-3xl">Verdict</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            {verdictDisplay.icon}
            <p className="text-4xl font-bold mb-2">{verdictDisplay.text}</p>
          </div>
        </CardContent>
      </Card>

      {analysisData?.results && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <MetricsAnalysis data={metricsData} />
            <SentimentAnalysis score={analysisData.results.scores.sentiment_consistency} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ReadabilityScore score={analysisData.results.scores.readability} />
            <FactDensity density={analysisData.results.scores.fact_density} />
            <LexicalDiversity diversity={analysisData.results.scores.lexical_diversity} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Similarity similarity={analysisData.results.maximum_similarity} />
            <KnowledgeGraph graphUrl={analysisData.results.knowledge_graph} />
          </div>
        </>
      )}
    </div>
  );
}
