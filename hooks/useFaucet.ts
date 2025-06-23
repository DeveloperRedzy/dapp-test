/**
 * @fileoverview Faucet Hook for Testnet SUI Requests
 *
 * This hook provides functionality to request testnet SUI tokens from the Sui faucet
 * using the official Sui SDK. It handles loading states, error handling, and success
 * notifications for a seamless user experience.
 *
 * @author Rijad Kuloglija
 * @version 1.0.0
 */

import { useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { getFaucetHost, requestSuiFromFaucetV2 } from "@mysten/sui/faucet";
import { toast } from "sonner";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

/**
 * Configuration options for the faucet hook
 */
interface UseFaucetOptions {
  /** Optional callback to execute after successful faucet request */
  onSuccess?: () => void;
}

/**
 * Return type for the faucet hook
 */
interface UseFaucetReturn {
  /** Whether a faucet request is currently in progress */
  isLoading: boolean;
  /** Function to request SUI from the testnet faucet */
  requestSUI: () => Promise<void>;
  /** Whether the last request was successful */
  isSuccess: boolean;
  /** Any error that occurred during the last request */
  error: string | null;
}

// ============================================================================
// FAUCET HOOK
// ============================================================================

/**
 * Custom hook for requesting testnet SUI tokens from the faucet
 *
 * This hook provides a simple interface to request SUI tokens from the Sui testnet
 * faucet. It handles all the complexity of making the request, managing loading
 * states, and providing user feedback through toast notifications.
 *
 * Features:
 * - Automatic wallet address detection
 * - Loading state management
 * - Error handling with user-friendly messages
 * - Success notifications
 * - Rate limiting awareness
 * - Testnet network targeting
 *
 * @returns Object containing request function and state
 *
 * @example
 * ```tsx
 * const { requestSUI, isLoading, isSuccess, error } = useFaucet();
 * 
 * const handleFaucetRequest = async () => {
 *   await requestSUI();
 * };
 * ```
 */
export function useFaucet(options?: UseFaucetOptions): UseFaucetReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentAccount = useCurrentAccount();

  const requestSUI = async (): Promise<void> => {
    // Check if wallet is connected
    if (!currentAccount?.address) {
      toast.error("Please connect your wallet first");
      setError("Wallet not connected");
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      // Show initial loading toast
      const loadingToast = toast.loading("Requesting SUI from testnet faucet...");

      // Request SUI from testnet faucet
      await requestSuiFromFaucetV2({
        host: getFaucetHost('testnet'),
        recipient: currentAccount.address,
      });

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Show success notification
      toast.success("SUI tokens requested successfully!", {
        description: "Tokens should appear in your wallet shortly. This may take a few moments.",
        duration: 5000,
      });

      setIsSuccess(true);

      // Call success callback if provided
      if (options?.onSuccess) {
        // Add a small delay to allow the transaction to be processed
        setTimeout(() => {
          options.onSuccess?.();
        }, 2000);
      }

    } catch (err) {
      // Dismiss any loading toasts
      toast.dismiss();

      // Handle different types of errors
      let errorMessage = "Failed to request SUI tokens";
      let showFallbackOptions = false;
      
      if (err instanceof Error) {
        const errorText = err.message.toLowerCase();
        
        if (errorText.includes("rate limit") || errorText.includes("too many requests")) {
          errorMessage = "Rate limit exceeded. Please wait a few minutes before requesting again.";
        } else if (errorText.includes("network") || errorText.includes("connection") || errorText.includes("failed to fetch")) {
          errorMessage = "Faucet service is temporarily unavailable. Try alternative methods below.";
          showFallbackOptions = true;
        } else if (errorText.includes("recipient")) {
          errorMessage = "Invalid wallet address. Please reconnect your wallet.";
        } else {
          errorMessage = `Request failed: ${err.message}`;
          showFallbackOptions = true;
        }
      }

      // Show error notification with fallback options
      toast.error("Faucet Request Failed", {
        description: showFallbackOptions 
          ? `${errorMessage}\n\n🌐 Try: https://faucet.sui.io\n💬 Discord: Join #testnet-faucet channel`
          : errorMessage,
        duration: showFallbackOptions ? 10000 : 6000,
        action: showFallbackOptions ? {
          label: "Open Web Faucet",
          onClick: () => window.open("https://faucet.sui.io", "_blank"),
        } : undefined,
      });

      setError(errorMessage);
      console.error("Faucet request error:", err);

    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    requestSUI,
    isSuccess,
    error,
  };
} 