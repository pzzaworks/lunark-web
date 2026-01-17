"use client";
import { useAppKitAccount, useAppKitNetwork, useAppKitProvider, useDisconnect } from "@reown/appkit/react";
import React, { useEffect, useState, useContext } from "react";
import { useAppKitContext, useGlobalContext } from ".";
import toast from "react-hot-toast";
import { JsonRpcProvider, BrowserProvider } from "ethers";
import { useRouter } from "next/navigation";
import TermsOfServicePopup from "@/components/Popup/TermsOfServicePopup";
import { createAxiosInstance, setCurrentUser } from "@/lib/axios";
import axios from "axios";

interface IUserContextProps {
  user: any | undefined;
  setUser: (user: any | undefined) => void;
  isConnecting: boolean;
  isDisconnecting: boolean;
  disconnect: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

export const UserContext = React.createContext<IUserContextProps>({
  user: undefined,
  setUser: (user: any | undefined) => {},
  isConnecting: false,
  isDisconnecting: false,
  disconnect: async () => {},
  refetchUser: async () => {}
});

export const UserContextProvider = (props: any) => {
  const { defaultProvider, setDefaultProvider, ethersProvider, setEthersProvider, ethersSigner, setEthersSigner } = useGlobalContext();
  const { appKitNetworks } = useAppKitContext();
  const { walletProvider } = useAppKitProvider('eip155');
  const { address, isConnected } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const disconnectWallet = useDisconnect();
  const [user, setUserState] = useState<any | undefined>(undefined);

  const setUser = (newUser: any | undefined) => {
    setUserState(newUser);
    setCurrentUser(newUser);
  };
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isDisconnecting, setIsDisconnecting] = useState<boolean>(false);
  const router = useRouter();

  // Session verification removed - JWT handles expiry automatically

  useEffect(() => {
      if (defaultProvider || !address || !isConnected) return;

      const currentNetwork = appKitNetworks.find((net: any) => net.id === chainId);
      if (!currentNetwork) return;
  
      const defaultProviderTemp = new JsonRpcProvider(currentNetwork.rpcUrls.default.http[0]);
      setDefaultProvider(defaultProviderTemp);
  }, [chainId, address, isConnected]);

  useEffect(() => {
      if (!walletProvider || ethersProvider || !address || !isConnected) return;

      const ethersProviderTemp = new BrowserProvider(walletProvider as any, "any");
      setEthersProvider(ethersProviderTemp);
  }, [walletProvider, address, isConnected]);

  const refetchUser = async () => {
    try {
      if (!address) return;
      const { data } = await createAxiosInstance().get('/api/user/me');
      if (data.success && data.user) {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Refetch user error:', error);
    }
  }

  useEffect(() => {
      if (!ethersProvider) return;

      const updateEthersSigner = async () => {
        const ethersSignerTemp = await ethersProvider.getSigner();
        setEthersSigner(ethersSignerTemp);
      };

      updateEthersSigner();
  }, [ethersProvider]);

  const checkAndCreateUser = async () => {
    const address = await ethersSigner.getAddress();

    try {
      // Check if we have an existing valid token
      const existingToken = localStorage.getItem('sessionToken');

      if (existingToken) {
        // Try to use existing token
        try {
          const { data } = await createAxiosInstance().get('/api/user/me');

          if (data.success && data.user) {
            // Check if token belongs to the same wallet
            if (data.user.address?.toLowerCase() === address.toLowerCase()) {
              const userWithToken = {
                ...data.user,
                sessionToken: existingToken
              };
              setUser(userWithToken);
              return;
            }
            // Different wallet, remove old token
            localStorage.removeItem('sessionToken');
          }
        } catch {
          // Token expired or invalid, remove it and continue to sign
          localStorage.removeItem('sessionToken');
        }
      }

      // No valid token, request signature
      const timestamp = Date.now();
      const message = `Sign in to Lunark\nAddress: ${address}\nTimestamp: ${timestamp}`;

      const signature = await ethersSigner.signMessage(message);

      const { data } = await createAxiosInstance().post('/api/user/auth', {
        address,
        signature,
        message
      });

      if (data.success && data.user && data.token) {
        localStorage.setItem('sessionToken', data.token);

        const userWithToken = {
          ...data.user,
          sessionToken: data.token
        };

        setUser(userWithToken);
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      if (error?.code !== 'ACTION_REJECTED') {
        toast.error('Failed to authenticate. Please try again.');
      }
    }
  };

  useEffect(() => {
    if (!address || !isConnected || !ethersSigner || isDisconnecting) return;

    checkAndCreateUser();
  }, [address, isConnected, ethersSigner, isDisconnecting]);

  useEffect(() => {
    if (!address || !isConnected) {
      setIsConnecting(false);
      return;
    }
    setIsConnecting(true);
  }, [address, isConnected]);

  
  const disconnect = async () => {
    try {
      setIsDisconnecting(true);
      await disconnectWallet.disconnect();
      setEthersProvider(undefined);
      setEthersSigner(undefined);
      setUser(undefined);
      localStorage.removeItem('sessionToken');
      setIsDisconnecting(false);
      router.push('/');
    } catch (error) {
      toast.error('Failed to sign out. Please try again.');
      setIsDisconnecting(false);
    }
  };

  useEffect(() => {
    if (!window || !window.ethereum || !user) return;

    const handleAccountsChanged = (accounts: string[]) => {
      disconnect();
    };

    (window.ethereum as any).on('accountsChanged', handleAccountsChanged);

    return () => {
      (window.ethereum as any).removeListener('accountsChanged', handleAccountsChanged);
    };
  }, []);
  
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isConnecting,
        isDisconnecting,
        disconnect,
        refetchUser
      }}
    >
      {props.children}
      <TermsOfServicePopup />
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);