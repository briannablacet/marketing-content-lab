// src/pages/_app.js
import { MarketingProgramProvider } from '../context/MarketingContext';
import { WalkthroughProvider } from '../context/WalkthroughContext';
import { SDRProvider } from '../context/SDRContext';
import { ContentProvider } from '../context/ContentContext';
import '../styles/globals.css';
import Navbar from '../components/shared/Navbar';

function MyApp({ Component, pageProps }) {
  return (
    <MarketingProgramProvider>
      <WalkthroughProvider>
        <SDRProvider>
          <ContentProvider>
            <Navbar />
            <Component {...pageProps} />
          </ContentProvider>
        </SDRProvider>
      </WalkthroughProvider>
    </MarketingProgramProvider>
  );
}

export default MyApp;