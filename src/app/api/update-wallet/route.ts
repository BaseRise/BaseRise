import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Service role client — bypasses RLS for server-side DB operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    // 1. 🛡️ Auth Check — Extract & verify Supabase session token
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user?.email) {
      return NextResponse.json(
        { error: "Invalid or expired session" },
        { status: 401 }
      );
    }

    const { walletAddress } = await req.json();

    // 2. Validate wallet address
    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    const walletRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!walletRegex.test(walletAddress)) {
      return NextResponse.json(
        { error: "Invalid wallet address format" },
        { status: 400 }
      );
    }

    // 3. Normalize to lowercase (checksum-safe storage)
    const normalizedWallet = walletAddress.toLowerCase();
    const userEmail = user.email.toLowerCase();

    // 4. Check if this wallet is already linked to ANOTHER account
    const { data: existingWallet, error: walletCheckError } = await supabaseAdmin
      .from("waitlist")
      .select("email")
      .eq("wallet_address", normalizedWallet)
      .neq("email", userEmail)
      .maybeSingle();

    if (walletCheckError) {
      console.error("Wallet check error:", walletCheckError);
      return NextResponse.json(
        { error: "Database error while checking wallet" },
        { status: 500 }
      );
    }

    if (existingWallet) {
      return NextResponse.json(
        { error: "This wallet is already linked to another account" },
        { status: 409 }
      );
    }

    // 5. Update wallet address for authenticated user
    const { data, error } = await supabaseAdmin
      .from("waitlist")
      .update({ wallet_address: normalizedWallet })
      .eq("email", userEmail)
      .eq("is_verified", true)
      .select("email, wallet_address")
      .maybeSingle();

    if (error) {
      console.error("Update error:", error);
      return NextResponse.json(
        { error: "Failed to update wallet address" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "User not found or not verified in waitlist" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Wallet linked successfully",
        wallet_address: data.wallet_address,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET: Fetch current linked wallet for authenticated user
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user?.email) {
      return NextResponse.json(
        { error: "Invalid or expired session" },
        { status: 401 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("waitlist")
      .select("wallet_address")
      .eq("email", user.email.toLowerCase())
      .maybeSingle();

    if (error) {
      console.error("Fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch wallet" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        wallet_address: data?.wallet_address || null,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}