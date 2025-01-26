// src/pages/_app.js
import { MarketingProgramProvider } from '../context/MarketingContext';
import { WalkthroughProvider } from '../context/WalkthroughContext';
import { SDRProvider } from '../context/SDRContext';
import '../styles/globals.css';
import Navbar from '../components/shared/Navbar';

function MyApp({ Component, pageProps }) {
  return (
    <MarketingProgramProvider>
      <WalkthroughProvider>
        <SDRProvider>
          <Navbar />
          <Component {...pageProps} />
        </SDRProvider>
      </WalkthroughProvider>
    </MarketingProgramProvider>
  );
}

export default MyApp;