import { ResultsSummary } from "@/components/results-summary"

export default function ResultsPage() {
  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Resultados</h1>
          <p className="text-muted-foreground">Veja quanto cada pessoa deve pagar</p>
        </div>
        <ResultsSummary />
      </div>
    </div>
  )
}
