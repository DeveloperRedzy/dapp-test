/**
 * @fileoverview Enhanced Application Header Component
 *
 * This component provides a modern, polished application header with glassmorphism
 * design, improved navigation, and seamless wallet integration. Features include
 * gradient backgrounds, smooth animations, and responsive design.
 *
 * @author Rijad Kuloglija
 * @version 2.0.0 - Phase 8 UI Polish
 */

"use client";

import { WalletConnect } from "@/components/wallet/WalletConnect";
import { Badge } from "@/components/ui/badge";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useWallet } from "@/hooks/useWallet";
import { formatSUI } from "@/lib/utils";
import { Palette, Coins, Sparkles } from "lucide-react";

// ============================================================================
// ENHANCED HEADER COMPONENT
// ============================================================================

/**
 * Modern application header component with glassmorphism design
 *
 * This enhanced header provides:
 * - Glassmorphism design with backdrop blur effects
 * - Gradient branding with animated elements
 * - Integrated wallet connection with balance display
 * - Responsive mobile navigation
 * - Network status indicator
 * - Quick access navigation links
 * - Smooth animations and hover effects
 *
 * The header adapts seamlessly between desktop and mobile layouts,
 * providing an optimal user experience across all device sizes.
 *
 * @returns JSX element containing the enhanced application header
 */
export function Header() {
  const currentAccount = useCurrentAccount();
  const { balance } = useWallet();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Gradient overlay for visual depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5"></div>

      <div className="container relative mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Brand Section */}
          <div className="flex items-center space-x-3 lg:space-x-6">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-2 lg:space-x-3 group">
              <div className="relative">
                {/* Animated logo background */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-sm group-hover:blur-none transition-all duration-300"></div>
                <div className="relative flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Palette className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                  <Sparkles className="h-2 w-2 lg:h-3 lg:w-3 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
                </div>
              </div>

              <div className="block">
                <h1 className="text-sm lg:text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent hidden sm:block">
                  Sui NFT DApp
                </h1>
                <p className="text-xs text-muted-foreground font-medium hidden sm:block">
                  Next-Gen NFT Experience
                </p>
              </div>
            </div>
          </div>

          {/* Center: Network Status */}
          {currentAccount && (
            <div className="flex items-center space-x-2 lg:space-x-3">
              <Badge
                variant="outline"
                className="bg-green-50 border-green-200 text-green-700 dark:bg-green-950/20 dark:border-green-800 dark:text-green-400 text-xs"
              >
                <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-green-500 rounded-full mr-1 lg:mr-2 animate-pulse"></div>
                <span className="hidden sm:inline">Sui </span>Testnet
              </Badge>

              {balance && (
                <div className="flex items-center space-x-1 lg:space-x-2 bg-muted/50 rounded-full px-2 lg:px-3 py-1 lg:py-1.5">
                  <Coins className="h-3 w-3 lg:h-4 lg:w-4 text-blue-600" />
                  <span className="text-xs lg:text-sm font-medium font-mono">
                    {formatSUI(balance)} SUI
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Right: Quick Actions & Wallet Connection */}
          <div className="flex items-center space-x-1 lg:space-x-3">
            {/* Wallet Connection */}
            <div className="block">
              <WalletConnect />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
