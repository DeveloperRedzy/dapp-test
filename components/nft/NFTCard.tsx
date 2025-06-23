/**
 * @fileoverview NFT Card Component
 * 
 * This component provides a beautiful, responsive card display for individual NFTs
 * with image, metadata, level indicators, and interactive functionality.
 * 
 * @author Rijad Kuloglija
 * @version 1.0.0
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SimpleNFT } from '@/types/sui';
import { TrendingUp, ExternalLink, ImageIcon, AlertCircle, Copy } from 'lucide-react';
import { toast } from 'sonner';

// ============================================================================
// NFT CARD COMPONENT
// ============================================================================

/**
 * Props for the NFT Card component
 */
interface NFTCardProps {
  /** NFT object containing metadata and properties */
  nft: SimpleNFT;
  /** Optional callback when level up is initiated */
  onLevelUp?: (nftId: string) => void;
  /** Whether level up action is currently loading */
  isLevelingUp?: boolean;
  /** Optional custom styling classes */
  className?: string;
}

/**
 * NFT Card Component
 * 
 * This component displays a single NFT in a beautiful card format with:
 * - High-quality image display with fallback handling
 * - NFT metadata (name, description, level)
 * - Level indicator badge with color coding
 * - Level up functionality (when available)
 * - Copy NFT ID functionality
 * - Responsive design and hover effects
 * 
 * The card automatically handles:
 * - Image loading states and error fallbacks
 * - Long text truncation with tooltips
 * - Level-based color theming
 * - Interactive hover animations
 * 
 * @param props - Component props
 * @returns JSX element containing the NFT card
 * 
 * @example
 * ```tsx
 * function NFTGallery({ nfts }: { nfts: SimpleNFT[] }) {
 *   const handleLevelUp = (nftId: string) => {
 *     // Level up logic
 *   };
 * 
 *   return (
 *     <div className="grid gap-4">
 *       {nfts.map(nft => (
 *         <NFTCard 
 *           key={nft.id.id}
 *           nft={nft} 
 *           onLevelUp={handleLevelUp}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function NFTCard({ nft, onLevelUp, isLevelingUp = false, className = '' }: NFTCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  /**
   * Get level-based color styling for the NFT level badge
   * 
   * @param level - NFT level number
   * @returns Tailwind CSS classes for badge styling
   */
  const getLevelColor = (level: number) => {
    if (level >= 10) return 'bg-purple-600 text-white border-purple-700';
    if (level >= 5) return 'bg-blue-600 text-white border-blue-700';
    if (level >= 3) return 'bg-green-600 text-white border-green-700';
    return 'bg-gray-600 text-white border-gray-700';
  };

  /**
   * Copy NFT ID to clipboard
   */
  const copyNFTId = async () => {
    try {
      await navigator.clipboard.writeText(nft.id.id);
      toast.success('NFT ID copied to clipboard');
    } catch {
      toast.error('Failed to copy NFT ID');
    }
  };

  /**
   * Handle level up button click
   */
  const handleLevelUp = () => {
    if (onLevelUp && !isLevelingUp) {
      onLevelUp(nft.id.id);
    }
  };

  /**
   * Format NFT ID for display (first 8 and last 8 characters)
   */
  const formatNFTId = (id: string) => {
    return `${id.slice(0, 8)}...${id.slice(-8)}`;
  };

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 group ${className}`}>
      {/* NFT Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {!imageError ? (
          <>
            <img
              src={nft.image_url}
              alt={nft.name}
              className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon className="h-12 w-12 text-muted-foreground animate-pulse" />
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
            <AlertCircle className="h-12 w-12 mb-2" />
            <p className="text-sm text-center px-4">Image failed to load</p>
          </div>
        )}
        
        {/* Level Badge Overlay */}
        <div className="absolute top-3 right-3">
          <Badge className={getLevelColor(nft.level)}>
            Level {nft.level}
          </Badge>
        </div>
      </div>

      {/* NFT Metadata */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate" title={nft.name}>
              {nft.name}
            </CardTitle>
            <CardDescription className="mt-1">
              NFT #{formatNFTId(nft.id.id)}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyNFTId}
            className="ml-2 flex-shrink-0"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <div>
          <p className="text-sm text-muted-foreground line-clamp-3" title={nft.description}>
            {nft.description}
          </p>
        </div>

        <Separator />

        {/* Stats and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Current Level:</span>
            <Badge variant="outline" className={getLevelColor(nft.level)}>
              {nft.level}
            </Badge>
          </div>
          
          {onLevelUp && (
            <Button
              size="sm"
              onClick={handleLevelUp}
              disabled={isLevelingUp}
              className="ml-2"
            >
              {isLevelingUp ? (
                <>
                  <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-current border-r-transparent" />
                  Leveling...
                </>
              ) : (
                <>
                  <TrendingUp className="mr-2 h-3 w-3" />
                  Level Up
                </>
              )}
            </Button>
          )}
        </div>

        {/* View on Explorer Link */}
        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              const explorerUrl = `https://suiscan.xyz/testnet/object/${nft.id.id}`;
              window.open(explorerUrl, '_blank');
            }}
          >
            <ExternalLink className="mr-2 h-3 w-3" />
            View on Explorer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 