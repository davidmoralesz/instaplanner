"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useMobileDetection } from "@/hooks/use-mobile-detection"
import { useMaintenanceMode } from "@/hooks/use-maintenance-mode"
import { AlertTriangle } from "lucide-react"

export function MobileMaintenanceDialog() {
  const { isMobile, isReady } = useMobileDetection()
  const { maintenanceMode } = useMaintenanceMode()

  const shouldShowDialog =
    process.env.NEXT_PUBLIC_SHOW_DIALOG !== "true" &&
    isReady &&
    isMobile &&
    maintenanceMode

  if (!shouldShowDialog) return null

  return (
    <Dialog open={true}>
      <DialogContent
        className="max-w-[90vw] rounded-lg border-foreground/10 bg-background text-foreground"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        closable={false}
      >
        <DialogHeader className="flex flex-col items-center gap-2 text-balance text-center text-foreground/70">
          <AlertTriangle className="size-6" />
          <DialogTitle className="text-xl text-foreground">
            Mobile Experience Under Maintenance
          </DialogTitle>
          <DialogDescription className="text-balance text-center">
            We&apos;re currently improving the mobile experience of
            InstaPlanner. Some features may not work as expected on mobile
            devices. For the best experience, please use a desktop browser.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
