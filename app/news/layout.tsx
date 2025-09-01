// app/news/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Web3 AI News Generator',
  description: 'AI-curated Web3 news from across the globe',
  keywords: 'web3, crypto, blockchain, news, AI, cryptocurrency',
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
}