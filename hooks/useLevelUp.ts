/**
 * @fileoverview NFT Level-Up Hook for Sui DApp
 * 
 * This file provides a custom React hook for upgrading NFT levels on the Sui blockchain.
 * It handles transaction creation, execution, and provides user feedback for the
 * level-up functionality of the smart contract.
 * 
 * @author Rijad Kuloglija
 * @version 1.0.0
 */

'use client';

import { useState } from 'react';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { createLevelUpTransaction, handleTransactionError } from '@/lib/transactionUtils';
import { TransactionResponse, UseLevelUpReturn } from '@/types/sui';
import { toast } from 'sonner';

// ============================================================================
// NFT LEVEL-UP HOOK
// ============================================================================

/**
 * Custom hook for leveling up NFTs on the Sui blockchain
 * 
 * This hook provides NFT upgrade functionality including:
 * - Transaction creation for smart contract level_up function
 * - Wallet integration for signing and execution
 * - Loading state management during upgrade process
 * - Error handling with user-friendly messages
 * - Success/failure toast notifications
 * - Standardized response format
 * 
 * The level-up process:
 * 1. Creates a Move call transaction targeting the NFT object
 * 2. Signs the transaction using the connected wallet
 * 3. Executes the transaction on the blockchain
 * 4. Updates the NFT's level property via smart contract
 * 5. Provides user feedback through toast notifications
 * 
 * @returns Object containing level-up function and state
 * 
 * @example
 * ```tsx
 * function NFTCard({ nft }) {
 *   const { levelUp, isLoading, error } = useLevelUp();
 * 
 *   const handleLevelUp = async () => {
 *     const result = await levelUp(nft.id);
 *     if (result.success) {
 *       console.log('NFT leveled up:', result.digest);
 *       // Refresh NFT data to show new level
 *     }
 *   };
 * 
 *   return (
 *     <div>
 *       <h3>{nft.name} (Level {nft.level})</h3>
 *       <button onClick={handleLevelUp} disabled={isLoading}>
 *         {isLoading ? 'Leveling up...' : 'Level Up'}
 *       </button>
 *       {error && <p>Error: {error}</p>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useLevelUp(): UseLevelUpReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const levelUp = async (nftId: string): Promise<TransactionResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // Create the transaction
      const transaction = createLevelUpTransaction(nftId);

      // Sign and execute the transaction
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

      toast.success('NFT leveled up successfully! 🚀 Level will update shortly.');
      
      return {
        success: true,
        digest: result.digest,
        data: result,
      };

    } catch (err) {
      const suiError = handleTransactionError(err);
      setError(suiError.message);
      toast.error(`Failed to level up NFT: ${suiError.message}`);
      
      return {
        success: false,
        error: suiError.message,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    levelUp,
    isLoading,
    error,
  };
} 