import React, { useState } from 'react';
import { AptosClient } from 'aptos';

//const MODULE_ADDRESS = "0x0d8e036d15b11ff270283fb9bd6c5c620d98fd6a871b1494546425cc064b1d34";
//const MODULE_NAME = "pokemon_marketplace";

type PetraWallet = {
  connect: () => Promise<{ address: string }>;
  account: () => Promise<{ address: string }>;
  disconnect: () => Promise<void>;
  signAndSubmitTransaction: (transaction: any) => Promise<{ hash: string }>;
};

declare global {
  interface Window {
    //petra?: PetraWallet;
  }
}

type NFTCardProps = {
  src: string;
  index: number;
  price: number;
  isWalletConnected: boolean;
  onBuyClick: (price: number) => void;
  isLoading: boolean;
};

const NFTCard: React.FC<NFTCardProps> = ({ src, index, price, isWalletConnected, onBuyClick, isLoading }) => (
  <div className="overflow-hidden rounded-xl bg-white shadow-lg h-96 w-96 transition-transform hover:scale-105 justify-center items-center">
    <img 
      src={src} 
      alt={`Featured NFT ${index + 1}`}
      className="transition-opacity hover:opacity-80 h-72 w-72 m-4"
    />
    <div className="flex justify-center">
      <button 
        onClick={() => onBuyClick(price)}
        className={`bg-yellow-500 text-xl rounded-xl justify-center p-4 items-center
          ${!isWalletConnected ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-600'}
          ${isLoading ? 'cursor-wait' : ''}`}
        disabled={!isWalletConnected || isLoading}
      >
        {isLoading ? 'Processing...' : 'BUY'}
      </button>
      <h1 className="p-4">Price: {price} APT</h1>
    </div>
  </div>
);

const NFTMarketplace: React.FC = () => {
  const COLLECTION_ADDRESS = "0x1cc08f016cb6ac83bba8f7bb6ba77b4c9c3e3e0cfeaae8d5edc9166eac0ce4dc"; 
  
  const [address, setAddress] = useState<string>("");
  const [connected, setConnected] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string>("");

  const client = new AptosClient('https://fullnode.devnet.aptoslabs.com/v1');

  const connectWallet = async (): Promise<void> => {
    setError("");
    if (!("petra" in window)) {
      window.open("https://petra.app/", "_blank");
      setError("Please install Petra wallet");
      return;
    }

    try {
      const response = await window.petra?.connect();
      if (!response) throw new Error("Failed to connect to Petra wallet");

      const account = await window.petra?.account();
      if (!account) throw new Error("Failed to get account information");

      setAddress(account.address);
      setConnected(true);
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      setError(error.message || "Failed to connect wallet");
    }
  };

  const disconnectWallet = async (): Promise<void> => {
    try {
      //await window.petra?.disconnect();
      setAddress("");
      setConnected(false);
      setTxHash("");
    } catch (error: any) {
      console.error("Error disconnecting wallet:", error);
      setError(error.message || "Failed to disconnect wallet");
    }
  };

  const handleTransaction = async (price: number) => {
    if (!address) {
      alert("Please connect your wallet!");
      return;
    }

    if (!COLLECTION_ADDRESS.startsWith("0x")) {
      alert("Please use correct COLLECTION_ADDRESS!");
      return;
    }
  
    setIsLoading(true);
    setError("");
    setTxHash("");
  
    try {
      const OCTAS_PER_APT = 100_000_000;
      const amountInOctas = (price * OCTAS_PER_APT).toString();

      const transaction = {
        type: "entry_function_payload",
        function: `0x1::aptos_account::transfer`,
        arguments: [COLLECTION_ADDRESS, amountInOctas],
        type_arguments: []
      };

      const response: { hash: string } = await window.petra?.signAndSubmitTransaction(transaction) as { hash: string };
      
      if (response.hash) {
        setTxHash(response.hash);
        await client.waitForTransaction(response.hash);
        alert(`Transaction successful! Amount: ${price} APT`);
      }
    } catch (error: any) {
      console.error("Transaction failed:", error);
      setError(error.message || "Transaction failed");
      alert(`Transaction failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatAddress = (addr: string): string => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const NFT_DATA = [
    { src: "/poki/8.svg", price: 1 },
    { src: "/poki/87.svg", price: 2 },
    { src: "/poki/231.svg", price: 3 },
    { src: "/poki/25.svg", price: 4 },
    { src: "/poki/78.svg", price: 5 },
    { src: "/poki/45.svg", price: 6 },
    { src: "/poki/17.svg", price: 7 },
    { src: "/poki/445.svg", price: 8 },
    { src: "/poki/323.svg", price: 9 },
    { src: "/poki/78.svg", price: 10 },
    { src: "/poki/100.svg", price: 11 },
    { src: "/poki/143.svg", price: 12 },
    { src: "/poki/135.svg", price: 13 },
    { src: "/poki/111.svg", price: 14 },
    { src: "/poki/249.svg", price: 15 },
    { src: "/poki/10.svg", price: 16 }
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
        {txHash && (
          <p className="text-green-500 mt-2">
            Transaction Hash: {formatAddress(txHash)}
            <a 
              href={`https://explorer.aptoslabs.com/txn/${txHash}?network=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-blue-500 hover:text-blue-600"
            >
              View Transaction
            </a>
          </p>
        )}
      </div>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {NFT_DATA.map((nft, index) => (
            <NFTCard
              key={index}
              src={nft.src}
              index={index}
              price={nft.price}
              isWalletConnected={connected}
              onBuyClick={handleTransaction}
              isLoading={isLoading}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NFTMarketplace;
