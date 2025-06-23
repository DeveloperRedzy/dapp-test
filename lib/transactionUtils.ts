/**
 * @fileoverview Transaction Utility Functions for Sui DApp
 * 
 * This file contains utility functions for creating, handling, and processing
 * Sui blockchain transactions. It provides transaction builders for smart contract
 * interactions, error handling, amount formatting, and validation utilities.
 * 
 * @author Rijad Kuloglija
 * @version 1.0.0
 */

import { Transaction } from '@mysten/sui/transactions';
import { SuiClient, SuiTransactionBlockResponse } from '@mysten/sui/client';
import { CONTRACT_FUNCTIONS } from './constants';
import { MintNFTData, TransactionResponse, SuiError } from '@/types/sui';

// ============================================================================
// TRANSACTION BUILDERS
// ============================================================================

/**
 * Create a transaction for minting an NFT
 * 
 * Builds a Move call transaction to the smart contract's mint function.
 * The transaction includes the NFT metadata (name, description, image URL).
 * 
 * @param data - The NFT data including name, description, and image URL
 * @returns A Transaction object ready for signing and execution
 * 
 * @example
 * ```ts
 * const tx = createMintNFTTransaction({
 *   name: "My NFT",
 *   description: "A cool NFT",
 *   image_url: "https://example.com/image.jpg"
 * });
 * await signAndExecuteTransaction({ transaction: tx });
 * ```
 */
export function createMintNFTTransaction(data: MintNFTData): Transaction {
  const tx = new Transaction();
  
  tx.moveCall({
    target: CONTRACT_FUNCTIONS.MINT,
    arguments: [
      tx.pure.string(data.name),
      tx.pure.string(data.description),
      tx.pure.string(data.image_url),
    ],
  });

  return tx;
}

/**
 * Create a transaction for leveling up an NFT
 * 
 * Builds a Move call transaction to upgrade an existing NFT's level.
 * This calls the smart contract's level_up function with the NFT object.
 * 
 * @param nftId - The object ID of the NFT to level up
 * @returns A Transaction object ready for signing and execution
 * 
 * @example
 * ```ts
 * const tx = createLevelUpTransaction("0x123...abc");
 * await signAndExecuteTransaction({ transaction: tx });
 * ```
 */
export function createLevelUpTransaction(nftId: string): Transaction {
  const tx = new Transaction();
  
  tx.moveCall({
    target: CONTRACT_FUNCTIONS.LEVEL_UP,
    arguments: [tx.object(nftId)],
  });

  return tx;
}

/**
 * Create a transaction for splitting SUI coins
 * 
 * Builds a transaction to split a specified amount from a SUI coin object.
 * This is useful for creating smaller denominations or preparing exact amounts.
 * The split coin is automatically transferred back to the sender.
 * 
 * @param coinObjectId - The object ID of the coin to split from
 * @param amount - The amount to split (in MIST, the smallest SUI unit)
 * @param recipient - The address to send the split coin to (defaults to sender)
 * @returns A Transaction object ready for signing and execution
 * 
 * @example
 * ```ts
 * const tx = createCoinSplitTransaction("0x456...def", "1000000000"); // Split 1 SUI
 * await signAndExecuteTransaction({ transaction: tx });
 * ```
 */
export function createCoinSplitTransaction(
  coinObjectId: string,
  amount: string,
  recipient?: string
): Transaction {
  const tx = new Transaction();
  
  // IMPORTANT: Don't set manual gas budget - let Sui SDK handle it automatically
  // tx.setGasBudget() is not needed and can cause issues
  
  // Split coins from the GAS coin, not a specific coin object
  // This allows using the same coin for both gas payment and splitting
  const splitCoin = tx.splitCoins(tx.gas, [amount]);
  
  // Transfer the split coin to the specified recipient
  // This prevents the UnusedValueWithoutDrop error by ensuring the split coin is properly handled
  if (recipient) {
    tx.transferObjects([splitCoin], recipient);
  }
  
  return tx;
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * Handle transaction errors and convert to user-friendly messages
 * 
 * This function takes raw blockchain errors and converts them into
 * standardized, user-friendly error messages. It recognizes common
 * error patterns and provides appropriate error codes.
 * 
 * @param error - The raw error from the blockchain operation
 * @returns A standardized SuiError object with user-friendly message
 * 
 * @example
 * ```ts
 * try {
 *   await signAndExecuteTransaction({ transaction: tx });
 * } catch (error) {
 *   const suiError = handleTransactionError(error);
 *   console.error(suiError.message); // User-friendly message
 * }
 * ```
 */
export function handleTransactionError(error: unknown): SuiError {
  if (error instanceof Error) {
    // Check for common Sui error patterns
    if (error.message.includes('Insufficient funds')) {
      return {
        message: 'Insufficient SUI balance to complete the transaction',
        code: 'INSUFFICIENT_FUNDS',
        details: error,
      };
    }
    
    if (error.message.includes('Gas budget')) {
      return {
        message: 'Transaction requires more gas than available',
        code: 'GAS_BUDGET_ERROR',
        details: error,
      };
    }
    
    if (error.message.includes('No valid gas coins found')) {
      return {
        message: 'No separate coin available for gas fees. You may need more SUI coins or a larger balance.',
        code: 'NO_GAS_COINS',
        details: error,
      };
    }
    
    if (error.message.includes('Object not found')) {
      return {
        message: 'The requested object was not found on the blockchain',
        code: 'OBJECT_NOT_FOUND',
        details: error,
      };
    }
    
    if (error.message.includes('User rejected')) {
      return {
        message: 'Transaction was rejected by the user',
        code: 'USER_REJECTED',
        details: error,
      };
    }

    return {
      message: error.message,
      code: 'TRANSACTION_ERROR',
      details: error,
    };
  }

  return {
    message: 'An unknown error occurred during the transaction',
    code: 'UNKNOWN_ERROR',
    details: error,
  };
}

/**
 * Format SUI amounts from MIST to SUI
 */
export function formatSuiAmount(mist: string | number): string {
  const mistNumber = typeof mist === 'string' ? parseInt(mist, 10) : mist;
  const sui = mistNumber / 1_000_000_000; // 1 SUI = 1,000,000,000 MIST
  return sui.toFixed(9).replace(/\.?0+$/, ''); // Remove trailing zeros
}

/**
 * Convert SUI to MIST
 */
export function suiToMist(sui: string | number): string {
  const suiNumber = typeof sui === 'string' ? parseFloat(sui) : sui;
  const mist = Math.floor(suiNumber * 1_000_000_000);
  return mist.toString();
}

/**
 * Validate SUI amount input
 */
export function validateSuiAmount(amount: string): { isValid: boolean; error?: string } {
  if (!amount || amount.trim() === '') {
    return { isValid: false, error: 'Amount is required' };
  }

  const numAmount = parseFloat(amount);
  
  if (isNaN(numAmount)) {
    return { isValid: false, error: 'Amount must be a valid number' };
  }

  if (numAmount <= 0) {
    return { isValid: false, error: 'Amount must be greater than 0' };
  }

  if (numAmount < 0.000000001) { // Minimum 1 MIST
    return { isValid: false, error: 'Amount is too small (minimum 0.000000001 SUI)' };
  }

  return { isValid: true };
}

/**
 * Create a transaction response wrapper
 */
export function createTransactionResponse(
  success: boolean,
  digest?: string,
  error?: string,
  data?: SuiTransactionBlockResponse
): TransactionResponse {
  return {
    success,
    digest,
    error,
    data,
  };
}

/**
 * Wait for transaction confirmation
 */
export async function waitForTransaction(
  client: SuiClient,
  digest: string,
  timeoutMs: number = 30000
): Promise<SuiTransactionBlockResponse> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeoutMs) {
    try {
      const result = await client.getTransactionBlock({
        digest,
        options: {
          showEffects: true,
          showObjectChanges: true,
        },
      });
      
      if (result.effects?.status?.status === 'success') {
        return result;
      } else if (result.effects?.status?.status === 'failure') {
        throw new Error(`Transaction failed: ${result.effects.status.error}`);
      }
    } catch (error) {
      // Transaction might not be available yet, continue polling
      if (error instanceof Error && !error.message.includes('not found')) {
        throw error;
      }
    }
    
    // Wait 1 second before checking again
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  throw new Error('Transaction confirmation timeout');
} 