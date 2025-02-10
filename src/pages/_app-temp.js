// pages/_app.tsx
import { AppProps } from 'next/app';
import { StyleGuideProvider } from '../context/StyleGuideContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StyleGuideProvider>
      <Component {...pageProps} />
    </StyleGuideProvider>
  );
}

export default MyApp;