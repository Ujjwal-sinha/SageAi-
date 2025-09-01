"use client";

import { useState } from "react";
import { Check, CreditCard, Zap } from "lucide-react";
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
  // Utility Token purchase options
  const tokenPackages = [
    {
      name: "Starter Pack",
      description: "For trying out BlockSynth AI features",
      tokens: 100,
      price: 5,
      highlight: false,
    },
    {
      name: "Pro Pack",
      description: "Best for regular users and builders",
      tokens: 1000,
      price: 40,
      highlight: true,
    },
    {
      name: "Whale Pack",
      description: "For power users and teams",
      tokens: 10000,
      price: 350,
      highlight: false,
    },
  ];

  return (
    <section className="py-20 relative bg-[#0f0f0f]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-6">
          <div className="mb-4 p-3 bg-yellow-200/10 border border-yellow-400/30 rounded-lg text-yellow-300 font-semibold text-base">
            Pricing section is in development now!! Please do not attempt to buy tokens yet.
          </div>
        </div>
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-white mb-3">
            Buy{" "}
            <span className="text-purple-400">Utility Tokens</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Purchase BSGPT Utility Tokens to unlock premium AI features.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {tokenPackages.map((pkg, idx) => (
            <Card
              key={idx}
              className={`relative bg-[#1a1a1a] border border-gray-800 hover:border-purple-500/50 transition-all duration-300 ${
                pkg.highlight
                  ? "scale-[1.03] shadow-xl border-purple-500/30"
                  : ""
              } rounded-2xl overflow-hidden`}
            >
              {pkg.highlight && (
                <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                  MOST POPULAR
                </div>
              )}
              <CardHeader className="p-6">
                <CardTitle className="text-xl text-white">
                  {pkg.name}
                </CardTitle>
                <CardDescription className="text-gray-400 mt-1">
                  {pkg.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="mb-6 flex items-end gap-2">
                  <span className="text-4xl font-extrabold text-white">
                    {pkg.tokens}
                  </span>
                  <span className="text-purple-400 font-bold text-lg">
                    BSGPT
                  </span>
                </div>
                <div className="mb-6">
                  <span className="text-2xl font-bold text-white">
                    ${pkg.price}
                  </span>
                  <span className="ml-1 text-gray-400 text-sm">USD</span>
                </div>
                <Button
                  className={`w-full py-2 text-white ${
                    pkg.highlight
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90"
                      : "bg-gray-800 hover:bg-gray-700"
                  } rounded-lg font-semibold`}
                  onClick={() =>
                    window.open(
                      "https://forms.gle/2Qn2Qw6Qw6Qw6Qw6A",
                      "_blank"
                    )
                  }
                >
                  Buy Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-10 text-gray-400 text-sm">
          Need a custom amount or have questions?{" "}
          <a
            href="mailto:support@blocksynth.ai"
            className="text-purple-400 underline"
          >
            Contact us
          </a>
        </div>
      </div>
    </section>
  );
}
