// src/pages/_app.tsx
import type { AppProps } from 'next/app';
import { StyleGuideProvider } from '../context/StyleGuideContext';
import { MarketingProgramProvider } from '../context/MarketingContext';
import { ContentProvider } from '../context/ContentContext';
import Navbar from '../components/shared/Navbar'; // ✅ Import Navbar
import '../styles/globals.css';

// Note: MongoDB connection is handled in lib/mongodb.ts
// Connection string is stored in .env.local

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MarketingProgramProvider>
      <StyleGuideProvider>
        <ContentProvider>
          <>
            <Navbar /> {/* ✅ Added Navbar here */}
            <Component {...pageProps} />
          </>
        </ContentProvider>
      </StyleGuideProvider>
    </MarketingProgramProvider>
  );
}

export default MyApp;
