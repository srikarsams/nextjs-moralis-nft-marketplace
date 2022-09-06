import { ConnectButton } from 'web3uikit';
import Link from 'next/link';

export function Header() {
  return (
    <nav className="py-1 border-b-2 flex flex-row justify-between items-center">
      <h1 className="font-bold text-3xl">NFT Marketplace</h1>
      <div className="flex justify-between items-center">
        <Link href="/">
          <a className="p-6">Home</a>
        </Link>
        <Link href="/sell">
          <a className="p-6">Sell NFT</a>
        </Link>
        <ConnectButton moralisAuth={false} />
      </div>
    </nav>
  );
}
