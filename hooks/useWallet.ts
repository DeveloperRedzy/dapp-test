/**
 * @fileoverview Wallet Connection Hook for Sui DApp
 * 
 * This file provides a custom React hook for managing wallet connections,
 * including account information, balance tracking, and connection controls.
 * It integrates with the Sui dApp Kit and provides real-time balance updates.
 * 
 * @author Rijad Kuloglija
 * @version 1.0.0
 */

'use client';

import { useCurrentAccount, useDisconnectWallet } from '@mysten/dapp-kit';
import { useSuiClientQuery } from '@mysten/dapp-kit';
import { SUI_COIN_TYPE } from '@/lib/constants';
import { formatSuiAmount } from '@/lib/transactionUtils';
import { WalletState } from '@/types/sui';
import { useMemo } from 'react';

// ============================================================================
// WALLET MANAGEMENT HOOK
// ============================================================================

/**
 * Custom hook for managing wallet connections and state
 * 
 * This hook provides a complete wallet management solution including:
 * - Current account information and connection status
 * - Real-time SUI balance tracking with automatic refresh
 * - Connect and disconnect functionality
 * - Formatted balance display
 * - Loading and error states
 * 
 * The hook automatically:
 * - Fetches balance when an account is connected
 * - Refreshes balance every 10 seconds to stay current
 * - Formats balance from MIST to human-readable SUI amounts
 * - Handles connection and disconnection states
 * 
 * @returns Object containing wallet state and control functions
 * 
 * @example
 * ```tsx
 * function WalletButton() {
 *   const { isConnected, address, balance, connect, disconnect, isLoading } = useWallet();
 * 
 *   if (isConnected) {
 *     return (
 *       <div>
 *         <p>Address: {address}</p>
 *         <p>Balance: {balance} SUI</p>
 *         <button onClick={disconnect}>Disconnect</button>
 *       </div>
 *     );
 *   }
 * 
 *   return <button onClick={connect}>Connect Wallet</button>;
 * }
 * ```
 */
export function useWallet(): WalletState & {
  /** Function to initiate wallet connection */
  connect: () => void;
  /** Function to disconnect the current wallet */
  disconnect: () => void;
} {
  // Get the currently connected account from dApp Kit
  const currentAccount = useCurrentAccount();
  const { mutate: disconnectWallet } = useDisconnectWallet();

  // Fetch SUI balance for the connected account with real-time updates
  const { data: balance, isLoading: balanceLoading } = useSuiClientQuery(
    'getBalance',
    {
      owner: currentAccount?.address ?? '',
      coinType: SUI_COIN_TYPE,
    },
    {
      // Only fetch balance when we have a connected account
      enabled: !!currentAccount?.address,
      // Refresh balance every 10 seconds to show current state
      refetchInterval: 10000,
    }
  );

  // Memoized wallet state to prevent unnecessary re-renders
  const walletState = useMemo((): WalletState => {
    return {
      isConnected: !!currentAccount,
      address: currentAccount?.address ?? null,
      // Format balance from MIST to human-readable SUI amount
      balance: balance ? formatSuiAmount(balance.totalBalance) : null,
      isLoading: balanceLoading,
      error: null,
    };
  }, [currentAccount, balance, balanceLoading]);

  /**
   * Connect to a wallet
   * TODO: Implement proper wallet connection flow using dApp Kit
   * Currently using temporary page reload
   */
  const connect = () => {
    // This will be replaced with proper wallet connection modal
    // using the dApp Kit ConnectButton or programmatic connection
    window.location.reload();
  };

  /**
   * Disconnect the current wallet
   */
  const disconnect = () => {
    disconnectWallet();
  };

  return {
    ...walletState,
    connect,
    disconnect,
  };
} 