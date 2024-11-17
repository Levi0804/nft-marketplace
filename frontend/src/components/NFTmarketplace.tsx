import React, { useState } from 'react';
import { AptosClient, Types } from 'aptos';

// Contract Constants
const MODULE_ADDRESS = "0x0d8e036d15b11ff270283fb9bd6c5c620d98fd6a871b1494546425cc064b1d34";
const MODULE_NAME = "pokemon_marketplace";

// Type definitions for Petra Wallet
type PetraWallet = {
  connect: () => Promise<{ address: string }>;
  account: () => Promise<{ address: string }>;
  disconnect: () => Promise<void>;
  signAndSubmitTransaction: (transaction: Types.TransactionPayload) => Promise<{ hash: string }>;
};

declare global {
  interface Window {
    petra?: PetraWallet;
  }
}

// NFT Card Component for displaying individual NFTs
type NFTCardProps = {
  src: string;
  index: number;
  isWalletConnected: boolean;
  onBuyClick: (index: number) => void;
  isLoading: boolean;
};

const NFTCard: React.FC<NFTCardProps> = ({ src, index, isWalletConnected, onBuyClick, isLoading }) => (
  <div className="overflow-hidden rounded-xl bg-white shadow-lg h-96 w-96 transition-transform hover:scale-105 justify-center items-center">
    <img 
      src={src} 
      alt={`Featured NFT ${index + 1}`}
      className="transition-opacity hover:opacity-80 h-72 w-72 m-4"
    />
    <div className="flex justify-center">
      <button 
        onClick={() => onBuyClick(index)}
        className={`bg-yellow-500 text-xl rounded-xl justify-center p-4 items-center
          ${!isWalletConnected ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-600'}
          ${isLoading ? 'cursor-wait' : ''}`}
        disabled={!isWalletConnected || isLoading}
      >
        {isLoading ? 'Processing...' : 'BUY'}
      </button>
      <h1 className="p-4">Price: {index + 1} Apt</h1>
    </div>
  </div>
);

// Main Component for the NFT Marketplace
const NFTMarketplace: React.FC = () => {
  const [address, setAddress] = useState<string>("");
  const [connected, setConnected] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initialize Aptos Client
  const client = new AptosClient('https://fullnode.devnet.aptoslabs.com/v1');

  const checkPetraWallet = (): boolean => {
    if ("petra" in window) {
      return true;
    }
    window.open("https://petra.app/", "_blank");
    return false;
  };

  const connectWallet = async (): Promise<void> => {
    setError("");
    if (!checkPetraWallet()) {
      setError("Please install Petra wallet");
      return;
    }

    try {
      const response = await window.petra?.connect();
      if (!response) {
        throw new Error("Failed to connect to Petra wallet");
      }

      const account = await window.petra?.account();
      if (!account) {
        throw new Error("Failed to get account information");
      }

      setAddress(account.address);
      setConnected(true);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setError("Failed to connect wallet");
    }
  };

  const disconnectWallet = async (): Promise<void> => {
    try {
      await window.petra?.disconnect();
      setAddress("");
      setConnected(false);
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      setError("Failed to disconnect wallet");
    }
  };

  const buyPokemon = async (pokemonObjAddress) => {
    if (!address) {
      alert("Please connect your wallet!");
      return;
    }

    setIsLoading(true);

    try {
      // Construct the payload for buying the Pokemon
      const payload = {
        type: "entry_function_payload",
        function: `${MODULE_ADDRESS}::${MODULE_NAME}::buy_pokemon`,
        type_arguments: [],
        arguments: [pokemonObjAddress], // Pass the address of the Pokemon object
      };

      // Sign and submit the transaction
      const response = await window.petra?.signAndSubmitTransaction(payload);
      if (response) {
        alert("Purchase successful!");
        await fetchPokemons();
      }
    } catch (error) {
      alert("Error during purchase: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatAddress = (addr: string): string => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const NFT_IMAGES = [
    "/poki/86.svg",
    "/poki/87.svg",
    "/poki/88.svg",
    "/poki/89.svg",
    "/poki/90.svg",
    "/poki/91.svg",
    "/poki/92.svg",
    "/poki/93.svg",
    "/poki/94.svg",
    "/poki/95.svg",
    "/poki/96.svg",
    "/poki/97.svg",
    "/poki/98.svg",
    "/poki/99.svg",
    "/poki/100.svg",
    "/poki/101.svg",
  ];

  return (
    <section className="h-screen w-full mb-4">
      <div className="flex justify-center m-4">
        <h1 className="font-bold text-5xl">NFT MARKETPLACE</h1>
      </div>
      <div className="flex flex-col items-center p-8">
        <button
          onClick={connected ? disconnectWallet : connectWallet}
          className="bg-yellow-500 hover:bg-yellow-600 text-xl p-4 rounded-xl transition-colors"
        >
          {connected ? `Connected: ${formatAddress(address)}` : "Connect Wallet"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {NFT_IMAGES.map((src, index) => (
            <NFTCard
              key={index}
              src={src}
              index={index}
              isWalletConnected={connected}
              onBuyClick={buyPokemon}
              isLoading={isLoading}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NFTMarketplace;
