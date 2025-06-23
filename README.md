# Sui NFT DApp

A comprehensive decentralized application (DApp) built on the Sui blockchain that allows users to mint NFTs, level them up, and manage SUI coins. This project demonstrates modern web3 development practices using Next.js, TypeScript, and the Sui blockchain ecosystem.

## 🚀 Features

- **NFT Minting**: Create unique NFTs with custom metadata and images
- **NFT Level Up**: Enhance your NFTs by leveling them up using smart contracts
- **Coin Management**: Split and manage your SUI coins for better transaction handling
- **Wallet Integration**: Seamless connection with Sui-compatible wallets
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS and Radix UI
- **Type Safety**: Full TypeScript integration for robust development

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Blockchain**: Sui Network (Testnet)
- **Wallet Integration**: @mysten/dapp-kit, @mysten/wallet-kit
- **UI Framework**: Tailwind CSS, Radix UI
- **State Management**: Zustand, TanStack Query
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with custom animations

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm**, **yarn**, **pnpm**, or **bun** package manager
- **Git** for version control
- **Sui Wallet** (recommended: Sui Wallet browser extension)

### Sui Wallet Setup

1. Install the [Sui Wallet browser extension](https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil)
2. Create a new wallet or import an existing one
3. Switch to **Sui Testnet** in the wallet settings
4. Get testnet SUI tokens from the [Sui Testnet Faucet](https://faucet.testnet.sui.io/)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd dapp-test
```

### 2. Install Dependencies

Choose one of the following package managers:

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install

# Using bun
bun install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory (optional - the app works with default settings):

```env
# Sui Network Configuration (defaults to testnet)
NEXT_PUBLIC_SUI_NETWORK=testnet

# Smart Contract Package ID (defaults to pre-deployed testnet contract)
NEXT_PUBLIC_PACKAGE_ID=0x95ea5e48398629b9e21b47bd43ae04174ac3e310b54fb961d780b856b3eaf1a3

# Application Name (optional)
NEXT_PUBLIC_APP_NAME=Sui NFT DApp
```

### 4. Run the Development Server

```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using pnpm
pnpm dev

# Using bun
bun dev
```

### 5. Open the Application

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📱 Using the DApp

### 1. Connect Your Wallet
- Click the "Connect Wallet" button in the header
- Select your preferred Sui wallet
- Approve the connection request

### 2. Get Testnet Tokens
- Visit the [Sui Testnet Faucet](https://faucet.testnet.sui.io/)
- Enter your wallet address
- Request testnet SUI tokens

### 3. Explore Features
- **NFT Gallery**: View your minted NFTs
- **Mint NFT**: Create new NFTs with custom properties
- **Split Coins**: Divide your SUI coins for better transaction management
- **Manage Coins**: View and organize your coin balances

## 🏗️ Project Structure

```
dapp-test/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── coin/             # Coin management components
│   ├── layout/           # Layout components
│   ├── nft/              # NFT-related components
│   ├── ui/               # Reusable UI components
│   └── wallet/           # Wallet connection components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
├── providers/            # React context providers
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Documentation
npm run docs:generate # Generate API documentation
npm run docs:serve    # Generate docs with live reload
npm run docs:build    # Build documentation with success message

# Type checking
npx tsc --noEmit     # Check TypeScript types
```

## 📚 Documentation

This project uses **TypeDoc** to automatically generate comprehensive API documentation from the TypeScript code and JSDoc comments.

### Generating Documentation

```bash
# Generate documentation (one-time)
npm run docs:generate

# Generate with live reload (for development)
npm run docs:serve

# Generate with build confirmation
npm run docs:build
```

### Viewing Documentation

After running the documentation generation command:

1. **Browser viewing**: Open `docs/index.html` in your web browser
2. **macOS**: `open docs/index.html` 
3. **Windows**: `start docs/index.html`
4. **Linux**: `xdg-open docs/index.html`

### What's Documented

The generated documentation includes:

- **🔗 Hooks** - Custom React hooks (`useMintNFT`, `useLevelUp`, `useCoinSplit`, etc.)
- **⚙️ Utilities** - Helper functions (`transactionUtils`, `constants`, `suiClient`)
- **📝 Types** - TypeScript interfaces and type definitions
- **🧩 Components** - React component APIs and props
- **🔌 Providers** - Context providers and their interfaces

### Documentation Structure

```
docs/
├── index.html             # Main documentation page
├── modules.html           # All modules overview  
├── functions/             # Custom hooks and utilities
│   ├── useMintNFT.html    # NFT minting hook
│   ├── useLevelUp.html    # NFT level-up hook
│   └── useCoinSplit.html  # Coin splitting hook
├── interfaces/            # TypeScript interfaces
├── variables/             # Constants and configuration
├── types/                 # Type aliases
└── assets/                # Styling and scripts
```

### Documentation Benefits

✅ **Auto-generated** - No manual maintenance required  
✅ **Always up-to-date** - Generated from your actual code  
✅ **Type-safe** - Includes full TypeScript type information  
✅ **JSDoc integration** - Your comments become beautiful docs  
✅ **Searchable** - Easy to find functions, types, and components  
✅ **Cross-referenced** - Links between related code  
✅ **Developer-friendly** - Markdown format for easy reading

## 🌐 Network Configuration

This DApp is configured to work with Sui Testnet by default. The network configuration is handled in:

- `lib/suiClient.ts` - Sui client configuration
- `lib/constants.ts` - Network constants and addresses
- `providers/SuiProvider.tsx` - Wallet and query providers

## 🔐 Security Considerations

- This is a testnet application - never use real funds
- Always verify transaction details before signing
- Keep your wallet private keys secure
- The app only requests necessary permissions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**Wallet Connection Issues**
- Ensure your Sui wallet extension is installed and unlocked
- Make sure you're on the Sui Testnet network
- Try refreshing the page and reconnecting

**Transaction Failures**
- Check that you have sufficient SUI tokens for gas fees
- Verify you're connected to the correct network (Testnet)
- Wait for previous transactions to complete

**Development Issues**
- Clear your browser cache and cookies
- Delete `node_modules` and reinstall dependencies
- Check the browser console for error messages

### Getting Help

- Check the [Sui Documentation](https://docs.sui.io/)
- Visit the [Sui Discord](https://discord.gg/sui) for community support
- Review the [Sui GitHub repository](https://github.com/MystenLabs/sui)

## 🚧 Roadmap

- [ ] Mainnet deployment
- [ ] NFT marketplace functionality
- [ ] Advanced NFT attributes and rarity system
- [ ] Multi-wallet support
- [ ] Mobile app version

---

**Happy Building on Sui! 🚀**
