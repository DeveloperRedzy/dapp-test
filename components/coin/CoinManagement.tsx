/**
 * @fileoverview Comprehensive Coin Management Component
 * 
 * This component provides a complete interface for managing SUI coins including
 * viewing all coins, split history, merging coins, and coin analytics.
 * 
 * @author Rijad Kuloglija
 * @version 1.0.0
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSuiClientQuery } from '@mysten/dapp-kit';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { SUI_COIN_TYPE } from '@/lib/constants';
import { formatSUI } from '@/lib/utils';
import { 
  Coins, 
  TrendingUp, 
  ArrowUpDown, 
  Copy, 
  Merge, 
  History,
  PieChart,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

// ============================================================================
// COIN MANAGEMENT COMPONENT
// ============================================================================

/**
 * Comprehensive Coin Management Component
 * 
 * Features:
 * - Display all SUI coins owned by the user
 * - Show coin distribution and analytics
 * - Provide merge functionality for multiple coins
 * - Transaction history for splits and merges
 * - Quick actions for common operations
 * 
 * @returns JSX element containing the coin management interface
 */
export function CoinManagement() {
  const currentAccount = useCurrentAccount();
  const [selectedCoins, setSelectedCoins] = useState<string[]>([]);

  // Fetch user's SUI coins
  const { data: coins, isLoading, error, refetch } = useSuiClientQuery(
    'getCoins',
    {
      owner: currentAccount?.address ?? '',
      coinType: SUI_COIN_TYPE,
    },
    {
      enabled: !!currentAccount?.address,
      refetchInterval: 30000, // Refresh every 30 seconds
    }
  );

  // Calculate analytics
  const totalBalance = coins?.data.reduce((sum, coin) => sum + parseInt(coin.balance), 0) || 0;
  const totalCoins = coins?.data.length || 0;
  const largestCoin = coins?.data.reduce((largest, coin) => 
    parseInt(coin.balance) > parseInt(largest?.balance || '0') ? coin : largest, 
    coins?.data[0]
  );
  const smallestCoin = coins?.data.reduce((smallest, coin) => 
    parseInt(coin.balance) < parseInt(smallest?.balance || '999999999999999') ? coin : smallest, 
    coins?.data[0]
  );

  /**
   * Handle coin selection for bulk operations
   */
  const toggleCoinSelection = (coinId: string) => {
    setSelectedCoins(prev => 
      prev.includes(coinId) 
        ? prev.filter(id => id !== coinId)
        : [...prev, coinId]
    );
  };

  /**
   * Copy coin object ID to clipboard
   */
  const copyCoinId = (coinId: string) => {
    navigator.clipboard.writeText(coinId);
    toast.success('Coin ID copied to clipboard');
  };

  /**
   * Open transaction on Sui Explorer
   */
  const openInExplorer = (objectId: string) => {
    const explorerUrl = `https://suivision.xyz/object/${objectId}`;
    window.open(explorerUrl, '_blank');
  };

  if (!currentAccount) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            Please connect your wallet to view coin management
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="pt-6">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 dark:bg-red-950">
        <CardContent className="pt-6">
          <div className="text-red-600 dark:text-red-400">
            Error loading coins: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Coin Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Coins className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total Balance</p>
                <p className="text-2xl font-bold">{formatSUI(totalBalance.toString())} SUI</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Coin Objects</p>
                <p className="text-2xl font-bold">{totalCoins}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Largest Coin</p>
                <p className="text-xl font-bold">
                  {largestCoin ? formatSUI(largestCoin.balance) : '0'} SUI
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <ArrowUpDown className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Smallest Coin</p>
                <p className="text-xl font-bold">
                  {smallestCoin ? formatSUI(smallestCoin.balance) : '0'} SUI
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coin List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Coins className="h-5 w-5" />
                <span>Your SUI Coins</span>
              </CardTitle>
              <CardDescription>
                Manage your individual SUI coin objects
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              {selectedCoins.length > 1 && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    // TODO: Implement merge functionality
                    toast.info('Coin merging feature coming soon!');
                  }}
                >
                  <Merge className="h-4 w-4 mr-1" />
                  Merge Selected ({selectedCoins.length})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {coins?.data && coins.data.length > 0 ? (
            <div className="space-y-3">
              {coins.data
                .sort((a, b) => parseInt(b.balance) - parseInt(a.balance)) // Sort by balance descending
                .map((coin, index) => (
                <div key={coin.coinObjectId} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedCoins.includes(coin.coinObjectId)}
                        onChange={() => toggleCoinSelection(coin.coinObjectId)}
                        className="rounded"
                      />
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                    </div>
                    <div>
                      <p className="font-mono font-medium">
                        {formatSUI(coin.balance)} SUI
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {coin.coinObjectId.slice(0, 8)}...{coin.coinObjectId.slice(-6)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyCoinId(coin.coinObjectId)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openInExplorer(coin.coinObjectId)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Coins className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No SUI coins found</p>
              <p className="text-sm">Try requesting coins from the faucet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="h-5 w-5" />
            <span>Quick Actions</span>
          </CardTitle>
          <CardDescription>
            Common operations for managing your coins
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="flex flex-col items-center space-y-2 h-auto py-4"
              onClick={() => {
                // This would switch to the split tab
                toast.info('Switch to the Split tab to split coins');
              }}
            >
              <ArrowUpDown className="h-6 w-6" />
              <div className="text-center">
                <p className="font-medium">Split Coins</p>
                <p className="text-xs text-muted-foreground">Create smaller denominations</p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="flex flex-col items-center space-y-2 h-auto py-4"
              onClick={() => {
                toast.info('Select multiple coins to merge them');
              }}
            >
              <Merge className="h-6 w-6" />
              <div className="text-center">
                <p className="font-medium">Merge Coins</p>
                <p className="text-xs text-muted-foreground">Combine multiple coins</p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="flex flex-col items-center space-y-2 h-auto py-4"
              onClick={() => {
                toast.info('Transaction history feature coming soon!');
              }}
            >
              <History className="h-6 w-6" />
              <div className="text-center">
                <p className="font-medium">View History</p>
                <p className="text-xs text-muted-foreground">See past transactions</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Coin Distribution Info */}
      {coins?.data && coins.data.length > 1 && (
        <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/10">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <PieChart className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-medium text-blue-800 dark:text-blue-200">
                  Coin Distribution Analysis
                </h4>
                <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <p>• You have {totalCoins} separate coin objects</p>
                  <p>• Average coin size: {formatSUI((totalBalance / totalCoins).toString())} SUI</p>
                  {totalCoins > 5 && (
                    <p>• Consider merging smaller coins to reduce transaction complexity</p>
                  )}
                  {totalCoins === 1 && (
                    <p>• You have one coin - consider splitting for better transaction management</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 