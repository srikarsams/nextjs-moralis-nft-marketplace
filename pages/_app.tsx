import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { MoralisProvider } from 'react-moralis';
import { Header } from '../components/header/Header';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MoralisProvider
      appId={process.env.NEXT_PUBLIC_MORALIS_APP_ID || ''}
      serverUrl={process.env.NEXT_PUBLIC_MORALIS_SERVER_URL || ''}
    >
      <div className="max-w-6xl mx-auto">
        <Head>
          <title>NFT Marketplace</title>
        </Head>
        <Header />
        <Component {...pageProps} />
      </div>
    </MoralisProvider>
  );
}

export default MyApp;
