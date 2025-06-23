/**
 * @fileoverview Enhanced Wallet Connection Component
 * 
 * This component provides a sleek, modern wallet interface optimized for
 * header integration. Features include compact design, smooth animations,
 * and improved user experience with better visual feedback.
 * 
 * @author Rijad Kuloglija
 * @version 2.0.0 - Phase 8 UI Polish
 */

'use client';

import { 
  ConnectButton, 
  useCurrentAccount, 
  useDisconnectWallet,
  useSuiClientQuery 
} from '@mysten/dapp-kit';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SUI_COIN_TYPE } from '@/lib/constants';
import { formatSuiAmount } from '@/lib/transactionUtils';
import { formatSUI } from '@/lib/utils';
import { 
  Wallet, 
  Copy, 
  LogOut, 
  Loader2, 
  User,
  ExternalLink,
  ChevronDown,
  Coins
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

// ============================================================================
// ENHANCED WALLET CONNECTION COMPONENT
// ============================================================================

/**
 * Enhanced wallet connection and management component
 * 
 * This modernized component provides:
 * - Compact header-optimized design
 * - Dropdown menu for wallet actions
 * - Real-time balance display
 * - Smooth animations and transitions
 * - Better visual hierarchy
 * - Improved accessibility
 * 
 * The component automatically adapts to different screen sizes
 * and provides intuitive wallet management functionality.
 * 
 * @returns JSX element containing the enhanced wallet interface
 */
export function WalletConnect() {
  const currentAccount = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  // Fetch SUI balance for connected account
  const { data: balance, isLoading: balanceLoading, error: balanceError } = useSuiClientQuery(
    'getBalance',
    {
      owner: currentAccount?.address ?? '',
      coinType: SUI_COIN_TYPE,
    },
    {
      enabled: !!currentAccount?.address,
      refetchInterval: 10000, // Refresh every 10 seconds
    }
  );

  /**
   * Copy wallet address to clipboard
   */
  const copyAddress = async () => {
    if (!currentAccount?.address) return;
    
    try {
      await navigator.clipboard.writeText(currentAccount.address);
      toast.success('Address copied to clipboard');
    } catch {
      toast.error('Failed to copy address');
    }
  };

  /**
   * Handle wallet disconnection
   */
  const handleDisconnect = () => {
    setIsDisconnecting(true);
    disconnect();
    setTimeout(() => setIsDisconnecting(false), 1000);
    toast.success('Wallet disconnected');
  };

  /**
   * Format address for display (show first 4 and last 4 characters)
   */
  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  /**
   * Open wallet in Sui Explorer
   */
  const openInExplorer = () => {
    if (!currentAccount?.address) return;
    const explorerUrl = `https://suiscan.xyz/testnet/account/${currentAccount.address}`;
    window.open(explorerUrl, '_blank');
  };

  // Show connection button if no wallet is connected
  if (!currentAccount) {
    return (
      <ConnectButton
        connectText="Connect Wallet"
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-6"
      />
    );
  }

  // Show compact wallet info when connected
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center space-x-3 bg-background/50 hover:bg-background/80 border-border/50 shadow-sm hover:shadow-md transition-all duration-300 px-4 py-2"
        >
          <Avatar className="h-6 w-6">
            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-xs">
              <Wallet className="h-3 w-3" />
            </AvatarFallback>
          </Avatar>
          
          <div className="hidden sm:flex flex-col items-start min-w-0">
            <span className="text-sm font-medium truncate max-w-[100px]">
              {formatAddress(currentAccount.address)}
            </span>
            <div className="flex items-center space-x-1">
              {balanceLoading ? (
                <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
              ) : (
                <Coins className="h-3 w-3 text-blue-600" />
              )}
              <span className="text-xs text-muted-foreground font-mono">
                {balanceLoading 
                  ? '...' 
                  : balance 
                    ? formatSUI(formatSuiAmount(balance.totalBalance))
                    : '0'
                } SUI
              </span>
            </div>
          </div>
          
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-2 bg-background/95 backdrop-blur border-border/50">
        {/* Header */}
        <DropdownMenuLabel className="p-4 pb-2">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">Wallet Connected</p>
              <p className="text-xs text-muted-foreground truncate">
                {currentAccount.address}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Balance Section */}
        <div className="p-4 bg-muted/50 rounded-lg m-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Coins className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Balance</span>
            </div>
            {balanceLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading...</span>
              </div>
            ) : balanceError ? (
              <Badge variant="destructive" className="text-xs">
                Error
              </Badge>
            ) : (
              <div className="text-right">
                <p className="text-lg font-bold font-mono">
                  {balance ? formatSUI(formatSuiAmount(balance.totalBalance)) : '0'}
                </p>
                <p className="text-xs text-muted-foreground">SUI</p>
              </div>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Actions */}
        <DropdownMenuItem 
          onClick={copyAddress}
          className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-muted/50 rounded-lg m-1"
        >
          <Copy className="h-4 w-4" />
          <span className="text-sm">Copy Address</span>
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={openInExplorer}
          className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-muted/50 rounded-lg m-1"
        >
          <ExternalLink className="h-4 w-4" />
          <span className="text-sm">View in Explorer</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Network Status */}
        <div className="p-3 m-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-muted-foreground">Network</span>
            </div>
            <Badge variant="outline" className="text-xs bg-green-50 border-green-200 text-green-700">
              Sui Testnet
            </Badge>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Disconnect */}
        <DropdownMenuItem 
          onClick={handleDisconnect}
          disabled={isDisconnecting}
          className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-red-50 rounded-lg m-1 text-red-600 hover:text-red-700"
        >
          {isDisconnecting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
          <span className="text-sm">
            {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 