import { AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

type DisclaimerSectionProps = {
  dict: any
}

export function DisclaimerSection({ dict }: DisclaimerSectionProps) {
  return (
    <section className="py-16 bg-secondary/20">
      <div className="container mx-auto px-4">
        <Alert className="border-yellow-500/50 bg-yellow-500/10">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <AlertDescription className="text-sm text-muted-foreground ml-2">
            <strong className="text-foreground">{dict.Disclaimer.title}:</strong> {dict.Disclaimer.content}
          </AlertDescription>
        </Alert>
      </div>
    </section>
  )
}
