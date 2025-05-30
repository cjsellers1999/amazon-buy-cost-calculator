"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { ModeToggle } from "./mode-toggle"
import { CalculatorIcon } from "lucide-react"

export function Calculator() {
  const [cost, setCost] = useState<string>("")
  const [discount, setDiscount] = useState<string>("")
  const [salesTax, setSalesTax] = useState<string>("")
  const [finalPrice, setFinalPrice] = useState<number | null>(null)
  const [discountAmount, setDiscountAmount] = useState<number>(0)
  const [taxAmount, setTaxAmount] = useState<number>(0)

  useEffect(() => {
    calculatePrice()
  }, [cost, discount, salesTax])

  const calculatePrice = () => {
    const costValue = Number.parseFloat(cost) || 0
    const discountValue = Number.parseFloat(discount) || 0
    const salesTaxValue = Number.parseFloat(salesTax) || 0

    if (costValue === 0) {
      setFinalPrice(null)
      setDiscountAmount(0)
      setTaxAmount(0)
      return
    }

    // Calculate discount amount
    const discountDecimal = discountValue / 100
    const discountAmountValue = costValue * discountDecimal
    setDiscountAmount(discountAmountValue)

    // Apply discount
    const priceAfterDiscount = costValue - discountAmountValue

    // Calculate and apply sales tax
    const taxDecimal = salesTaxValue / 100
    const taxAmountValue = priceAfterDiscount * taxDecimal
    setTaxAmount(taxAmountValue)

    // Calculate final price
    const finalPriceValue = priceAfterDiscount + taxAmountValue
    setFinalPrice(finalPriceValue)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>Cost Calculator</CardTitle>
          <CardDescription>Calculate your final product cost</CardDescription>
        </div>
        <ModeToggle />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cost">Product Cost</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input
              id="cost"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              className="pl-8"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="discount">Discount (%)</Label>
          <div className="relative">
            <Input
              id="discount"
              type="number"
              min="0"
              max="100"
              step="0.01"
              placeholder="0"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="salesTax">Sales Tax (%)</Label>
          <div className="relative">
            <Input
              id="salesTax"
              type="number"
              min="0"
              max="100"
              step="0.01"
              placeholder="0"
              value={salesTax}
              onChange={(e) => setSalesTax(e.target.value)}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="w-full rounded-md bg-muted p-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Original Cost:</span>
            <span>{cost ? formatCurrency(Number.parseFloat(cost)) : "$0.00"}</span>
          </div>
          {finalPrice !== null && (
            <>
              <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                <span>Discount ({discount || 0}%):</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                <span>Sales Tax ({salesTax || 0}%):</span>
                <span>+{formatCurrency(taxAmount)}</span>
              </div>
              <div className="mt-4 pt-4 border-t flex items-center justify-between font-medium">
                <span className="flex items-center gap-1">
                  <CalculatorIcon className="h-4 w-4" />
                  Final Price:
                </span>
                <span className="text-lg font-bold">{formatCurrency(finalPrice)}</span>
              </div>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
