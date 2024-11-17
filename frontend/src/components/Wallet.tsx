import React, { useState } from 'react';
import { PetraWallet } from 'petra-plugin-wallet-adapter';

const WalletConnectButton: React.FC = () => {
    const [wallet, setWallet] = useState<PetraWallet | null>(null);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConnect = async () => {
        const petraWallet = new PetraWallet();

        try {
            await petraWallet.connect();
            setWallet(petraWallet);
            setConnected(true);
            setError(null);
        } catch (err) {
            setError('Failed to connect wallet');
            console.error(err);
        }
    };

    return (
        <div>
            {connected ? (
                <p>Connected to Petra Wallet</p>
            ) : (
                <button onClick={handleConnect}>Connect Petra Wallet</button>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export const Wallet: React.FC = () => {
    return (
        <div>
            <WalletConnectButton />
        </div>
    );
};
