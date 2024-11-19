import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import LandingPageFeatures from "./Features";
import LandingPageHeroSection from "./Herosection";

type PetraWallet = {
  signAndSubmitTransaction(payload: { type: string; } & { function: string; type_arguments: Array<string>; arguments: Array<any>; }): unknown;
  connect: () => Promise<{ address: string }>;
  account: () => Promise<{ address: string }>;
};

declare global {
  interface Window {
    petra?: PetraWallet;
  }
}

export function Landingpage(): JSX.Element {
  const [address, setAddress] = useState<string>("");
  const [connected, setConnected] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const checkPetraWallet = (): boolean => {
    if ("petra" in window) {
      return true;
    }
    window.open("https://petra.app/", "_blank");
    return false;
  };

  const connectWallet = async (): Promise<void> => {
    if (!checkPetraWallet()) {
      alert("Please install Petra wallet!");
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

  const formatAddress = (addr: string): string => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="w-full bg-black min-h-screen">
      {/* Navigation */}
      <nav className="relative px-4 py-4 md:px-10 md:py-5">
        <div className="flex items-center justify-between">
          <a href='/' className="font-bold text-yellow-500 text-2xl md:text-4xl tracking-wider">
            NFTmarkertplace
          </a>
          
          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop button */}
          <div className="hidden md:block">
            <button 
              onClick={connectWallet}
              className="bg-yellow-500 hover:bg-yellow-600 transition-colors rounded-xl px-4 py-2 text-xl font-bold"
            >
              {connected ? formatAddress(address) : "Connect Wallet"}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-black p-4 md:hidden">
            <button 
              onClick={connectWallet}
              className="w-full bg-yellow-500 hover:bg-yellow-600 transition-colors rounded-xl px-4 py-2 text-xl font-bold"
            >
              {connected ? formatAddress(address) : "Connect Wallet"}
            </button>
          </div>
        )}
      </nav>

      <LandingPageHeroSection />
      <LandingPageFeatures />
      
      {/* Responsive Footer */}
      <footer className="py-12 px-4 md:px-6 bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="mb-6 md:mb-0">
            <h3 className="font-bold text-xl mb-4">PokéNFT World</h3>
            <p className="text-gray-300">The ultimate digital Pokémon trading experience</p>
          </div>
          <div className="mb-6 md:mb-0">
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-yellow-300">Pokédex</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-300">Trading Guide</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-300">Battle Arena</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Community</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-yellow-300">Discord</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-300">Twitter</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-300">Blog</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}