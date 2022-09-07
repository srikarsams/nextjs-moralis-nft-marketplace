import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { MoralisProvider } from 'react-moralis';
import { Header } from '../components/header/Header';
import Head from 'next/head';
import { NotificationProvider } from 'web3uikit';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MoralisProvider
      appId={process.env.NEXT_PUBLIC_MORALIS_APP_ID || ''}
      serverUrl={process.env.NEXT_PUBLIC_MORALIS_SERVER_URL || ''}
    >
      <NotificationProvider>
        <div className="mx-auto container">
          <Head>
            <title>NFT Marketplace</title>
          </Head>
          <Header />
          <Component {...pageProps} />
        </div>
      </NotificationProvider>
    </MoralisProvider>
  );
}

export default MyApp;
