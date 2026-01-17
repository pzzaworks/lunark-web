import { INetwork } from "./types/networks";
import { BalanceOption } from "./types/balance";

export const networks: INetwork[] = [
  {
    id: 'eth',
    name: 'Ethereum',
    chainId: 1,
    icon: '/images/networks/ethereum.svg',
    rpcUrl: 'https://ethereum-rpc.publicnode.com',
    explorerUrl: 'https://etherscan.io',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      logoURI: '/images/networks/ethereum.svg'
    }
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum',
    chainId: 42161,
    icon: '/images/networks/arbitrum-one.svg',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorerUrl: 'https://arbiscan.io',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      logoURI: '/images/networks/ethereum.svg'
    }
  },
  {
    id: 'polygon',
    name: 'Polygon',
    chainId: 137,
    icon: '/images/networks/polygon.svg',
    rpcUrl: 'https://polygon-bor-rpc.publicnode.com',
    explorerUrl: 'https://polygonscan.com',
    nativeCurrency: {
      name: 'Polygon',
      symbol: 'MATIC',
      decimals: 18,
      logoURI: '/images/networks/polygon.svg'
    }
  },

  {
    id: 'bnb',
    name: 'BNB Chain',
    chainId: 56,
    icon: '/images/networks/binance-smart-chain.svg',
    rpcUrl: 'https://bsc-dataseed1.bnbchain.org',
    explorerUrl: 'https://bscscan.com',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
      logoURI: '/images/networks/binance-smart-chain.svg'
    }
  },
  {
    id: 'avalanche',
    name: 'Avalanche',
    chainId: 43114,
    icon: '/images/networks/avalanche.svg',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    explorerUrl: 'https://snowtrace.io',
    nativeCurrency: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18,
      logoURI: '/images/networks/avalanche.svg'
    }
  },
  {
    id: 'optimism',
    name: 'Optimism',
    chainId: 10,
    icon: '/images/networks/optimism.svg',
    rpcUrl: 'https://optimism-rpc.publicnode.com',
    explorerUrl: 'https://optimistic.etherscan.io',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      logoURI: '/images/networks/ethereum.svg'
    }
  },
  {
    id: 'base',
    name: 'Base',
    chainId: 8453,
    icon: '/images/networks/base.svg',
    rpcUrl: 'https://base-rpc.publicnode.com',
    explorerUrl: 'https://basescan.org',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      logoURI: '/images/networks/ethereum.svg'
    }
  },
  {
    id: 'eth-sepolia',
    name: 'Sepolia',
    chainId: 11155111,
    icon: '/images/networks/ethereum.svg',
    rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
    explorerUrl: 'https://sepolia.etherscan.io',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      logoURI: '/images/networks/ethereum.svg'
    }
  }
];

export const balanceOptions: BalanceOption[] = [
  {
    price: 5,
    isRecommended: true
  },
  {
    price: 20
  },
  {
    price: 50
  },
  {
    price: 200
  }
];

export const baseButtonStyle = `
  bg-[radial-gradient(70%_70%_at_center,rgba(8,10,12,0.98)_0%,rgba(160,165,180,0.25)_100%)]
  backdrop-blur-sm
  border border-[#888]/30
  transition-all duration-400 ease-in-out
  shadow-[0_0_10px_rgba(0,0,0,0.2),inset_0_0_20px_4px_rgba(0,0,0,0.3)]
  hover:border-[#aaa]/75
  hover:bg-[radial-gradient(70%_70%_at_center,rgba(8,10,12,0.98)_0%,rgba(160,165,180,0.5)_100%)]
  hover:shadow-[0_0_15px_rgba(0,0,0,0.3),inset_0_0_25px_6px_rgba(0,0,0,0.3)]
  active:shadow-[0_0_20px_rgba(0,0,0,0.4),inset_0_0_30px_8px_rgba(0,0,0,0.3)]
  disabled:!opacity-50 
  disabled:pointer-events-none 
  disabled:cursor-not-allowed
`;

export const baseContainerStyle = `
  bg-[radial-gradient(70%_70%_at_center,rgba(8,10,12,0.98)_0%,rgba(160,165,180,0.25)_100%)]
  backdrop-blur-sm
  border border-[#888]/30
  shadow-[0_0_10px_rgba(0,0,0,0.2),inset_0_0_20px_4px_rgba(0,0,0,0.3)]
`;

export const baseContainerStyleCss = {
  background: "radial-gradient(70% 70% at center, rgba(8,10,12,0.98) 0%, rgba(160,165,180,0.25) 100%)",
  backdropFilter: "blur(4px)",
  border: "1px solid rgba(136,136,136,0.3)",
  boxShadow: "0 0 10px rgba(0,0,0,0.2), inset 0 0 20px 4px rgba(0,0,0,0.3)",
  color: "#FCFCFC"
};

export const backedBy = [
  { id: "valentura", name: "Valentura", image: "/images/backedby/valentura.png", url: "https://valentura.com" },
  { id: "tummiad", name: "Tummiad", image: "/images/backedby/tummiad.png", url: "https://www.tummiad.org.tr/" }
] as const;

export const ecosystemPartners: Array<{ id: string; name: string; image: string; url: string }> = [
] as const;

export type Feature = {
  title: string;
  description: string;
  icon: "Brain" | "Language" | "Planet";
  bannerImage: string;
};

export const features: Feature[] = [
  {
    title: "Lunark Agent",
    description: "Lunark Agent is an autonomous entity capable of executing complex blockchain operations, managing assets, and interacting with smart contracts on your behalf, all while continuously learning and adapting.",
    icon: "Brain",
    bannerImage: "/images/features/dual-intelligence.webp"
  },
  {
    title: "Natural Language",
    description: "Complex operations like token transfers, smart contract interactions, and cross-chain transactions become as simple as expressing your intent in natural language.",
    icon: "Language",
    bannerImage: "/images/features/natural-language.webp"
  },
  {
    title: "Platform Evolution",
    description: "Our platform continuously evolves by integrating new blockchains and dApps, expanding our ecosystem to provide seamless access to the latest protocols and cross-chain opportunities.",
    icon: "Planet",
    bannerImage: "/images/features/platform-evolution.webp"
  }
] as const;