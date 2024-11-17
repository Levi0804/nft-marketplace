import { useState } from 'react';

// Type definitions for Petra Wallet
type PetraWallet = {
  connect: () => Promise<{ address: string }>;
  account: () => Promise<{ address: string }>;
  disconnect: () => Promise<void>;
};

declare global {
  interface Window {
    petra?: PetraWallet;
  }
}

interface NFTCardProps {
  src: string;
  index: number;
  isWalletConnected: boolean;
  onBuyClick: (index: number) => void;
}

const NFTCard: React.FC<NFTCardProps> = ({ src, index, isWalletConnected, onBuyClick }) => (
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
          ${!isWalletConnected ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-600'}`}
        disabled={!isWalletConnected}
      >
        BUY
      </button>
      <h1 className="p-4">Price: {index + 1} Apt</h1>
    </div>
  </div>
);

export const NFTmarketplace: React.FC = () => {
  const [address, setAddress] = useState<string>("");
  const [connected, setConnected] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

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

  const handleBuyClick = async (index: number) => {
    if (!connected) {
      setError("Please connect your wallet first");
      return;
    }
    
    // Add your NFT purchase logic here
    console.log(`Attempting to buy NFT ${index + 1} for ${index + 1} APT`);
    // You would typically interact with a smart contract here
  };

  const formatAddress = (addr: string): string => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const NFT_IMAGES = [
    "/poki/8.svg",
    "/poki/3.svg",
    "/poki/25.svg",
    "/poki/492.svg",
    "/poki/45.svg",
    "/poki/31.svg",
    "/poki/78.svg",
    "/poki/453.svg",
    "/poki/99.svg",
    "/poki/642.svg",
    "/poki/83.svg",
    "/poki/563.svg",
    "/poki/440.svg",
    "/poki/323.svg",
    "/poki/251.svg",
    "/poki/648.svg",
  ];

  return (
    <section className="h-screen w-full mb-4">
      <div className="flex justify-center m-4">
        <h1 className="font-bold text-5xl">NFTMARKETPLACE</h1>
      </div>
      <div className="flex flex-col items-center p-8">
        <button 
          onClick={connected ? disconnectWallet : connectWallet}
          className="bg-yellow-500 hover:bg-yellow-600 text-xl p-4 rounded-xl transition-colors"
        >
          {connected ? `Connected: ${formatAddress(address)}` : "Connect Wallet"}
        </button>
        {error && (
          <p className="text-red-500 mt-2">{error}</p>
        )}
      </div>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {NFT_IMAGES.map((src, index) => (
            <NFTCard
              key={index}
              src={src}
              index={index}
              isWalletConnected={connected}
              onBuyClick={handleBuyClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
};