"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  TrendingUp,
  Radio,
  FileText,
  Vote,
  BarChart2,
  MessageSquare,
  Globe,
  Gavel,
  User,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: FileText, label: "Custom News", href: "/custom-news" },
  { icon: TrendingUp, label: "Trend Analysis", href: "/trend-analysis" },
  { icon: Radio, label: "Live Broadcast", href: "/live-broadcast" },
  { icon: BarChart2, label: "Social Media Analysis", href: "/social-media-analysis" },
  { icon: Vote, label: "Vote", href: "/counter" },
  { icon: Globe, label: "United Nations", href: "/un" },
  { icon: Gavel, label: "Know about Legislative Bills", href: "/bills" },
  { icon: MessageSquare, label: "Discussions", href: "/discussions" },
  { icon: User, label: "About the Developers", href: "/about-us" },
  { icon: Mail, label: "Contact Us", href: "/contact-us" },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="min-h-screen w-64 bg-gray-50 dark:bg-gray-900 shadow-lg fixed">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-4 px-4 py-3 text-gray-600 transition-all rounded-lg group hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200",
                        pathname === item.href &&
                          "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-200"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5 group-hover:scale-110 transition-transform",
                          pathname === item.href && "text-blue-500 dark:text-blue-400"
                        )}
                      />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
