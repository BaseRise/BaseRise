"use client";

import { ConnectKitButton } from "connectkit";
import { Loader2, Wallet, RefreshCw } from "lucide-react";
import { useDisconnect, useAccount } from "wagmi";
import { useEffect, useRef } from "react";

interface ConnectWalletButtonProps {
    showChange?: boolean;
    onWalletConnected?: (address: string) => void;
    onWalletDisconnected?: () => void;
}

export const ConnectWalletButton = ({
    showChange = false,
    onWalletConnected,
    onWalletDisconnected,
}: ConnectWalletButtonProps) => {
    const { disconnect } = useDisconnect();
    const { address, isConnected } = useAccount();
    const prevAddressRef = useRef<string | undefined>(undefined);

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

    return (
        <div className="flex items-center gap-2">
            <ConnectKitButton.Custom>
                {({ isConnected, show, truncatedAddress, ensName, isConnecting }) => {
                    return (
                        <button
                            onClick={show}
                            className="px-4 md:px-5 py-2 md:py-2.5 bg-gradient-to-r from-[#2563EB] to-[#1E3A8A] text-white font-semibold rounded-full text-xs md:text-sm hover:from-[#3B82F6] hover:to-[#2563EB] transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] flex items-center gap-2 border border-white/10"
                        >
                            {isConnecting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Connecting...</span>
                                </>
                            ) : isConnected ? (
                                <>
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span>{ensName ?? truncatedAddress}</span>
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
            {showChange && (
                <ConnectKitButton.Custom>
                    {({ isConnected }) =>
                        isConnected ? (
                            <button
                                onClick={() => disconnect()}
                                className="px-3 py-2 md:py-2.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full transition-all flex items-center gap-1.5"
                                title="Disconnect current wallet to connect a different one"
                            >
                                <RefreshCw className="w-3 h-3" />
                                <span>Change</span>
                            </button>
                        ) : null
                    }
                </ConnectKitButton.Custom>
            )}
        </div>
    );
};
