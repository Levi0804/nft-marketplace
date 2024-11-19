import React, { useState } from 'react';
import { AptosClient } from 'aptos';

const MODULE_ADDRESS = "0x0d8e036d15b11ff270283fb9bd6c5c620d98fd6a871b1494546425cc064b1d34";
const SUPABASE_URL = "https://xxplwdmjiahdwvjqlivi.supabase.co/storage/v1/object/public/pokemon-nfts";

type NFTCardProps = {
  src: string;
  index: number;
  price: number;
  name: string;
  description: string;
  isWalletConnected: boolean;
  onBuyClick: (price: number, metadata: NFTMetadata) => void;
  isLoading: boolean;
};

type NFTMetadata = {
  name: string;
  description: string;
  uri: string;
};

const NFTCard: React.FC<NFTCardProps> = ({ 
  src, 
  index, 
  price, 
  name,
  description,
  isWalletConnected, 
  onBuyClick, 
  isLoading 
}) => {
  const [imageError, setImageError] = useState(false);

  const getImageUrl = (src: string) => {
    const cleanSrc = src.replace(/^\/?(poki\/)?/, '');
    return `${SUPABASE_URL}/${cleanSrc}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 h-[400px] bg-gray-100">
          {imageError ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-500">Image not available</span>
            </div>
          ) : (
            <img 
              src={src} 
              alt={`${name} NFT`}
              className="w-full h-full object-contain"
              onError={() => setImageError(true)}
            />
          )}
        </div>

        <div className="md:w-1/2 p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-3xl font-bold mb-4">{name}</h3>
            <p className="text-lg text-gray-600 mb-6">{description}</p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Price:</span>
                <span className="text-2xl font-bold text-yellow-600">{price} APT</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Token ID:</span>
                <span className="text-gray-800">#{index + 1}</span>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <button 
              onClick={() => onBuyClick(price, {
                name,
                description,
                uri: getImageUrl(src)
              })}
              className={`w-full bg-yellow-500 text-white text-xl py-4 rounded-lg
                ${!isWalletConnected ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-600'}
                ${isLoading ? 'cursor-wait' : ''} 
                transition-colors duration-200`}
              disabled={!isWalletConnected || isLoading}
            >
              {isLoading ? 'Processing Transaction...' : 'Purchase NFT'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NFTMarketplace: React.FC = () => {
  const COLLECTION_ADDRESS = "0x1cc08f016cb6ac83bba8f7bb6ba77b4c9c3e3e0cfeaae8d5edc9166eac0ce4dc"; 
  const COLLECTION_NAME = "Pokemon NFT Collection";
  const COLLECTION_DESCRIPTION = "Exclusive collection of Pokemon NFTs";
  
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

  const checkCollectionExists = async (): Promise<boolean> => {
    try {
      const resources = await client.getAccountResources(address);
      const collectionResource = resources.find(
        (r) => r.type === "0x3::token::Collections"
      );
      return !!collectionResource;
    } catch (error) {
      console.error("Error checking collection:", error);
      return false;
    }
  };

  const createCollection = async () => {
    try {
      const exists = await checkCollectionExists();
      if (exists) {
        console.log("Collection already exists, proceeding with minting...");
        return true;
      }

      const transaction = {
        type: "entry_function_payload",
        function: "0x3::token::create_collection_script",
        arguments: [
          COLLECTION_NAME,
          COLLECTION_DESCRIPTION,
          SUPABASE_URL,
          9007199254740991,
          [true, true, true, true, true],
        ],
        type_arguments: [],
      };

      const response = await window.petra?.signAndSubmitTransaction(transaction);
      if ((response as { hash: string })?.hash) {
        await client.waitForTransaction((response as { hash: string }).hash);
        return true;
      }
      return false;
    } catch (error: any) {
      if (error.message?.includes("Collection already exists")) {
        console.log("Collection already exists, proceeding with minting...");
        return true;
      }
      throw error;
    }
  };

  const handleTransaction = async (price: number, metadata: NFTMetadata) => {
    if (!address) {
      alert("Please connect your wallet!");
      return;
    }
  
    setIsLoading(true);
    setError("");
    setTxHash("");
  
    try {
      const uniqueTokenName = `${metadata.name}_${Date.now()}`;
      const OCTAS_PER_APT = 100_000_000;
      const amountInOctas = (price * OCTAS_PER_APT).toString();

      const paymentTransaction = {
        type: "entry_function_payload",
        function: `0x1::aptos_account::transfer`,
        arguments: [COLLECTION_ADDRESS, amountInOctas],
        type_arguments: [],
      };

      const paymentResponse = await window.petra?.signAndSubmitTransaction(paymentTransaction);
      
      if ((paymentResponse as { hash: string })?.hash) {
        await client.waitForTransaction((paymentResponse as { hash: string }).hash);

        await createCollection();

        const tokenTransaction = {
          type: "entry_function_payload",
          function: "0x3::token::create_token_script",
          arguments: [
            COLLECTION_NAME,
            uniqueTokenName,
            metadata.description,
            1,
            1,
            metadata.uri,
            address,
            100,
            0,
            [false, false, false, false, false],
            [], 
            [], 
            [], 
          ],
          type_arguments: [],
        };

        const tokenResponse = await window.petra?.signAndSubmitTransaction(tokenTransaction);
        
        if ((tokenResponse as { hash: string })?.hash) {
          setTxHash((tokenResponse as { hash: string }).hash);
          await client.waitForTransaction((tokenResponse as { hash: string }).hash);
          alert(`Purchase successful! NFT has been added to your collection.`);
        }
      }
      
    } catch (error: any) {
      console.error("Transaction failed:", error);
      setError(error.message || "Transaction failed");
      alert(`Transaction failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = async (): Promise<void> => {
    try {
      setAddress("");
      setConnected(false);
      setTxHash("");
    } catch (error: any) {
      console.error("Error disconnecting wallet:", error);
      console.log(MODULE_ADDRESS);
      setError(error.message || "Failed to disconnect wallet");
    }
  };

  const formatAddress = (addr: string): string => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const NFT_DATA = [
    { 
      src: "/poki/8.svg",
      price: 1

,
      name: "Pikachu",
      description: "Electric-type Pokémon known for its lightning bolt-shaped tail."
    },
    { 
      src: "/poki/9.svg",
      price: 2,
      name: "Charizard",
      description: "Fire/Flying-type Pokémon known for its fiery breath and majestic wings."
    },
    {
      src: "/poki/10.svg",
      price: 3,
      name: "Bulbasaur",
      description: "Grass/Poison-type Pokémon known for the plant bulb on its back."
    },{ 
      src: "poki/25.svg",
      price: 4,
      name: "Pikachu",
      description: "The iconic Electric-type Pokemon known worldwide for its cute appearance and lightning abilities"
    },
    { 
      src: "/poki/78.svg", 
      price: 5,
      name: "Rapidash",
      description: "A majestic Fire-type Pokemon that can run at incredible speeds with its flaming mane"
    },
    { 
      src: "/poki/45.svg", 
      price: 6,
      name: "Vileplume",
      description: "A Grass/Poison-type Pokemon with a large flower that releases toxic pollen"
    },
    { 
      src: "/poki/17.svg", 
      price: 7,
      name: "Pidgeotto",
      description: "A Normal/Flying-type Pokemon that searches for prey from the skies"
    },
    { 
      src: "/poki/445.svg", 
      price: 8,
      name: "Garchomp",
      description: "A powerful Dragon/Ground-type Pokemon that can fly as fast as a jet plane"
    },
    { 
      src: "/poki/323.svg", 
      price: 9,
      name: "Camerupt",
      description: "A Fire/Ground-type Pokemon with volcanoes on its back that can erupt"
    },
    { 
      src: "/poki/81.svg", 
      price: 10,
      name: "Magnemite",
      description: "An Electric/Steel-type Pokemon that floats using electromagnetic waves"
    },
    { 
      src: "/poki/100.svg", 
      price: 11,
      name: "Voltorb",
      description: "An Electric-type Pokemon that looks like a Poké Ball and may self-destruct"
    },
    { 
      src: "/poki/143.svg", 
      price: 12,
      name: "Snorlax",
      description: "A Normal-type Pokemon known for its huge size and peaceful sleeping habits"
    },
    { 
      src: "/poki/135.svg", 
      price: 13,
      name: "Jolteon",
      description: "An Electric-type evolution of Eevee with spiky electric fur"
    },
    { 
      src: "/poki/111.svg", 
      price: 14,
      name: "Rhyhorn",
      description: "A Ground/Rock-type Pokemon with a tough hide and powerful charging ability"
    },
    { 
      src: "/poki/249.svg", 
      price: 15,
      name: "Lugia",
      description: "A legendary Psychic/Flying-type Pokemon that can calm raging storms"
    },
    { 
      src: "/poki/10.svg", 
      price: 16,
      name: "Caterpie",
      description: "A Bug-type Pokemon that evolves quickly and releases a strong odor from its antennae"
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Pokemon NFT Marketplace</h1>
      <h2 className=' text-center'>*Please try on Devnet*</h2><br/>
      
      <div className="flex justify-center mb-8">
        {connected ? (
          <button 
            onClick={disconnectWallet} 
            className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition-colors duration-200"
          >
            Disconnect Wallet
          </button>
        ) : (
          <button 
            onClick={connectWallet} 
            className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-200"
          >
            Connect Wallet
          </button>
        )}
      </div>
      
      {address && (
        <div className="text-center mb-8">
          <p className="text-lg font-medium">Connected Wallet: {formatAddress(address)}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-8 text-center">
          <p>{error}</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {NFT_DATA.map((nft, index) => (
          <NFTCard 
            key={index} 
            index={index} 
            src={nft.src} 
            price={nft.price} 
            name={nft.name} 
            description={nft.description}
            isWalletConnected={connected}
            onBuyClick={handleTransaction}
            isLoading={isLoading}
          />
        ))}
      </div>

      {txHash && (
        <div className="mt-8 text-center">
          <p className="text-lg">Transaction Hash:</p>
          <p className="text-blue-500 break-words">{txHash}</p>
        </div>
      )}
    </div>
  );
};

export default NFTMarketplace;
