'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { CalculatorIcon, RefreshCw } from 'lucide-react';

export function Calculator() {
  const [cost, setCost] = useState<string>('');
  const [discount, setDiscount] = useState<string>('');
  const [salesTax, setSalesTax] = useState<string>('');
  const [additionalCost, setAdditionalCost] = useState<string>('');
  const [finalPrice, setFinalPrice] = useState<number | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [taxAmount, setTaxAmount] = useState<number>(0);

  // Load values from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCost = localStorage.getItem('calculator_cost');
      const savedDiscount = localStorage.getItem('calculator_discount');
      const savedSalesTax = localStorage.getItem('calculator_salesTax');
      const savedAdditionalCost = localStorage.getItem('calculator_additionalCost');

      if (savedCost) setCost(savedCost);
      if (savedDiscount) setDiscount(savedDiscount);
      if (savedSalesTax) setSalesTax(savedSalesTax);
      if (savedAdditionalCost) setAdditionalCost(savedAdditionalCost);
    }
  }, []);

  // Save values to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('calculator_cost', cost);
      localStorage.setItem('calculator_discount', discount);
      localStorage.setItem('calculator_salesTax', salesTax);
      localStorage.setItem('calculator_additionalCost', additionalCost);
    }
  }, [cost, discount, salesTax, additionalCost]);

  // Recalculate price whenever inputs change
  useEffect(() => {
    calculatePrice();
  }, [cost, discount, salesTax, additionalCost]);

  const calculatePrice = () => {
    const costValue = Number.parseFloat(cost) || 0;
    const discountValue = Number.parseFloat(discount) || 0;
    const salesTaxValue = Number.parseFloat(salesTax) || 0;
    const additionalCostValue = Number.parseFloat(additionalCost) || 0;

    if (costValue === 0) {
      setFinalPrice(null);
      setDiscountAmount(0);
      setTaxAmount(0);
      return;
    }

    // Calculate discount amount
    const discountDecimal = discountValue / 100;
    const discountAmountValue = costValue * discountDecimal;
    setDiscountAmount(discountAmountValue);

    // Apply discount
    const priceAfterDiscount = costValue - discountAmountValue;

    // Calculate and apply sales tax
    const taxDecimal = salesTaxValue / 100;
    const taxAmountValue = priceAfterDiscount * taxDecimal;
    setTaxAmount(taxAmountValue);

    // Calculate final price with additional cost
    const finalPriceValue = priceAfterDiscount + taxAmountValue + additionalCostValue;
    setFinalPrice(finalPriceValue);
  };

  const resetCalculator = () => {
    setCost('');
    setDiscount('');
    setSalesTax('');
    setAdditionalCost('');
    setFinalPrice(null);
    setDiscountAmount(0);
    setTaxAmount(0);

    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('calculator_cost');
      localStorage.removeItem('calculator_discount');
      localStorage.removeItem('calculator_salesTax');
      localStorage.removeItem('calculator_additionalCost');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  // Format input as user types to automatically add decimal points
  const formatInputValue = (value: string, isPercentage = false) => {
    // Remove any non-digit characters
    const digitsOnly = value.replace(/\D/g, '');

    if (digitsOnly === '') return '';

    // Convert to number and divide by 100 to get decimal representation
    const numericValue = Number.parseInt(digitsOnly, 10) / 100;

    // Format with 2 decimal places
    return numericValue.toFixed(2);
  };

  // Handle input changes with automatic decimal formatting
  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatInputValue(e.target.value);
    setCost(formattedValue);
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatInputValue(e.target.value, true);
    setDiscount(formattedValue);
  };

  const handleSalesTaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatInputValue(e.target.value, true);
    setSalesTax(formattedValue);
  };

  const handleAdditionalCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatInputValue(e.target.value);
    setAdditionalCost(formattedValue);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>Cost Calculator</CardTitle>
          <CardDescription>Calculate your buy cost</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={resetCalculator} title="Reset calculator">
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Reset calculator</span>
          </Button>
          <ModeToggle />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cost">Product Cost</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              $
            </span>
            <Input
              id="cost"
              type="text"
              inputMode="numeric"
              placeholder="0.00"
              className="pl-8"
              value={cost}
              onChange={handleCostChange}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="discount">Discount (%)</Label>
          <div className="relative">
            <Input
              id="discount"
              type="text"
              inputMode="numeric"
              placeholder="0.00"
              value={discount}
              onChange={handleDiscountChange}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              %
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="salesTax">Sales Tax (%)</Label>
          <div className="relative">
            <Input
              id="salesTax"
              type="text"
              inputMode="numeric"
              placeholder="0.00"
              value={salesTax}
              onChange={handleSalesTaxChange}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              %
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="additionalCost">Additional Cost</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              $
            </span>
            <Input
              id="additionalCost"
              type="text"
              inputMode="numeric"
              placeholder="0.00"
              className="pl-8"
              value={additionalCost}
              onChange={handleAdditionalCostChange}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="w-full rounded-md bg-muted p-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Original Cost:</span>
            <span>{cost ? formatCurrency(Number.parseFloat(cost)) : '$0.00'}</span>
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
              {Number.parseFloat(additionalCost) > 0 && (
                <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                  <span>Additional Cost:</span>
                  <span>+{formatCurrency(Number.parseFloat(additionalCost))}</span>
                </div>
              )}
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
  );
}
