/**
 * @fileoverview NFT Minting Hook for Sui DApp
 * 
 * This file provides a custom React hook for minting new NFTs on the Sui blockchain.
 * It handles transaction creation, signing, execution, and provides user feedback
 * through toast notifications and loading states.
 * 
 * @author Rijad Kuloglija
 * @version 1.0.0
 */

'use client';

import { useState } from 'react';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { createMintNFTTransaction, handleTransactionError } from '@/lib/transactionUtils';
import { MintNFTData, TransactionResponse, UseMintNFTReturn } from '@/types/sui';
import { toast } from 'sonner';

// ============================================================================
// NFT MINTING HOOK
// ============================================================================

/**
 * Custom hook for minting NFTs on the Sui blockchain
 * 
 * This hook provides a complete NFT minting solution including:
 * - Transaction creation with smart contract interaction
 * - Wallet integration for signing and execution
 * - Loading state management during minting process
 * - Error handling with user-friendly messages
 * - Success/failure toast notifications
 * - Standardized response format
 * 
 * The minting process:
 * 1. Creates a Move call transaction with NFT metadata
 * 2. Signs the transaction using the connected wallet
 * 3. Executes the transaction on the blockchain
 * 4. Provides user feedback through toast notifications
 * 5. Returns success/failure status with transaction details
 * 
 * @returns Object containing mint function and state
 * 
 * @example
 * ```tsx
 * function MintNFTForm() {
 *   const { mintNFT, isLoading, error } = useMintNFT();
 * 
 *   const handleSubmit = async (formData) => {
 *     const result = await mintNFT({
 *       name: formData.name,
 *       description: formData.description,
 *       image_url: formData.imageUrl
 *     });
 * 
 *     if (result.success) {
 *       console.log('NFT minted:', result.digest);
 *     }
 *   };
 * 
 *   return (
 *     // Form with NFT fields and submit button
 *     // Button shows loading state during minting
 *     // Error message displayed if minting fails
 *   );
 * }
 * ```
 */
export function useMintNFT(): UseMintNFTReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const mintNFT = async (data: MintNFTData): Promise<TransactionResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // Create the transaction
      const transaction = createMintNFTTransaction(data);

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

      toast.success('NFT minted successfully!');
      
      return {
        success: true,
        digest: result.digest,
        data: result,
      };

    } catch (err) {
      const suiError = handleTransactionError(err);
      setError(suiError.message);
      toast.error(`Failed to mint NFT: ${suiError.message}`);
      
      return {
        success: false,
        error: suiError.message,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mintNFT,
    isLoading,
    error,
  };
} 