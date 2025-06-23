/**
 * @fileoverview TypeScript type definitions for Sui DApp
 * 
 * This file contains all the TypeScript interfaces and types used throughout
 * the Sui NFT DApp, including blockchain data structures, UI state, and API responses.
 * 
 * @author Rijad Kuloglija
 * @version 1.0.0
 */

import { SuiObjectData, SuiTransactionBlockResponse } from '@mysten/sui/client';

// ============================================================================
// BLOCKCHAIN DATA TYPES
// ============================================================================

/**
 * Represents the basic structure of an NFT object ID from Sui
 */
export interface SuiObjectId {
  /** The unique object ID string */
  id: string;
}

/**
 * Represents an NFT object on the Sui blockchain
 * This interface standardizes NFT data across the application
 */
export interface SuiNFT {
  /** The unique object ID of the NFT on the blockchain */
  id: string;
  /** The display name of the NFT */
  name: string;
  /** The description text of the NFT */
  description: string;
  /** The URL pointing to the NFT's image */
  image_url: string;
  /** The current level of the NFT (upgradeable via level_up function) */
  level: number;
  /** The Sui address of the NFT owner */
  owner: string;
  /** The full type identifier of the object */
  objectType: string;
  /** The version number of the object (for optimistic concurrency) */
  version: string;
  /** The cryptographic digest of the object */
  digest: string;
}

/**
 * Represents a SimpleNFT object from the smart contract
 * This matches the structure returned by the Sui blockchain
 */
export interface SimpleNFT {
  /** The object ID wrapper */
  id: SuiObjectId;
  /** The display name of the NFT */
  name: string;
  /** The description text of the NFT */
  description: string;
  /** The URL pointing to the NFT's image */
  image_url: string;
  /** The current level of the NFT (upgradeable via level_up function) */
  level: number;
}

// ============================================================================
// WALLET STATE TYPES
// ============================================================================

/**
 * Represents the current state of the user's connected wallet
 */
export interface WalletState {
  /** Whether a wallet is currently connected */
  isConnected: boolean;
  /** The Sui address of the connected wallet, null if not connected */
  address: string | null;
  /** The SUI balance in human-readable format, null if not loaded */
  balance: string | null;
  /** Whether wallet operations are in progress */
  isLoading: boolean;
  /** Current error message, if any */
  error: string | null;
}

// ============================================================================
// TRANSACTION STATE TYPES
// ============================================================================

/**
 * Represents the state of a blockchain transaction
 */
export interface TransactionState {
  /** Whether the transaction is currently being processed */
  isPending: boolean;
  /** Whether the transaction completed successfully */
  isSuccess: boolean;
  /** Whether the transaction encountered an error */
  isError: boolean;
  /** Error message if transaction failed */
  error: string | null;
  /** Full transaction response data if successful */
  data: SuiTransactionBlockResponse | null;
}

// ============================================================================
// FORM DATA TYPES
// ============================================================================

/**
 * Form data structure for minting new NFTs
 * Used by the NFT minting form component
 */
export interface MintNFTData {
  /** The name/title for the new NFT */
  name: string;
  /** The description text for the new NFT */
  description: string;
  /** The URL of the image for the new NFT */
  image_url: string;
}

/**
 * Data required for splitting SUI coins
 */
export interface CoinSplitData {
  /** The amount to split in SUI (will be converted to MIST) */
  amount: string;
  /** The object ID of the coin to split */
  coinObjectId: string;
}

// ============================================================================
// BLOCKCHAIN OBJECT TYPES
// ============================================================================

/**
 * Represents a SUI coin object on the blockchain
 * Used for coin splitting and transaction fee payment
 */
export interface SuiCoin {
  /** The type identifier of the coin (e.g., "0x2::sui::SUI") */
  coinType: string;
  /** The unique object ID of the coin */
  coinObjectId: string;
  /** The version number of the coin object */
  version: string;
  /** The cryptographic digest of the coin object */
  digest: string;
  /** The balance of the coin in human-readable format */
  balance: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * Generic response wrapper for Sui object queries
 */
export interface SuiObjectResponse {
  /** The object data if query was successful */
  data: SuiObjectData | null;
  /** Error message if query failed */
  error: string | null;
}

/**
 * Standardized response for all transaction operations
 * Provides consistent error handling and success reporting
 */
export interface TransactionResponse {
  /** Whether the transaction was successful */
  success: boolean;
  /** The transaction digest/hash if successful */
  digest?: string;
  /** Error message if transaction failed */
  error?: string;
  /** Full transaction response data */
  data?: SuiTransactionBlockResponse;
}

/**
 * Result of a successful transaction with NFT details
 */
export interface TransactionResult {
  /** The transaction digest/hash */
  digest: string;
  /** The object ID of the newly created NFT (for mint operations) */
  nftObjectId?: string;
  /** Whether the transaction was successful */
  success: boolean;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Represents different loading states for async operations
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Supported Sui network environments
 */
export type SuiNetwork = 'testnet' | 'mainnet' | 'devnet' | 'localnet';

/**
 * Available smart contract functions
 */
export type ContractFunction = 'mint' | 'level_up';

/**
 * Standardized error object for Sui operations
 */
export interface SuiError {
  /** Human-readable error message */
  message: string;
  /** Error code (if available) */
  code?: string | number;
  /** Additional error details */
  details?: unknown;
}

// ============================================================================
// REACT HOOK RETURN TYPES
// ============================================================================

/**
 * Return type for the useNFTs hook
 * Provides access to the user's NFT collection
 */
export interface UseNFTsReturn {
  /** Array of NFTs owned by the current user */
  nfts: SuiNFT[];
  /** Whether NFT data is being loaded */
  isLoading: boolean;
  /** Current error message, if any */
  error: string | null;
  /** Function to manually refetch NFT data */
  refetch: () => void;
}

/**
 * Return type for the useCoinSplit hook
 * Provides coin splitting functionality
 */
export interface UseCoinSplitReturn {
  /** Function to split coins with the provided data */
  splitCoin: (data: CoinSplitData) => Promise<TransactionResponse>;
  /** Whether a coin split operation is in progress */
  isLoading: boolean;
  /** Current error message, if any */
  error: string | null;
}

/**
 * Return type for the useMintNFT hook
 * Provides NFT minting functionality
 */
export interface UseMintNFTReturn {
  /** Function to mint a new NFT with the provided data */
  mintNFT: (data: MintNFTData) => Promise<TransactionResponse>;
  /** Whether a minting operation is in progress */
  isLoading: boolean;
  /** Current error message, if any */
  error: string | null;
}

/**
 * Return type for the useLevelUp hook
 * Provides NFT level-up functionality
 */
export interface UseLevelUpReturn {
  /** Function to level up an NFT by its ID */
  levelUp: (nftId: string) => Promise<TransactionResponse>;
  /** Whether a level-up operation is in progress */
  isLoading: boolean;
  /** Current error message, if any */
  error: string | null;
} 