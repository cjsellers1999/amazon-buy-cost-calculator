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
import { CalculatorIcon, RefreshCw, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Define the item type
interface CalculatorItem {
  id: string;
  cost: string;
  discount: string;
  salesTax: string;
  additionalCost: string;
  quantity: string;
  finalPrice: number;
  itemId: string; // Unique identifier for the item in the list
}

export function Calculator() {
  const [cost, setCost] = useState<string>('');
  const [discount, setDiscount] = useState<string>('');
  const [salesTax, setSalesTax] = useState<string>('');
  const [additionalCost, setAdditionalCost] = useState<string>('');
  const [productId, setProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('1');
  const [finalPrice, setFinalPrice] = useState<number | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [taxAmount, setTaxAmount] = useState<number>(0);

  // Items list state
  const [items, setItems] = useState<CalculatorItem[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Load values from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCost = localStorage.getItem('calculator_cost');
      const savedDiscount = localStorage.getItem('calculator_discount');
      const savedSalesTax = localStorage.getItem('calculator_salesTax');
      const savedAdditionalCost = localStorage.getItem('calculator_additionalCost');
      const savedQuantity = localStorage.getItem('calculator_quantity');
      const savedProductId = localStorage.getItem('calculator_productId');
      const savedItems = localStorage.getItem('calculator_items');

      if (savedCost) setCost(savedCost);
      if (savedDiscount) setDiscount(savedDiscount);
      if (savedSalesTax) setSalesTax(savedSalesTax);
      if (savedAdditionalCost) setAdditionalCost(savedAdditionalCost);
      if (savedQuantity) setQuantity(savedQuantity);
      if (savedProductId) setProductId(savedProductId);
      if (savedItems) setItems(JSON.parse(savedItems));
    }
  }, []);

  // Save values to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('calculator_cost', cost);
      localStorage.setItem('calculator_discount', discount);
      localStorage.setItem('calculator_salesTax', salesTax);
      localStorage.setItem('calculator_additionalCost', additionalCost);
      localStorage.setItem('calculator_quantity', quantity);
      localStorage.setItem('calculator_productId', productId);
      localStorage.setItem('calculator_items', JSON.stringify(items));
    }
  }, [cost, discount, salesTax, additionalCost, quantity, productId, items]);

  // Recalculate price whenever inputs change
  useEffect(() => {
    calculatePrice();
  }, [cost, discount, salesTax, additionalCost, quantity]);

  // Calculate total amount whenever items change
  useEffect(() => {
    const total = items.reduce((sum, item) => {
      const itemQuantity = Number.parseFloat(item.quantity) || 0;
      return sum + item.finalPrice * itemQuantity;
    }, 0);
    setTotalAmount(total);
  }, [items]);

  const calculatePrice = () => {
    const costValue = Number.parseFloat(cost) || 0;
    const discountValue = Number.parseFloat(discount) || 0;
    const salesTaxValue = Number.parseFloat(salesTax) || 0;
    const additionalCostValue = Number.parseFloat(additionalCost) || 0;
    const quantityValue = Number.parseFloat(quantity) || 1;

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

    // Calculate final price with additional cost (per unit)
    const finalPriceValue = priceAfterDiscount + taxAmountValue + additionalCostValue;
    setFinalPrice(finalPriceValue);
  };

  const resetCalculator = () => {
    setCost('');
    // Don't reset discount and sales tax as they typically remain constant
    // setDiscount("")
    // setSalesTax("")
    setAdditionalCost('');
    setProductId('');
    setQuantity('1');
    setFinalPrice(null);
    setDiscountAmount(0);
    setTaxAmount(0);

    // Clear localStorage for form fields, but keep discount and sales tax
    if (typeof window !== 'undefined') {
      localStorage.removeItem('calculator_cost');
      // Don't remove discount and sales tax from localStorage
      // localStorage.removeItem("calculator_discount")
      // localStorage.removeItem("calculator_salesTax")
      localStorage.removeItem('calculator_additionalCost');
      localStorage.removeItem('calculator_quantity');
      localStorage.removeItem('calculator_productId');
    }
  };

  const resetAllData = () => {
    resetCalculator();
    setItems([]);
    setTotalAmount(0);

    // Clear localStorage for items
    if (typeof window !== 'undefined') {
      localStorage.removeItem('calculator_items');
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

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setQuantity(value);
  };

  // Add current item to the list
  const addItem = () => {
    if (!productId.trim() || finalPrice === null) return;

    const newItem: CalculatorItem = {
      id: productId,
      cost,
      discount,
      salesTax,
      additionalCost,
      quantity: quantity || '1',
      finalPrice,
      itemId: Date.now().toString(), // Generate a unique ID for the item
    };

    setItems((prevItems) => [...prevItems, newItem]);
    resetCalculator();
  };

  // Remove an item from the list
  const removeItem = (itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.itemId !== itemId));
    if (editingItemId === itemId) {
      setEditingItemId(null);
    }
    setItemToDelete(null);
  };

  // Start editing an item
  const startEditItem = (item: CalculatorItem) => {
    setEditingItemId(item.itemId);
    setCost(item.cost);
    setDiscount(item.discount);
    setSalesTax(item.salesTax);
    setAdditionalCost(item.additionalCost);
    setProductId(item.id);
    setQuantity(item.quantity || '1');
  };

  // Save edited item
  const saveEditItem = () => {
    if (!editingItemId || !productId.trim() || finalPrice === null) return;

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.itemId === editingItemId
          ? {
              id: productId,
              cost,
              discount,
              salesTax,
              additionalCost,
              quantity: quantity || '1',
              finalPrice,
              itemId: item.itemId,
            }
          : item
      )
    );

    setEditingItemId(null);
    resetCalculator();
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingItemId(null);
    resetCalculator();
  };

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle>Cost Calculator</CardTitle>
            <CardDescription>Calculate your buy cost</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={resetCalculator}
              title="Reset calculator"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only">Reset calculator</span>
            </Button>
            <ModeToggle />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productId" className="text-base">
                Product ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="productId"
                type="text"
                placeholder="ASIN, UPC, etc."
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className={editingItemId ? 'border-yellow-500' : ''}
              />
              {editingItemId && (
                <p className="text-xs text-muted-foreground">Editing existing item</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-base">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                placeholder="1"
                value={quantity}
                onChange={handleQuantityChange}
              />
            </div>
          </div>

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
                    Unit Price:
                  </span>
                  <span className="text-lg font-bold">{formatCurrency(finalPrice)}</span>
                </div>
                {Number.parseFloat(quantity) > 1 && (
                  <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                    <span>Total for {quantity} units:</span>
                    <span>{formatCurrency(finalPrice * Number.parseFloat(quantity))}</span>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="w-full mt-4 flex justify-end gap-2">
            {editingItemId ? (
              <>
                <Button variant="outline" onClick={cancelEdit}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={saveEditItem} disabled={!productId.trim() || finalPrice === null}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={addItem} disabled={!productId.trim() || finalPrice === null}>
                <Plus className="h-4 w-4 mr-2" />
                Add to List
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      {items.length > 0 && (
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle>Item List</CardTitle>
              <CardDescription>Your saved items</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Clear All Items</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete all items? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-row justify-end gap-2 sm:justify-end">
                  <Button variant="outline" onClick={() => {}}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={resetAllData}>
                    Delete All
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="min-w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[10%]">Actions</TableHead>
                    <TableHead className="w-[30%]">ID</TableHead>
                    <TableHead className="w-[20%]">Unit Price</TableHead>
                    <TableHead className="w-[15%]">Quantity</TableHead>
                    <TableHead className="w-[20%]">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.itemId}>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => startEditItem(item)}
                            disabled={editingItemId !== null}
                          >
                            <Edit2 className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Dialog
                            open={itemToDelete === item.itemId}
                            onOpenChange={(open) => {
                              if (!open) setItemToDelete(null);
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setItemToDelete(item.itemId)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Confirm Deletion</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete item {item.id}? This action cannot
                                  be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter className="flex flex-row justify-end gap-2 sm:justify-end">
                                <Button variant="outline" onClick={() => setItemToDelete(null)}>
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => removeItem(item.itemId)}
                                >
                                  Delete
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium flex items-center gap-4">
                        {item.id}
                      </TableCell>
                      <TableCell>{formatCurrency(item.finalPrice)}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        {formatCurrency(item.finalPrice * Number.parseFloat(item.quantity))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full rounded-md bg-muted p-4">
              <div className="flex items-center justify-between font-medium">
                <span className="text-lg">Running Total:</span>
                <span className="text-xl font-bold">{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                <span>Total Items:</span>
                <span>{items.length}</span>
              </div>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
