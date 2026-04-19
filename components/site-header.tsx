import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { NotificationPopover } from "@/components/notifications/notification-popover"
import { ThemeToggle } from "@/components/ThemeToggle"

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="flex-1">
          {/* Page title or breadcrumbs can go here */}
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <NotificationPopover />
        </div>
      </div>
    </header>
  )
}
