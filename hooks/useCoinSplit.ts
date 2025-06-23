/**
 * @fileoverview Coin Splitting Hook for Sui DApp
 * 
 * This file provides a custom React hook for splitting SUI coins on the blockchain.
 * It handles automatic coin selection, transaction creation, and provides user feedback
 * for the coin splitting functionality useful for creating exact payment amounts.
 * 
 * @author Rijad Kuloglija
 * @version 1.0.0
 */

'use client';

import { useState } from 'react';
import { useSignAndExecuteTransaction, useSuiClientQuery } from '@mysten/dapp-kit';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { createCoinSplitTransaction, handleTransactionError, suiToMist } from '@/lib/transactionUtils';
import { SUI_COIN_TYPE } from '@/lib/constants';
import { CoinSplitData, TransactionResponse, UseCoinSplitReturn } from '@/types/sui';
import { toast } from 'sonner';

// ============================================================================
// COIN SPLITTING HOOK
// ============================================================================

/**
 * Custom hook for splitting SUI coins on the blockchain
 * 
 * This hook provides comprehensive coin splitting functionality including:
 * - Automatic fetching of user's available SUI coins
 * - Intelligent coin selection based on balance requirements
 * - Amount conversion from SUI to MIST (smallest unit)
 * - Transaction creation for coin splitting operations
 * - Wallet integration for signing and execution
 * - Loading state management and error handling
 * - Success/failure toast notifications
 * 
 * The coin splitting process:
 * 1. Fetches all available SUI coins for the connected account
 * 2. Converts the requested amount from SUI to MIST
 * 3. Finds a suitable coin object with sufficient balance
 * 4. Creates a splitCoins transaction targeting the selected coin
 * 5. Signs and executes the transaction via wallet
 * 6. Creates new coin objects with the specified amounts
 * 
 * This is useful for:
 * - Creating exact payment amounts for transactions
 * - Breaking down large coin objects into smaller denominations
 * - Preparing coins for complex multi-transaction operations
 * 
 * @returns Object containing split function and state
 * 
 * @example
 * ```tsx
 * function CoinSplitForm() {
 *   const { splitCoin, isLoading, error } = useCoinSplit();
 * 
 *   const handleSplit = async (amount: string) => {
 *     const result = await splitCoin({
 *       amount: amount,
 *       coinObjectId: '' // Auto-selected by the hook
 *     });
 * 
 *     if (result.success) {
 *       console.log('Coin split successful:', result.digest);
 *     }
 *   };
 * 
 *   return (
 *     <div>
 *       <input 
 *         type="number" 
 *         placeholder="Amount to split (SUI)"
 *         onChange={(e) => handleSplit(e.target.value)}
 *       />
 *       <button disabled={isLoading}>
 *         {isLoading ? 'Splitting...' : 'Split Coin'}
 *       </button>
 *       {error && <p>Error: {error}</p>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useCoinSplit(): UseCoinSplitReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  // Get user's SUI coins
  const { data: coins } = useSuiClientQuery(
    'getCoins',
    {
      owner: currentAccount?.address ?? '',
      coinType: SUI_COIN_TYPE,
    },
    {
      enabled: !!currentAccount?.address,
    }
  );

  const splitCoin = async (data: CoinSplitData): Promise<TransactionResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // Convert SUI amount to MIST
      const amountInMist = suiToMist(data.amount);

      // Check if we have enough coins and balance for the operation
      if (!coins?.data || coins.data.length === 0) {
        throw new Error('No SUI coins found in your wallet');
      }

      // Calculate total balance
      const totalBalance = coins.data.reduce((sum, coin) => sum + parseInt(coin.balance), 0);
      const requiredAmount = parseInt(amountInMist);
      const estimatedGas = 10000000; // ~0.01 SUI for gas estimate

      if (totalBalance < requiredAmount + estimatedGas) {
        throw new Error('Insufficient balance for split amount plus gas fees');
      }

      // Find the largest coin to use as gas coin (it will be used for both gas and splitting)
      const suitableCoin = coins.data.reduce((largest, coin) => 
        parseInt(coin.balance) > parseInt(largest.balance) ? coin : largest
      );

      // Check if the largest coin has enough for both the split amount and gas
      if (parseInt(suitableCoin.balance) < requiredAmount + estimatedGas) {
        throw new Error('Largest coin does not have sufficient balance for split amount plus gas fees');
      }

      // Create the transaction - the function will use tx.gas (auto-selected by SDK)
      // but we need to ensure the gas coin has enough balance
      const transaction = createCoinSplitTransaction(
        suitableCoin.coinObjectId, // This parameter is now unused but kept for compatibility
        amountInMist, 
        currentAccount?.address
      );

      // Sign and execute the transaction with automatic gas coin selection
      const result = await new Promise<{ digest: string }>((resolve, reject) => {
        signAndExecuteTransaction(
          {
            transaction,
          },
          {
            onSuccess: (result) => resolve(result),
            onError: (error) => reject(error),
          }
        );
      });

      toast.success(`Successfully split ${data.amount} SUI`);
      
      return {
        success: true,
        digest: result.digest,
        data: result,
      };

    } catch (err) {
      const suiError = handleTransactionError(err);
      setError(suiError.message);
      toast.error(`Failed to split coin: ${suiError.message}`);
      
      return {
        success: false,
        error: suiError.message,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    splitCoin,
    isLoading,
    error,
  };
} 