"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useMobileDetection } from "@/hooks/use-mobile-detection"
import { AlertTriangle } from "lucide-react"

export function MobileMaintenanceDialog() {
  const { isMobile, isReady } = useMobileDetection()
  const maintenanceMode = true
  const showDialog = isReady && isMobile && maintenanceMode

  if (!showDialog) return null

  return (
    <Dialog open={true}>
      <DialogContent
        className="max-w-[90vw] rounded-lg border-white/10 bg-black text-white"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        closable={false}
      >
        <DialogHeader className="flex flex-col items-center gap-2 text-balance text-center text-white/70">
          <AlertTriangle className="size-6" />
          <DialogTitle className="text-xl text-white">
            Mobile Experience Under Maintenance
          </DialogTitle>
          <DialogDescription>
            We&apos;re currently improving the mobile experience of
            InstaPlanner. Some features may not work as expected on mobile
            devices. For the best experience, please use a desktop browser.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
