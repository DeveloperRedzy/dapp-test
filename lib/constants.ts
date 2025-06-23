/**
 * @fileoverview Application constants for Sui NFT DApp
 * 
 * This file contains all the configuration constants used throughout the application,
 * including network settings, contract addresses, UI configuration, and transaction parameters.
 * 
 * @author Rijad Kuloglija
 * @version 1.0.0
 */

// ============================================================================
// NETWORK CONFIGURATION
// ============================================================================

/**
 * The Sui network to connect to (testnet, mainnet, devnet, or localnet)
 * Defaults to 'testnet' if not specified in environment variables
 */
export const SUI_NETWORK = process.env.NEXT_PUBLIC_SUI_NETWORK as 'testnet' | 'mainnet' | 'devnet' | 'localnet' || 'testnet';

// ============================================================================
// SMART CONTRACT CONFIGURATION
// ============================================================================

/**
 * The package ID of the deployed Sui smart contract
 * Contains the simple_nft module with mint and level_up functions
 */
export const PACKAGE_ID = process.env.NEXT_PUBLIC_PACKAGE_ID || '0x95ea5e48398629b9e21b47bd43ae04174ac3e310b54fb961d780b856b3eaf1a3';

/**
 * The module name within the smart contract package
 */
export const MODULE_NAME = 'simple_nft';

/**
 * Fully qualified contract function targets for Move calls
 * Used to construct transaction blocks for smart contract interactions
 */
export const CONTRACT_FUNCTIONS = {
  /** Function to mint a new NFT: mint(name: String, description: String, image_url: String, ctx: &mut TxContext) */
  MINT: `${PACKAGE_ID}::${MODULE_NAME}::mint`,
  /** Function to level up an existing NFT: level_up(nft: &mut Nft) */
  LEVEL_UP: `${PACKAGE_ID}::${MODULE_NAME}::level_up`,
} as const;

// ============================================================================
// APPLICATION CONFIGURATION
// ============================================================================

/**
 * The display name of the application
 */
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Sui NFT DApp';

// ============================================================================
// UI CONSTANTS
// ============================================================================

/**
 * Number of NFTs to display per page in the grid view
 */
export const ITEMS_PER_PAGE = 12;

/**
 * Maximum file size for image uploads (5MB in bytes)
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Supported image MIME types for NFT images
 */
export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// ============================================================================
// TRANSACTION CONFIGURATION
// ============================================================================

/**
 * Gas budget for complex transactions (0.1 SUI in MIST)
 * 1 SUI = 1,000,000,000 MIST
 */
export const GAS_BUDGET = 100000000;

/**
 * Default gas budget for simple transactions (0.005 SUI in MIST)
 */
export const DEFAULT_GAS_BUDGET = 5000000;

// ============================================================================
// SUI BLOCKCHAIN TYPES
// ============================================================================

/**
 * The type identifier for native SUI coins
 */
export const SUI_COIN_TYPE = '0x2::sui::SUI';

// ============================================================================
// NFT METADATA FIELDS
// ============================================================================

/**
 * Standard field names for NFT display metadata
 * These correspond to the fields in the smart contract's NFT structure
 */
export const NFT_DISPLAY_FIELDS = {
  /** The name/title of the NFT */
  NAME: 'name',
  /** The description text of the NFT */
  DESCRIPTION: 'description',
  /** The URL of the NFT's image */
  IMAGE_URL: 'image_url', 
  /** The current level of the NFT (for level-up functionality) */
  LEVEL: 'level',
} as const; 