// src/lib/blockchain.ts - Blockchain interaction helpers using ethers.js

import { BrowserProvider, Signer, Contract, parseEther, formatEther } from 'ethers';
import { verifyTransactionOnChain } from './api';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface WalletInfo {
  address: string;
  balance: string;
  chainId: number;
  chainName: string;
  isSimulated?: boolean;
}

let provider: BrowserProvider | null = null;
let signer: Signer | null = null;
let currentWallet: WalletInfo | null = null;

// Check if MetaMask is available
export function isMetaMaskAvailable(): boolean {
  return typeof window !== 'undefined' && window.ethereum?.isMetaMask;
}

// Connect wallet (MetaMask preferred, fallback to dev mode)
export async function connectWallet(): Promise<WalletInfo> {
  if (isMetaMaskAvailable()) {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      provider = new BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
      
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      const network = await provider.getNetwork();
      
      currentWallet = {
        address,
        balance: formatEther(balance),
        chainId: Number(network.chainId),
        chainName: getChainName(Number(network.chainId))
      };
      
      // Listen for account changes
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      
      return currentWallet;
    } catch (error) {
      console.error('MetaMask connection failed:', error);
      throw new Error('Failed to connect to MetaMask');
    }
  } else {
    // Fallback to simulated wallet for development
    return connectSimulatedWallet();
  }
}

// Simulated wallet connection for development/testing
export function connectSimulatedWallet(): WalletInfo {
  const simulatedAddress = '0x' + Math.random().toString(16).substring(2, 42);
  currentWallet = {
    address: simulatedAddress,
    balance: '10.0',
    chainId: 80001, // Mumbai testnet
    chainName: 'Polygon Mumbai (Simulated)',
    isSimulated: true
  };
  return currentWallet;
}

// Disconnect wallet
export function disconnectWallet(): void {
  if (window.ethereum) {
    window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    window.ethereum.removeListener('chainChanged', handleChainChanged);
  }
  provider = null;
  signer = null;
  currentWallet = null;
}

// Get current wallet info
export function getCurrentWallet(): WalletInfo | null {
  return currentWallet;
}

// Handle account changes
function handleAccountsChanged(accounts: string[]): void {
  if (accounts.length === 0) {
    disconnectWallet();
  } else {
    // Reconnect with new account
    connectWallet().catch(console.error);
  }
}

// Handle chain changes
function handleChainChanged(chainId: string): void {
  // Reconnect to update chain info
  connectWallet().catch(console.error);
}

// Get chain name from chain ID
function getChainName(chainId: number): string {
  const chainNames: Record<number, string> = {
    1: 'Ethereum Mainnet',
    137: 'Polygon Mainnet',
    80001: 'Polygon Mumbai',
    5: 'Ethereum Goerli',
    11155111: 'Ethereum Sepolia'
  };
  return chainNames[chainId] || `Chain ${chainId}`;
}

// TODO: Replace with actual contract ABI and address
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';
const CONTRACT_ABI = [
  // TODO: Add actual contract ABI here
  'function lockFunds(string memory projectId, uint256 amountInWei) external payable',
  'function approveMilestoneOnChain(string memory projectId, uint256 milestoneIndex) external',
  'function releaseFunds(string memory projectId, uint256 milestoneIndex) external',
  'event ProjectApproved(string projectId, address contractAddress)',
  'event MilestoneVerified(string projectId, uint256 milestoneIndex)',
  'event FundsReleased(string projectId, uint256 milestoneIndex, bytes32 txHash)'
];

// Lock funds for a project (Government function)
export async function lockFunds(projectId: string, amountInEth: number): Promise<string> {
  if (!signer) throw new Error('Wallet not connected');
  
  if (currentWallet?.isSimulated) {
    // Simulate transaction for dev mode
    const mockTxHash = '0x' + Math.random().toString(16).substring(2, 66);
    console.log(`[SIMULATED] Locking ${amountInEth} ETH for project ${projectId}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return mockTxHash;
  }
  
  try {
    const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    const amountInWei = parseEther(amountInEth.toString());
    
    const tx = await contract.lockFunds(projectId, amountInWei, {
      value: amountInWei
    });
    
    console.log('Transaction submitted:', tx.hash);
    
    // Wait for transaction to be mined
    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt);
    
    // Verify transaction on backend
    try {
      await verifyTransactionOnChain(tx.hash);
    } catch (error) {
      console.warn('Failed to verify transaction on backend:', error);
    }
    
    return tx.hash;
  } catch (error) {
    console.error('Lock funds transaction failed:', error);
    throw new Error('Failed to lock funds on blockchain');
  }
}

// Approve milestone on-chain (optional, depending on contract design)
export async function approveMilestoneOnChain(projectId: string, milestoneIndex: number): Promise<string> {
  if (!signer) throw new Error('Wallet not connected');
  
  if (currentWallet?.isSimulated) {
    const mockTxHash = '0x' + Math.random().toString(16).substring(2, 66);
    console.log(`[SIMULATED] Approving milestone ${milestoneIndex} for project ${projectId}`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    return mockTxHash;
  }
  
  try {
    const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    const tx = await contract.approveMilestoneOnChain(projectId, milestoneIndex);
    
    const receipt = await tx.wait();
    console.log('Milestone approved on-chain:', receipt);
    
    // Verify transaction on backend
    try {
      await verifyTransactionOnChain(tx.hash);
    } catch (error) {
      console.warn('Failed to verify transaction on backend:', error);
    }
    
    return tx.hash;
  } catch (error) {
    console.error('Approve milestone transaction failed:', error);
    throw new Error('Failed to approve milestone on blockchain');
  }
}

// Release funds for milestone (Government function)
export async function releaseFunds(projectId: string, milestoneIndex: number): Promise<string> {
  if (!signer) throw new Error('Wallet not connected');
  
  if (currentWallet?.isSimulated) {
    const mockTxHash = '0x' + Math.random().toString(16).substring(2, 66);
    console.log(`[SIMULATED] Releasing funds for milestone ${milestoneIndex} of project ${projectId}`);
    await new Promise(resolve => setTimeout(resolve, 2500));
    return mockTxHash;
  }
  
  try {
    const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    const tx = await contract.releaseFunds(projectId, milestoneIndex);
    
    const receipt = await tx.wait();
    console.log('Funds released:', receipt);
    
    // Verify transaction on backend
    try {
      await verifyTransactionOnChain(tx.hash);
    } catch (error) {
      console.warn('Failed to verify transaction on backend:', error);
    }
    
    return tx.hash;
  } catch (error) {
    console.error('Release funds transaction failed:', error);
    throw new Error('Failed to release funds on blockchain');
  }
}

// Sign and send custom transaction
export async function signAndSend(to: string, data: string, value?: string): Promise<string> {
  if (!signer) throw new Error('Wallet not connected');
  
  if (currentWallet?.isSimulated) {
    const mockTxHash = '0x' + Math.random().toString(16).substring(2, 66);
    console.log(`[SIMULATED] Sending transaction to ${to}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockTxHash;
  }
  
  try {
    const tx = await signer.sendTransaction({
      to,
      data,
      value: value ? parseEther(value) : undefined
    });
    
    const receipt = await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
}

// Wait for transaction confirmation
export async function waitForTransaction(txHash: string): Promise<any> {
  if (!provider) throw new Error('Provider not available');
  
  if (currentWallet?.isSimulated) {
    console.log(`[SIMULATED] Waiting for transaction ${txHash}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      transactionHash: txHash,
      blockNumber: Math.floor(Math.random() * 1000000),
      status: 1
    };
  }
  
  try {
    return await provider.waitForTransaction(txHash);
  } catch (error) {
    console.error('Failed to wait for transaction:', error);
    throw error;
  }
}

// Get block explorer URL for transaction
export function getBlockExplorerUrl(txHash: string, chainId?: number): string {
  const currentChainId = chainId || currentWallet?.chainId || 80001;
  
  const explorerUrls: Record<number, string> = {
    1: 'https://etherscan.io/tx/',
    137: 'https://polygonscan.com/tx/',
    80001: 'https://mumbai.polygonscan.com/tx/',
    5: 'https://goerli.etherscan.io/tx/',
    11155111: 'https://sepolia.etherscan.io/tx/'
  };
  
  const baseUrl = explorerUrls[currentChainId] || explorerUrls[80001]; // Default to Mumbai
  return `${baseUrl}${txHash}`;
}