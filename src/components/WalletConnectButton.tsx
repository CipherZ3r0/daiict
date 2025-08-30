// src/components/WalletConnectButton.tsx - MetaMask wallet connection component
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { connectWallet, disconnectWallet, getWalletInfo } from '@/lib/blockchain'
import { Wallet, WalletCards, AlertTriangle, Key } from 'lucide-react'

interface WalletInfo {
  address: string
  balance: string
  chainId: number
  chainName: string
}

interface WalletConnectButtonProps {
  userRole: string
}

export default function WalletConnectButton({ userRole }: WalletConnectButtonProps) {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [showDevModal, setShowDevModal] = useState(false)
  const [devPrivateKey, setDevPrivateKey] = useState('')
  const [devPassphrase, setDevPassphrase] = useState('')
  const { toast } = useToast()

  // Hide wallet button for Auditors
  if (userRole === 'Auditor') {
    return null
  }

  useEffect(() => {
    // Check if wallet is already connected
    const checkWalletConnection = async () => {
      try {
        const info = await getWalletInfo()
        if (info) {
          setWalletInfo(info)
        }
      } catch (error) {
        // Wallet not connected or not available
      }
    }

    checkWalletConnection()
  }, [])

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      const info = await connectWallet()
      setWalletInfo(info)
      toast({
        title: "Wallet Connected",
        description: `Connected to ${info.address.slice(0, 6)}...${info.address.slice(-4)}`
      })
    } catch (error: any) {
      console.error('Wallet connection error:', error)
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive"
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnectWallet()
      setWalletInfo(null)
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to disconnect wallet",
        variant: "destructive"
      })
    }
  }

  const handleDevWalletConnect = async () => {
    if (!devPrivateKey.trim() || !devPassphrase.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both private key and passphrase",
        variant: "destructive"
      })
      return
    }

    try {
      // TODO: Implement dev wallet connection with private key
      // For now, create a simulated wallet
      const mockWalletInfo: WalletInfo = {
        address: `0x${Math.random().toString(16).slice(2, 42)}`,
        balance: '1.5',
        chainId: 80001,
        chainName: 'Mumbai Testnet'
      }

      setWalletInfo(mockWalletInfo)
      setShowDevModal(false)
      setDevPrivateKey('')
      setDevPassphrase('')

      toast({
        title: "Dev Wallet Connected",
        description: "Development wallet connected successfully"
      })
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect dev wallet",
        variant: "destructive"
      })
    }
  }

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (walletInfo) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden md:flex flex-col items-end">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {walletInfo.chainName}
            </Badge>
            <span className="text-sm font-mono text-gray-600">
              {truncateAddress(walletInfo.address)}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {walletInfo.balance} ETH
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={handleDisconnect}>
          <Wallet className="h-4 w-4 mr-2" />
          <span className="hidden md:inline">Disconnect</span>
          <span className="md:hidden">
            {truncateAddress(walletInfo.address)}
          </span>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button onClick={handleConnect} disabled={isConnecting} size="sm">
        <WalletCards className="h-4 w-4 mr-2" />
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>

      {/* Dev Mode - Private Key Option */}
      {process.env.NODE_ENV === 'development' && (
        <Dialog open={showDevModal} onOpenChange={setShowDevModal}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-gray-500">
              <Key className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Development Mode Only
              </DialogTitle>
              <DialogDescription>
                Connect using a private key. This is for development only and should never be used in production.
              </DialogDescription>
            </DialogHeader>

            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Security Warning:</strong> Never share your private key. This feature is for development testing only.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <Label htmlFor="privateKey">Private Key</Label>
                <Input
                  id="privateKey"
                  type="password"
                  value={devPrivateKey}
                  onChange={(e) => setDevPrivateKey(e.target.value)}
                  placeholder="Enter private key (without 0x prefix)"
                />
              </div>

              <div>
                <Label htmlFor="passphrase">Passphrase</Label>
                <Input
                  id="passphrase"
                  type="password"
                  value={devPassphrase}
                  onChange={(e) => setDevPassphrase(e.target.value)}
                  placeholder="Enter passphrase for encryption"
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  type="button" 
                  onClick={handleDevWalletConnect}
                  className="flex-1"
                  disabled={!devPrivateKey.trim() || !devPassphrase.trim()}
                >
                  Connect Dev Wallet
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowDevModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}