"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SentimentAnalysis } from "./sentiment-analysis"
import { ReadabilityScore } from "./readability-score"
import { MetricsAnalysis } from "./metrics-analysis"
import { KnowledgeGraph } from "./knowledge-graph"
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

export function NewsAnalysisReport() {
  const [analysisData, setAnalysisData] = useState<{
    reason: string;
    verdict: string;
  } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dataParam = params.get('data');
    if (dataParam) {
      try {
        const parsedData = JSON.parse(dataParam);
        setAnalysisData(parsedData);
      } catch (error) {
        console.error('Error parsing data:', error);
      }
    }
  }, []);

  const getVerdictDisplay = () => {
    if (!analysisData) return { icon: null, text: 'Loading...', colors: 'from-gray-100 to-gray-200' };

    switch (analysisData.verdict.toLowerCase()) {
      case 'real':
        return {
          icon: <CheckCircle2 className="w-24 h-24 text-green-600 mb-4" />,
          text: 'Real News',
          colors: 'from-green-100 to-green-200'
        };
      case 'fake':
        return {
          icon: <XCircle className="w-24 h-24 text-red-600 mb-4" />,
          text: 'Fake News',
          colors: 'from-red-100 to-red-200'
        };
      case 'unverified':
      default:
        return {
          icon: <AlertCircle className="w-24 h-24 text-yellow-600 mb-4" />,
          text: 'Unverified',
          colors: 'from-yellow-100 to-yellow-200'
        };
    }
  };

  const verdictDisplay = getVerdictDisplay();

  const getConfidenceValue = (verdict: string) => {
    switch (verdict.toLowerCase()) {
      case 'real':
        return 1.0;
      case 'fake':
        return 0.0;
      case 'unverified':
      default:
        return 0.5;
    }
  };

  const metricsData = [
    { 
      metric: "Confidence Score", 
      value: analysisData ? getConfidenceValue(analysisData.verdict) : 0
    }
  ];

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
            <p className="text-center text-muted-foreground">
              {analysisData?.reason || 'Analysis pending...'}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <MetricsAnalysis data={metricsData} />
        <Card>
          <CardHeader>
            <CardTitle>Analysis Details</CardTitle>
            <CardDescription>Reason for classification</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg">{analysisData?.reason || 'Awaiting analysis...'}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}