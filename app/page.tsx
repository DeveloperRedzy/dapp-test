/**
 * @fileoverview Main Application Page
 * 
 * This is the primary landing page for the Sui NFT DApp, showcasing
 * wallet integration and providing access to core DApp functionality.
 * 
 * @author Rijad Kuloglija
 * @version 1.0.0
 */

'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MintForm } from '@/components/nft/MintForm';
import { NFTGrid } from '@/components/nft/NFTGrid';
import { CoinSplitForm } from '@/components/coin/CoinSplitForm';
import { CoinManagement } from '@/components/coin/CoinManagement';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useNFTs } from '@/hooks/useNFTs';
import { useLevelUp } from '@/hooks/useLevelUp';
import { Palette, TrendingUp, Coins } from 'lucide-react';

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

/**
 * Main application page component
 * 
 * This component serves as the primary interface for the Sui NFT DApp,
 * providing access to all major functionality:
 * - Wallet connection and management
 * - NFT minting and management (coming soon)
 * - Level up functionality (coming soon)
 * - Coin splitting functionality (coming soon)
 * 
 * The page adapts based on wallet connection status and provides
 * appropriate guidance for users at each step.
 * 
 * @returns JSX element containing the main page interface
 */
export default function Home() {
  const currentAccount = useCurrentAccount();
  const { nfts, isLoading: isLoadingNFTs, error: nftError, refetch: refetchNFTs } = useNFTs();
  const { levelUp } = useLevelUp();
  const [levelingUpNFTId, setLevelingUpNFTId] = useState<string | undefined>();

  /**
   * Handle NFT level up action
   */
  const handleLevelUp = async (nftId: string) => {
    try {
      setLevelingUpNFTId(nftId);
      const result = await levelUp(nftId);
      if (result.success) {
        // Refresh NFT data to show updated level after a brief delay
        // This allows the blockchain to process and index the level update
        setTimeout(() => {
          refetchNFTs();
        }, 2000); // 2 second delay to ensure transaction is processed
      }
    } catch (error) {
      console.error('Level up failed:', error);
    } finally {
      setLevelingUpNFTId(undefined);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      {/* Header with Wallet Connection */}
      <Header />

              {/* Main Content */}
        <main className="relative container mx-auto px-4 py-8">
        {currentAccount ? (
          // Connected State - Show DApp Functionality
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">Welcome to Sui NFT DApp</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Your wallet is connected! Explore NFT minting, level up your collection, 
                and manage your SUI coins on the Sui testnet.
              </p>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Phase 8: UI/UX Polish Complete ✅
              </Badge>
            </div>

            {/* Feature Tabs */}
            <Tabs defaultValue="nfts" className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:w-[500px] mx-auto">
                <TabsTrigger value="nfts">NFT Gallery</TabsTrigger>
                <TabsTrigger value="mint">Mint NFT</TabsTrigger>
                <TabsTrigger value="split">Split Coins</TabsTrigger>
                <TabsTrigger value="manage">Manage Coins</TabsTrigger>
              </TabsList>

              <TabsContent value="nfts" className="space-y-4">
                <NFTGrid
                  nfts={nfts}
                  isLoading={isLoadingNFTs}
                  error={nftError}
                  onRefresh={refetchNFTs}
                  onLevelUp={handleLevelUp}
                  levelingUpNFTId={levelingUpNFTId}
                />
              </TabsContent>

              <TabsContent value="mint" className="space-y-4">
                <MintForm onMintSuccess={refetchNFTs} />
              </TabsContent>

              <TabsContent value="split" className="space-y-4">
                <CoinSplitForm />
              </TabsContent>

              <TabsContent value="manage" className="space-y-4">
                <CoinManagement />
              </TabsContent>
            </Tabs>

            {/* Feature Overview */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Palette className="h-5 w-5 text-blue-600" />
                    <span>NFT Minting</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Create unique NFTs with custom metadata and images
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span>Level Up NFTs</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Enhance your NFTs by leveling them up using smart contracts
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Coins className="h-5 w-5 text-blue-600" />
                    <span>Coin Splitting</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Split your SUI coins for better transaction management
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          // Disconnected State - Prompt for Connection
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-6">
              <h2 className="text-4xl font-bold">
                Build on Sui with NFTs
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Experience the power of Sui blockchain through our NFT DApp. 
                Mint unique tokens, level them up, and manage your digital assets.
              </p>
              <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                Sui Testnet • Wallet Required
              </Badge>
            </div>

            {/* Features Preview */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-blue-200 bg-blue-50/50">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Palette className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Mint NFTs</CardTitle>
                  <CardDescription>
                    Create unique digital assets on Sui with custom metadata
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-green-200 bg-green-50/50">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Level Up</CardTitle>
                  <CardDescription>
                    Enhance your NFTs through smart contract interactions
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-yellow-200 bg-yellow-50/50">
                <CardHeader>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                    <Coins className="h-6 w-6 text-yellow-600" />
                  </div>
                  <CardTitle>Split Coins</CardTitle>
                  <CardDescription>
                    Manage your SUI coins with precision and flexibility
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="text-center">
              <p className="text-lg text-muted-foreground">
                👆 Connect your wallet above to get started
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
