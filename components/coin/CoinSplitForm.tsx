/**
 * @fileoverview Coin Split Form Component
 * 
 * This component provides a user interface for splitting SUI coins on the Sui blockchain.
 * It includes form validation, coin selection, and integration with the useCoinSplit hook.
 * 
 * @author Rijad Kuloglija
 * @version 1.0.0
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useCoinSplit } from '@/hooks/useCoinSplit';
import { useWallet } from '@/hooks/useWallet';
import { formatSUI } from '@/lib/utils';
import { Coins, Split, ArrowRight, Info, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

// ============================================================================
// FORM VALIDATION SCHEMA
// ============================================================================

/**
 * Validation schema for coin split form
 * Ensures amount is positive and within reasonable bounds
 */
const coinSplitSchema = z.object({
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      },
      'Amount must be a positive number'
    )
    .refine(
      (val) => {
        const num = parseFloat(val);
        return num >= 0.001; // Minimum 0.001 SUI
      },
      'Amount must be at least 0.001 SUI'
    )
    .refine(
      (val) => {
        const num = parseFloat(val);
        return num <= 1000; // Maximum 1000 SUI
      },
      'Amount cannot exceed 1000 SUI'
    ),
});

type CoinSplitFormData = z.infer<typeof coinSplitSchema>;

// ============================================================================
// COIN SPLIT FORM COMPONENT
// ============================================================================

/**
 * CoinSplitForm Component
 * 
 * Provides a user interface for splitting SUI coins into smaller denominations.
 * The component includes:
 * - Form validation for amount input
 * - Display of current SUI balance
 * - Preview of the split operation
 * - Integration with wallet and coin split functionality
 * - Loading states and error handling
 * - Success feedback with transaction details
 * 
 * The splitting process:
 * 1. User enters the amount to split from their SUI balance
 * 2. Form validates the input against available balance
 * 3. Preview shows the operation (original coin → new split coin)
 * 4. User confirms and signs the transaction
 * 5. New coin object is created with the specified amount
 * 
 * @returns JSX element containing the coin split form interface
 */
export function CoinSplitForm() {
  const [lastSplitResult, setLastSplitResult] = useState<string | null>(null);
  const { splitCoin, isLoading, error } = useCoinSplit();
  const { balance } = useWallet();

  const form = useForm<CoinSplitFormData>({
    resolver: zodResolver(coinSplitSchema),
    defaultValues: {
      amount: '',
    },
  });

  const watchedAmount = form.watch('amount');
  const numericAmount = parseFloat(watchedAmount) || 0;
  const balanceNumber = parseFloat(balance || '0') || 0;

  /**
   * Handle form submission
   */
  const onSubmit = async (data: CoinSplitFormData) => {
    try {
      // Check if user has sufficient balance
      if (numericAmount > balanceNumber) {
        toast.error('Insufficient balance for this split amount');
        return;
      }

      const result = await splitCoin({
        amount: data.amount,
        coinObjectId: '', // Auto-selected by the hook
      });

      if (result.success) {
        setLastSplitResult(result.digest ?? '');
        form.reset();
        toast.success(`Successfully split ${data.amount} SUI!`);
      }
    } catch (error) {
      console.error('Split coin failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Form Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Split className="h-5 w-5 text-blue-600" />
            <span>Split SUI Coins</span>
          </CardTitle>
          <CardDescription>
            Split your SUI coins into smaller denominations for better transaction management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Balance Display */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <div className="flex items-center space-x-2">
              <Coins className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Available Balance:</span>
            </div>
            <Badge variant="secondary" className="font-mono">
              {formatSUI(balance || '0')} SUI
            </Badge>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount to Split (SUI)</Label>
              <Input
                id="amount"
                type="number"
                step="0.001"
                min="0.001"
                max="1000"
                placeholder="0.1"
                disabled={isLoading}
                {...form.register('amount')}
              />
              {form.formState.errors.amount && (
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{form.formState.errors.amount.message}</span>
                </p>
              )}
            </div>

            {/* Split Preview */}
            {numericAmount > 0 && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-2 mb-3">
                  <Info className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Split Preview
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                                   <div className="text-center">
                   <p className="text-muted-foreground">Original Balance</p>
                   <p className="font-mono font-medium">{formatSUI(balance || '0')} SUI</p>
                 </div>
                  <ArrowRight className="h-4 w-4 text-blue-600" />
                  <div className="text-center">
                    <p className="text-muted-foreground">New Split Coin</p>
                    <p className="font-mono font-medium text-blue-600">
                      {numericAmount.toFixed(3)} SUI
                    </p>
                  </div>
                </div>
                {numericAmount > balanceNumber && (
                  <div className="mt-3 p-2 bg-red-50 dark:bg-red-950/20 rounded border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>Insufficient balance for this amount</span>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={
                isLoading ||
                !form.formState.isValid ||
                numericAmount <= 0 ||
                numericAmount > balanceNumber
              }
              className="w-full"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Splitting Coin...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Split className="h-4 w-4" />
                  <span>Split Coin</span>
                </div>
              )}
            </Button>

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{error}</span>
                </p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Success Result */}
      {lastSplitResult && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-800 dark:text-green-200">
              <Split className="h-5 w-5" />
              <span>Split Successful!</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-green-700 dark:text-green-300">
                Your coin has been successfully split. A new coin object has been created.
              </p>
              <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border">
                <span className="text-sm font-medium">Transaction:</span>
                <Badge variant="outline" className="font-mono text-xs">
                  {lastSplitResult.slice(0, 8)}...{lastSplitResult.slice(-6)}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(lastSplitResult);
                  toast.success('Transaction hash copied to clipboard');
                }}
                className="w-full"
              >
                Copy Transaction Hash
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/10">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-medium text-blue-800 dark:text-blue-200">
                About Coin Splitting
              </h4>
              <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <p>• Coin splitting creates new coin objects with specified amounts</p>
                <p>• Useful for creating exact payment amounts for transactions</p>
                <p>• The original coin balance will be reduced by the split amount</p>
                <p>• Split coins can be used independently for other transactions</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 