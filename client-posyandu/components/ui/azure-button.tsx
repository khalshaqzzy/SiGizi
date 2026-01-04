import { forwardRef } from "react"
import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"

export const AzureButton = forwardRef<HTMLButtonElement, ButtonProps>(({ className, children, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      className={cn(
        "h-11 rounded-xl bg-primary px-6 font-semibold text-primary-foreground shadow-md shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  )
})

AzureButton.displayName = "AzureButton"
