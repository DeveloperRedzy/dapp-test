/**
 * @fileoverview Sui DApp Provider Configuration
 * 
 * This file provides the root provider component that wraps the entire application
 * with necessary Sui blockchain and React Query providers. It configures wallet
 * connections, network settings, caching, and toast notifications.
 * 
 * @author Rijad Kuloglija
 * @version 1.0.0
 */

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { networkConfig, defaultNetwork } from '@/lib/suiClient';
import { ReactNode, useState } from 'react';
import { Toaster } from '@/components/ui/sonner';

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

/**
 * Props for the SuiProvider component
 */
interface SuiProviderProps {
  /** React children to wrap with Sui providers */
  children: ReactNode;
}

/**
 * Root provider component for the Sui DApp
 * 
 * This component sets up the complete provider tree required for a Sui DApp:
 * - QueryClient for React Query state management and caching
 * - SuiClientProvider for blockchain network connections  
 * - WalletProvider for wallet integration and management
 * - Toast notifications for user feedback
 * 
 * The provider is configured with optimized defaults for performance:
 * - 5-minute stale time for queries to reduce network requests
 * - 1-hour garbage collection time for cached data
 * - Automatic retry logic for failed requests
 * - Auto-connect wallet functionality
 * 
 * @param props - Component props containing children to wrap
 * @returns The wrapped application with all necessary providers
 * 
 * @example
 * ```tsx
 * // In your root layout or app component:
 * function RootLayout({ children }: { children: ReactNode }) {
 *   return (
 *     <SuiProvider>
 *       <MyApp />
 *     </SuiProvider>
 *   );
 * }
 * ```
 */
export function SuiProvider({ children }: SuiProviderProps) {
  // Create a stable QueryClient instance with optimized configuration
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Cache queries for 5 minutes before considering them stale
            staleTime: 1000 * 60 * 5,
            // Keep unused data in cache for 1 hour before garbage collection  
            gcTime: 1000 * 60 * 60,
            // Retry failed queries up to 3 times with exponential backoff
            retry: 3,
            // Don't automatically refetch when user returns to tab
            refetchOnWindowFocus: false,
          },
          mutations: {
            // Retry failed mutations once before giving up
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {/* Sui blockchain client provider with network configuration */}
      <SuiClientProvider networks={networkConfig} defaultNetwork={defaultNetwork}>
        {/* Wallet provider with automatic connection attempt */}
        <WalletProvider autoConnect>
          {children}
          {/* Toast notification system for user feedback */}
          <Toaster position="top-right" expand={false} richColors />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
} 