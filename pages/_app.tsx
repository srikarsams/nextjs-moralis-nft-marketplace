import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { MoralisProvider } from 'react-moralis';
import { Header } from '../components/header/Header';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MoralisProvider initializeOnMount={false}>
      <Header />
      <Component {...pageProps} />
    </MoralisProvider>
  );
}

export default MyApp;
