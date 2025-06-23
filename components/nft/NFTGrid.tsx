/**
 * @fileoverview NFT Grid Component
 * 
 * This component provides a responsive grid layout for displaying multiple NFT cards
 * with loading states, empty states, and comprehensive error handling.
 * 
 * @author Rijad Kuloglija
 * @version 1.0.0
 */

'use client';

import { NFTCard } from './NFTCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SimpleNFT } from '@/types/sui';
import { Palette, RefreshCw, AlertCircle, Loader2, Sparkles } from 'lucide-react';

// ============================================================================
// NFT GRID COMPONENT
// ============================================================================

/**
 * Props for the NFT Grid component
 */
interface NFTGridProps {
  /** Array of NFTs to display */
  nfts: SimpleNFT[];
  /** Whether NFT data is currently loading */
  isLoading: boolean;
  /** Current error message, if any */
  error: string | null;
  /** Function to refetch NFT data */
  onRefresh?: () => void;
  /** Optional callback when level up is initiated */
  onLevelUp?: (nftId: string) => void;
  /** ID of NFT currently being leveled up */
  levelingUpNFTId?: string;
  /** Optional custom styling classes */
  className?: string;
}

/**
 * NFT Grid Component
 * 
 * This component provides a responsive grid layout for displaying NFT collections.
 */
export function NFTGrid({ 
  nfts, 
  isLoading, 
  error, 
  onRefresh, 
  onLevelUp, 
  levelingUpNFTId,
  className = '' 
}: NFTGridProps) {

  // Loading State
  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Your NFT Collection</h3>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading NFTs...</span>
          </div>
        </div>
        
        {/* Enhanced Loading Skeleton Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="aspect-square relative">
                <Skeleton className="absolute inset-0" />
                <div className="absolute top-3 right-3">
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
              <CardHeader className="space-y-3">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                  <Skeleton className="h-3 w-3/5" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-9 w-24" />
                </div>
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-red-800 dark:text-red-200">
              Failed to Load NFTs
            </CardTitle>
            <CardDescription className="text-red-600 dark:text-red-400">
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            {onRefresh && (
              <Button
                onClick={onRefresh}
                variant="outline"
                className="border-red-200 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Empty State
  if (!nfts || nfts.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Your NFT Collection</h3>
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          )}
        </div>
        
        <Card className="border-dashed relative overflow-hidden">
          <div className="absolute top-4 right-4">
            <Sparkles className="h-6 w-6 text-blue-400 animate-pulse" />
          </div>
          <CardHeader className="text-center py-12">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 shadow-lg">
              <Palette className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              No NFTs Found
            </CardTitle>
            <CardDescription className="max-w-md mx-auto mt-2">
              You don&apos;t have any NFTs yet. Try minting your first NFT using the &quot;Mint NFT&quot; tab above!
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // NFT Grid with Data
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Your NFT Collection</h3>
          <p className="text-muted-foreground text-sm">
            {nfts.length} NFT{nfts.length === 1 ? '' : 's'} in your collection
          </p>
        </div>
        {onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        )}
      </div>

      {/* Responsive NFT Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {nfts.map((nft) => (
          <NFTCard
            key={nft.id.id}
            nft={nft}
            onLevelUp={onLevelUp}
            isLevelingUp={levelingUpNFTId === nft.id.id}
          />
        ))}
      </div>

      {/* Collection Stats */}
      <Card className="bg-muted/50">
        <CardContent className="py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {nfts.length}
              </p>
              <p className="text-sm text-muted-foreground">Total NFTs</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {Math.max(...nfts.map(nft => nft.level), 0)}
              </p>
              <p className="text-sm text-muted-foreground">Highest Level</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {Math.round(nfts.reduce((sum, nft) => sum + nft.level, 0) / nfts.length) || 0}
              </p>
              <p className="text-sm text-muted-foreground">Average Level</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {nfts.filter(nft => nft.level >= 5).length}
              </p>
              <p className="text-sm text-muted-foreground">Level 5+</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 