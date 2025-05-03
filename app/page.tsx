import { Calculator } from '@/components/calculator';

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2 text-center">Amazon Buy Cost Calculator</h1>
      <p className="text-muted-foreground mb-8 text-center">
        Calculate the actual buy cost of your units when listing or inputing in Boxem or a repricing
        software
      </p>
      <div className="mx-auto">
        <Calculator />
      </div>
    </main>
  );
}
