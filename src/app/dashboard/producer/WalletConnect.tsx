"use client";

import { useState } from "react";
import { ethers } from "ethers";

// Add ethereum to the Window type
declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function WalletConnect() {
  const [wallet, setWallet] = useState<string>("");

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Install MetaMask!");
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    setWallet(address);

    // Save wallet to backend
    await fetch("/api/users/wallet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress: address }),
    });
  };

  return (
    <div className="flex flex-col space-y-4">
      {wallet ? (
        <div>Connected Wallet: {wallet}</div>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-yellow-600 text-white px-4 py-2 rounded"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
