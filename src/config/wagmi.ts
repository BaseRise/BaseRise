// src/config/wagmi.ts
import { getDefaultConfig } from "connectkit";
import { createConfig, http } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";

export const config = createConfig(
    getDefaultConfig({
        // Your dApps chains
        chains: [base, baseSepolia], // Base for Mainnet, Base Sepolia for Testing
        transports: {
            // RPC URLs for each chain
            [base.id]: http(),
            [baseSepolia.id]: http(),
        },

        // Required info
        walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",

        // Required App Info
        appName: "BRISE",

        // Optional App Info
        appDescription: "Next-generation blockchain platform on Base",
        appUrl: "https://baserise.online", // Your domain
        appIcon: "https://baserise.online/favicon.ico",

        // Disable "Continue with Family" wallet option
        enableFamily: false,
    }),
);