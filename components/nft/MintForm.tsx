/**
 * @fileoverview NFT Minting Form Component
 * 
 * This component provides a comprehensive form interface for minting NFTs
 * on the Sui blockchain. It includes form validation, transaction handling,
 * and user feedback for the minting process.
 * 
 * @author Rijad Kuloglija
 * @version 1.0.0
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useMintNFT } from '@/hooks/useMintNFT';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { Loader2, Zap } from 'lucide-react';
import { toast } from 'sonner';

// ============================================================================
// FORM VALIDATION SCHEMA
// ============================================================================

/**
 * Zod schema for NFT minting form validation
 * 
 * Defines validation rules for:
 * - Name: Required, 1-100 characters
 * - Description: Required, 1-500 characters  
 * - Image URL: Required, valid URL format
 */
const mintFormSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  description: z.string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters')
    .trim(),
  image_url: z.string()
    .min(1, 'Image URL is required')
    .url('Please enter a valid URL')
    .trim(),
});

/**
 * Type definition for form data based on validation schema
 */
type MintFormData = z.infer<typeof mintFormSchema>;

// ============================================================================
// MINT FORM COMPONENT
// ============================================================================

/**
 * Props for the MintForm component
 */
interface MintFormProps {
  /** Optional callback function to execute after successful minting */
  onMintSuccess?: () => void;
}

/**
 * NFT Minting Form Component
 * 
 * This component provides a complete NFT minting interface that:
 * - Validates user input using Zod schema
 * - Handles form submission and transaction processing
 * - Provides real-time feedback during minting process
 * - Shows success/error states with appropriate messaging
 * - Resets form after successful minting
 * 
 * The component requires a connected wallet and handles all
 * transaction states including loading, success, and error scenarios.
 * 
 * @param props - Component props
 * @returns JSX element containing the NFT minting form
 * 
 * @example
 * ```tsx
 * function MintPage() {
 *   return (
 *     <div className="container mx-auto">
 *       <MintForm onMintSuccess={() => console.log('NFT minted!')} />
 *     </div>
 *   );
 * }
 * ```
 */
export function MintForm({ onMintSuccess }: MintFormProps) {
  const currentAccount = useCurrentAccount();
  const { mintNFT, isLoading } = useMintNFT();
  const [imagePreview, setImagePreview] = useState<string>('');

  // Initialize form with validation
  const form = useForm<MintFormData>({
    resolver: zodResolver(mintFormSchema),
    defaultValues: {
      name: '',
      description: '',
      image_url: '',
    },
  });

  /**
   * Handle form submission and NFT minting
   * 
   * @param data - Validated form data
   */
  const onSubmit = async (data: MintFormData) => {
    if (!currentAccount) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      toast.loading('Minting NFT...', { id: 'mint-nft' });
      
      await mintNFT({
        name: data.name,
        description: data.description,
        image_url: data.image_url,
      });

      toast.success('NFT minted successfully! 🎉 Check your gallery in a few seconds.', { id: 'mint-nft' });
      
      // Reset form after successful mint
      form.reset();
      setImagePreview('');
      
      // Trigger callback to refresh NFT gallery after a brief delay
      // This allows the blockchain to process and index the new NFT
      if (onMintSuccess) {
        setTimeout(() => {
          onMintSuccess();
        }, 2000); // 2 second delay to ensure transaction is processed
      }
      
    } catch (error) {
      console.error('Minting failed:', error);
      toast.error('Failed to mint NFT. Please try again.', { id: 'mint-nft' });
    }
  };

  /**
   * Handle image URL changes and update preview
   * 
   * @param url - Image URL to preview
   */
  const handleImageUrlChange = (url: string) => {
    setImagePreview(url);
    // Clear preview if URL is invalid
    const img = new Image();
    img.onload = () => setImagePreview(url);
    img.onerror = () => setImagePreview('');
    img.src = url;
  };

  // Show wallet connection prompt if not connected
  if (!currentAccount) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
            <Zap className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
          <CardTitle>Wallet Required</CardTitle>
          <CardDescription>
            Please connect your wallet to mint NFTs
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="h-6 w-6 text-blue-600" />
          <span>Mint New NFT</span>
        </CardTitle>
        <CardDescription>
          Create a unique NFT on the Sui blockchain with custom metadata
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* NFT Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NFT Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter NFT name (e.g., 'Cosmic Dragon')"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    A unique name for your NFT (1-100 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* NFT Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Describe your NFT (e.g., 'A powerful dragon soaring through cosmic nebulae...')"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Detailed description of your NFT (1-500 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image URL Field */}
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/image.png"
                      {...field}
                      disabled={isLoading}
                      onChange={(e) => {
                        field.onChange(e);
                        handleImageUrlChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Direct URL to your NFT image (HTTPS recommended)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Preview */}
            {imagePreview && (
              <div className="space-y-2">
                <FormLabel>Image Preview</FormLabel>
                <div className="border rounded-lg p-4 bg-muted/50">
                  <img
                    src={imagePreview}
                    alt="NFT Preview"
                    className="max-w-full h-auto max-h-64 mx-auto rounded-lg shadow-sm"
                    onError={() => setImagePreview('')}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Minting NFT...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Mint NFT
                </>
              )}
            </Button>

            {/* Form Status */}
            {isLoading && (
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-center space-x-2 text-blue-700 dark:text-blue-300">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">
                    Processing transaction on Sui blockchain...
                  </span>
                </div>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 