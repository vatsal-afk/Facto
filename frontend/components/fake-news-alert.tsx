import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from 'lucide-react'

export default function FakeNewsAlert() {
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="bg-red-500 text-white">
        <CardTitle className="text-lg font-semibold">Fake News Alert</CardTitle>
      </CardHeader>
      <CardContent className="mt-4">
        <Alert variant="destructive" className="border-red-500">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="font-semibold">Critical Alert</AlertTitle>
          <AlertDescription>
            Viral claim about COVID-19 cure is false. Check our detailed fact-check for accurate information.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}

