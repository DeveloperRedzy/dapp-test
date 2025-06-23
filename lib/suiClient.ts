/**
 * @fileoverview Sui Network Client Configuration
 * 
 * This file configures the network connections for the Sui DApp using the modern
 * dApp Kit architecture. It provides network configuration objects and utility
 * functions for connecting to different Sui networks (testnet, mainnet, devnet, localnet).
 * 
 * @author Rijad Kuloglija
 * @version 1.0.0
 */

import { createNetworkConfig } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { SUI_NETWORK } from './constants';

// ============================================================================
// NETWORK CONFIGURATION
// ============================================================================

/**
 * Network configuration object for the dApp Kit providers
 * 
 * This configuration is used by SuiClientProvider to enable multi-network support.
 * It includes all major Sui networks with their respective RPC endpoints.
 * 
 * @example
 * ```tsx
 * <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
 *   <App />
 * </SuiClientProvider>
 * ```
 */
export const { networkConfig, useNetworkVariable } = createNetworkConfig({
  /** Sui development network - for early testing and development */
  devnet: { url: getFullnodeUrl('devnet') },
  /** Sui testnet - stable testing environment with test SUI */
  testnet: { url: getFullnodeUrl('testnet') },
  /** Sui mainnet - production network with real SUI */
  mainnet: { url: getFullnodeUrl('mainnet') },
  /** Local Sui network - for local development and testing */
  localnet: { url: getFullnodeUrl('localnet') },
});

/**
 * The default network to connect to based on environment configuration
 * This is used as the initial network when the DApp starts
 */
export const defaultNetwork = SUI_NETWORK;

// ============================================================================
// UTILITY CONFIGURATIONS
// ============================================================================

/**
 * Direct network URLs mapping for cases where direct client instantiation is needed
 * 
 * These URLs can be used to create SuiClient instances directly without dApp Kit,
 * useful for server-side operations or advanced client configurations.
 * 
 * @example
 * ```ts
 * import { SuiClient } from '@mysten/sui/client';
 * const client = new SuiClient({ url: NETWORK_URLS.testnet });
 * ```
 */
export const NETWORK_URLS = {
  /** Sui devnet RPC endpoint */
  devnet: getFullnodeUrl('devnet'),
  /** Sui testnet RPC endpoint */
  testnet: getFullnodeUrl('testnet'),
  /** Sui mainnet RPC endpoint */
  mainnet: getFullnodeUrl('mainnet'),
  /** Local Sui network RPC endpoint */
  localnet: getFullnodeUrl('localnet'),
};

/**
 * Get the current network URL based on the configured SUI_NETWORK
 * 
 * @returns The RPC URL for the currently configured network
 * 
 * @example
 * ```ts
 * const url = getCurrentNetworkUrl();
 * console.log(`Connecting to: ${url}`);
 * ```
 */
export const getCurrentNetworkUrl = () => NETWORK_URLS[SUI_NETWORK]; 