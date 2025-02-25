import ReduxProvider from '@/app/redux/provider';
import Head from 'next/head';
import Script from 'next/script';

export const metadata = {
  // Basic metas
  authors: [{ name: 'ZRDevelopers' }],
  keywords: ['Jual Cokelat', 'Jual Kaos', 'ZRDevelopers', 'Zikri Ramdani'],
  manifest: '/berkah-ramadhan/manifest.json',
  // Page Title
  title: 'Yuk, temukan yang kamu butuhkan! | VandZ15',
  description:
    'Tersedia berbagai pilihan cokelat lezat dan koleksi fashion trendi untuk melengkapi harimu.',
  openGraph: {
    url: 'https://zrdevelopers.github.io/berkah-ramadhan',
    images: 'https://zrdevelopers.github.io/berkah-ramadhan/assets/images/vandz15.png'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head></Head>
      <body>
        <ReduxProvider>
          {children}
          {/* <Scripts /> */}
        </ReduxProvider>
      </body>
    </html>
  );
}
