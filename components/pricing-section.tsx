"use client";

import { useState } from "react";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export function PricingSection() {
  const thresholds = [
    { name: "Chatbot", utk: 1 },
    { name: "News Insights", utk: 1 },
    { name: "Ask People", utk: 2 },
    { name: "Trade Assistant", utk: 3 },
    { name: "Smart Contract Generator", utk: 5 },
    { name: "Somnia Ecosystem", utk: 9 },
    { name: "Gaming Development Bot", utk: 11 },
    { name: "Infrastructure Agents", utk: 13 },
  ];

  return (
    <section className="py-20 relative bg-[#0f0f0f]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-10">
          <div className="mb-4 p-3 bg-cyan-200/10 border border-cyan-400/30 rounded-lg text-cyan-300 font-semibold text-base flex items-center justify-center gap-2">
            <Zap className="w-5 h-5" />
            Token-gated access with UTK. Claim free test tokens to try features.
          </div>
          <h2 className="text-4xl font-bold text-white mb-3">
            Get <span className="text-cyan-400">UTK</span> to Unlock Features
          </h2>
          <p className="text-gray-400 text-lg">
            Use the faucet on Somnia Testnet to receive 100 UTK. A small amount of SOM is required for gas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {thresholds.map((t, idx) => (
            <Card key={idx} className="relative bg-[#1a1a1a] border border-gray-800 rounded-2xl overflow-hidden">
              <CardHeader className="p-6 pb-3">
                <CardTitle className="text-lg text-white">{t.name}</CardTitle>
                <CardDescription className="text-gray-400 mt-1">Required</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0 flex items-end justify-between">
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-extrabold text-white">{t.utk}</span>
                  <span className="text-cyan-400 font-bold text-base">UTK</span>
                </div>
                <div className="text-xs text-gray-500">Feature-gated</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            className="px-8 py-4 text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:opacity-90 rounded-lg font-semibold"
            onClick={() => (window.location.href = "/claim")}
          >
            Claim 100 UTK on Somnia Testnet
          </Button>
          <p className="text-gray-500 text-sm mt-4">
            Make sure your wallet is connected to Somnia Testnet.
          </p>
        </div>
      </div>
    </section>
  );
}
