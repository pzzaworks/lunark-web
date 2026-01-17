'use client'

import { createAppKit } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { mainnet, sepolia, bsc as bnb, polygon, avalanche, arbitrum, optimism, fantom, base, zksync, metis, celo, cronos, gnosis, kava, mantle } from '@reown/appkit/networks';
import React, { createContext } from 'react'

const metadata = {
  name: 'Lunark AI',
  description: 'Making blockchain human-friendly with Lunark Agent. Interact with the blockchain using natural language. Check balances, transfer funds, or analyze market trends. Powered by Astreus AI (https://astreus.org) framework.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3010',
  icons: [`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3010'}/images/favicon.png`]
}

const appKitNetworks: any = [
  mainnet,
  sepolia,
  bnb,
  polygon,
  avalanche,
  arbitrum,
  optimism,
  fantom,
  base,
  // zksync,
  metis,
  celo,
  cronos,
  gnosis,
  kava,
  mantle
];

createAppKit({
  adapters: [new EthersAdapter()],
  metadata,
  networks: appKitNetworks,
  projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID!,
  features: {
    analytics: true 
  },
  defaultNetwork: mainnet,
  themeMode: 'dark'
})

interface IAppKitProps {
  appKitNetworks: any
};

export const AppKitContext = createContext<IAppKitProps>({ 
  appKitNetworks
});

export function AppKitContextProvider(props: any) {
    return (
        <AppKitContext.Provider value={{ appKitNetworks }}>
            {props.children}
        </AppKitContext.Provider>
    )
}

export const useAppKitContext = () => React.useContext(AppKitContext);