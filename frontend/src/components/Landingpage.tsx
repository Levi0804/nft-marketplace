import { useState, useEffect } from 'react';
import LandingPageFeatures from "./Features";
import LandingPageHeroSection from "./Herosection";

// Type definitions for Petra Wallet
type PetraWallet = {
  signAndSubmitTransaction(payload: { type: string; } & { function: string; type_arguments: Array<string>; arguments: Array<any>; }): unknown;
  connect: () => Promise<{ address: string }>;
  account: () => Promise<{ address: string }>;
  // Add other Petra wallet methods as needed
};

// Extend Window interface to include petra
declare global {
  interface Window {
    petra?: PetraWallet;
  }
}

export function Landingpage(): JSX.Element {
  const [address, setAddress] = useState<string>("");
  const [connected, setConnected] = useState<boolean>(false);

  // Check if Petra wallet is installed
  const checkPetraWallet = (): boolean => {
    if ("petra" in window) {
      return true;
    }
    window.open("https://petra.app/", "_blank");
    return false;
  };

  // Initialize wallet connection
  const connectWallet = async (): Promise<void> => {
      if (!checkPetraWallet()) {
          alert("Wallet connected!)");
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
        alert("Wallet connected!");
      console.log("Connected successfully!", response);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  // Function to format address for display
  const formatAddress = (addr: string): string => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="w-full bg-black">
      <section className="px-10 py-5 flex">
        <div className="items-start">
          <a href='/' className="font-bold text-primary text-yellow-500 px-20 py-10 m-4 text-4xl tracking-wider ms-4">
            NFTmarkerplace
          </a>
        </div>
        <div className="flex w-full justify-end">
          <button 
            onClick={connectWallet}
            className="bg-yellow-500 hover:bg-yellow-600 transition-colors rounded-xl px-4 mx-8 text-xl font-bold justify-end"
          >
            {connected ? formatAddress(address) : "Connect Wallet"}
          </button>
        </div>
      </section>
      <LandingPageHeroSection />
      <LandingPageFeatures />
    </div>
  );
}