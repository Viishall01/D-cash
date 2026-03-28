"use client";
import ImportWallet from "@/components/organisms/ImportSeed";
import React from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  const handleImportFinished = () => {
    // This function runs when the wallet is secured
    console.log("Wallet imported successfully!");
    router.push("/wallet"); // Redirect to your dashboard route
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <ImportWallet onImportSuccess={handleImportFinished} />
    </div>
  );
};

export default Page;
