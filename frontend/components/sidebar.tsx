"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, TrendingUp, Radio, FileText, Vote, BarChart2, MessageSquare } from 'lucide-react'
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: FileText, label: 'Custom News', href: '/custom-news' },
  { icon: TrendingUp, label: 'Trend Analysis', href: '/trendAnalysis' },
  { icon: Radio, label: 'Live Broadcast', href: '/live-broadcast' },
  { icon: Vote, label: 'Voting', href: '/voting' },
  {icon: BarChart2, label: 'Social Media Analysis', href: '/social-media-analysis' },
  { icon: MessageSquare, label: 'Discussions', href: '/discussions' },
]

export default function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href} className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                      pathname === item.href && "text-gray-900 dark:text-gray-50"
                    )}>
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

