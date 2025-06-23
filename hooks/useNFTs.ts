/**
 * @fileoverview NFT Collection Hook for Sui DApp
 * 
 * This file provides a custom React hook for fetching and managing the user's
 * NFT collection. It queries the blockchain for owned NFTs, transforms the data
 * into a standardized format, and provides real-time updates.
 * 
 * @author Rijad Kuloglija
 * @version 1.0.0
 */

'use client';

import { useSuiClientQuery } from '@mysten/dapp-kit';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { PACKAGE_ID } from '@/lib/constants';
import { SimpleNFT } from '@/types/sui';
import { useMemo } from 'react';

// ============================================================================
// NFT COLLECTION HOOK
// ============================================================================

/**
 * Custom hook for fetching and managing user's NFT collection
 * 
 * This hook provides comprehensive NFT collection management including:
 * - Real-time fetching of user's owned NFTs from the blockchain
 * - Automatic filtering for NFTs from the specific smart contract
 * - Data transformation from raw blockchain objects to standardized format
 * - Support for NFT display metadata and custom fields
 * - Automatic refresh every 30 seconds to stay current
 * - Loading states and error handling
 * 
 * @returns Object containing NFT collection and state
 */
export function useNFTs() {
  const currentAccount = useCurrentAccount();

  // Fetch all objects owned by the user
  const { data: ownedObjects, isLoading, error, refetch } = useSuiClientQuery(
    'getOwnedObjects',
    {
      owner: currentAccount?.address ?? '',
      filter: {
        Package: PACKAGE_ID,
      },
      options: {
        showContent: true,
        showType: true,
        showOwner: true,
        showDisplay: true,
      },
    },
    {
      enabled: !!currentAccount?.address,
      refetchInterval: 30000, // Refresh every 30 seconds
    }
  );

  // Transform the raw object data into SimpleNFT format
  const nfts = useMemo((): SimpleNFT[] => {
    if (!ownedObjects?.data) return [];

    // Debug: Log all owned objects to see what we're getting
    console.log('All owned objects:', ownedObjects.data);
    
    // Filter for objects from our package (temporarily removing type filter for debugging)
    const packageObjects = ownedObjects.data.filter((obj) => {
      const hasPackageId = obj.data?.type?.includes(PACKAGE_ID);
      console.log('Object type:', obj.data?.type, 'Has package ID:', hasPackageId);
      return hasPackageId;
    });
    
    console.log('Objects from our package:', packageObjects);

    return packageObjects
      .map((obj): SimpleNFT => {
        const content = obj.data?.content;
        const fields = content && 'fields' in content ? (content.fields as Record<string, unknown>) : {};
        const display = obj.data?.display?.data;

        console.log('Processing object:', {
          id: obj.data?.objectId,
          type: obj.data?.type,
          fields,
          display
        });

        return {
          id: { id: obj.data?.objectId ?? '' },
          name: display?.name || (typeof fields?.name === 'string' ? fields.name : '') || 'Unknown NFT',
          description: display?.description || (typeof fields?.description === 'string' ? fields.description : '') || 'No description',
          image_url: display?.image_url || (typeof fields?.image_url === 'string' ? fields.image_url : '') || '',
          level: typeof fields?.level === 'number' ? fields.level : 1,
        };
      });
  }, [ownedObjects, currentAccount?.address]);

  return {
    nfts,
    isLoading,
    error: error?.message ?? null,
    refetch,
  };
} 