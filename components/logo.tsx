import { Split } from "lucide-react"

export function Logo() {
  return (
    <div className="flex items-center space-x-2 flex-col">
      <Split className="h-6 w-6 text-yellow-500" />
      <span className="text-xl font-bold text-primary">Splityway</span>
    </div>
  )
}
