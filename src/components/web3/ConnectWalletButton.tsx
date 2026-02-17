"use client";

import { ConnectKitButton } from "connectkit";
import { Loader2, Wallet, RefreshCw } from "lucide-react";
import { useDisconnect, useAccount, useBalance } from "wagmi";
import { useEffect, useRef } from "react";

interface ConnectWalletButtonProps {
    showChange?: boolean;
    savedWallet?: string | null; // DB-saved wallet address
    onWalletConnected?: (address: string) => void;
    onWalletDisconnected?: () => void;
}

export const ConnectWalletButton = ({
    showChange = false,
    savedWallet,
    onWalletConnected,
    onWalletDisconnected,
}: ConnectWalletButtonProps) => {
    const { disconnect } = useDisconnect();
    const { address, isConnected } = useAccount();
    const prevAddressRef = useRef<string | undefined>(undefined);

    // Get ETH balance when wallet is connected via wagmi
    const { data: balanceData } = useBalance({
        address: isConnected ? address : undefined,
    });

    // Watch for wallet connection/change and notify parent
    useEffect(() => {
        if (isConnected && address && address !== prevAddressRef.current) {
            prevAddressRef.current = address;
            onWalletConnected?.(address);
        }

        if (!isConnected && prevAddressRef.current) {
            prevAddressRef.current = undefined;
            onWalletDisconnected?.();
        }
    }, [isConnected, address, onWalletConnected, onWalletDisconnected]);

    // Determine which address to display
    const displayAddress = isConnected && address
        ? address
        : savedWallet || null;

    const truncatedDisplay = displayAddress
        ? `${displayAddress.slice(0, 6)}...${displayAddress.slice(-4)}`
        : null;

    const hasWallet = isConnected || !!savedWallet;

    // Handle Change/Disconnect
    const handleDisconnect = () => {
        if (isConnected) {
            disconnect(); // Disconnect from wagmi (this triggers onWalletDisconnected via useEffect)
        } else if (savedWallet) {
            // Only DB wallet exists, not connected via wagmi
            onWalletDisconnected?.(); // Clear from DB
        }
    };

    // Format balance
    const formattedBalance = balanceData
        ? `${(Number(balanceData.value) / 10 ** balanceData.decimals).toFixed(4)} ${balanceData.symbol}`
        : null;

    return (
        <div className="flex items-center gap-2">
            <ConnectKitButton.Custom>
                {({ show, isConnecting }) => {
                    // If wagmi is connected, clicking address opens ConnectKit profile (disconnect + balance)
                    // If only DB wallet, clicking address opens ConnectKit to connect/change
                    return (
                        <button
                            onClick={show}
                            className={`px-4 md:px-5 py-2 md:py-2.5 font-semibold rounded-full text-xs md:text-sm transition-all flex items-center gap-2 border ${hasWallet
                                ? "bg-white/5 border-white/10 text-white hover:bg-white/10"
                                : "bg-gradient-to-r from-[#2563EB] to-[#1E3A8A] text-white hover:from-[#3B82F6] hover:to-[#2563EB] shadow-[0_0_15px_rgba(37,99,235,0.3)] border-white/10"
                                }`}
                        >
                            {isConnecting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Connecting...</span>
                                </>
                            ) : hasWallet ? (
                                <>
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="font-mono">{truncatedDisplay}</span>
                                    {formattedBalance && (
                                        <span className="text-gray-400 text-[10px] font-normal">
                                            ({formattedBalance})
                                        </span>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Wallet className="w-4 h-4" />
                                    <span>Connect Wallet</span>
                                </>
                            )}
                        </button>
                    );
                }}
            </ConnectKitButton.Custom>
            {showChange && hasWallet && (
                <button
                    onClick={handleDisconnect}
                    className="px-3 py-2 md:py-2.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full transition-all flex items-center gap-1.5"
                    title="Disconnect current wallet to connect a different one"
                >
                    <RefreshCw className="w-3 h-3" />
                    <span>Change</span>
                </button>
            )}
        </div>
    );
};
