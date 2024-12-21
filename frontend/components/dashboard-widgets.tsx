import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, BarChart2, Users } from 'lucide-react'
import LokSabhaBills from './lok-sabha-bills'
import UNConventions from './un-conventions'
import FakeNewsAlert from './fake-news-alert'
import SocialMediaUpdates from './social-media-updates'
import TrendsAndHashtags from './trends-and-hashtags'
import ImportantArticles from './important-articles'

const widgets = [
  {
    title: "Total Analyzed Content",
    value: "1,234",
    icon: BarChart2,
    description: "Content pieces analyzed",
  },
  {
    title: "Verified Content",
    value: "892",
    icon: CheckCircle,
    description: "Pieces of content verified",
  },
  {
    title: "Flagged Content",
    value: "342",
    icon: AlertTriangle,
    description: "Pieces of content flagged",
  },
  {
    title: "Active Users",
    value: "573",
    icon: Users,
    description: "Users actively participating",
  },
]

export default function DashboardWidgets() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* {widgets.map((widget, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {widget.title}
            </CardTitle>
            <widget.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{widget.value}</div>
            <p className="text-xs text-muted-foreground">{widget.description}</p>
          </CardContent>
        </Card>
      ))} */}
      <LokSabhaBills />
      <UNConventions />
      <FakeNewsAlert />
      <SocialMediaUpdates />
      <TrendsAndHashtags />
      <ImportantArticles />
    </div>
  )
}

