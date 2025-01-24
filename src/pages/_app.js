// src/pages/_app.js
import MarketingProgramProvider from '../context/MarketingProgramContext';
import { WalkthroughProvider } from '../context/WalkthroughContext';
import '../styles/globals.css';
import Navbar from '../components/shared/Navbar';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;