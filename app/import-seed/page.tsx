"use client";
import ImportWallet from "@/components/ImportSeed";
import React from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  const handleImportFinished = () => {
    // This function runs when the wallet is secured
    console.log("Wallet imported successfully!");
    router.push("/dashboard"); // Redirect to your dashboard route
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <ImportWallet onImportSuccess={handleImportFinished} />
    </div>
  );
};

export default Page;
