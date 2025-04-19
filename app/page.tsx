import { Calculator } from "@/components/calculator"

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2 text-center">Amazon FBA Cost Calculator</h1>
      <p className="text-muted-foreground mb-8 text-center">
        Calculate the actual cost of your units before sending them to Amazon FBA
      </p>
      <div className="max-w-md mx-auto">
        <Calculator />
      </div>
    </main>
  )
}
