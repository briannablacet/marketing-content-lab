// src/pages/_app.tsx
import { AppProps } from 'next/app';
import { WritingStyleProvider } from '../context/WritingStyleContext';
import { MarketingProgramProvider } from '../context/MarketingContext';
import { WalkthroughProvider } from '../context/WalkthroughContext';
import { SDRProvider } from '../context/SDRContext';
import '../styles/globals.css';
import Navbar from '../components/shared/Navbar';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    // These providers wrap your entire app to provide context
    <MarketingProgramProvider>
      <WalkthroughProvider>
        <WritingStyleProvider>
          <SDRProvider>
            <Navbar />
            <Component {...pageProps} />
          </SDRProvider>
        </WritingStyleProvider>
      </WalkthroughProvider>
    </MarketingProgramProvider>
  );
}

export default MyApp;