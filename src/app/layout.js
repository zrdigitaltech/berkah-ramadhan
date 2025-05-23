import React, { Suspense } from 'react';
import ReduxProvider from '@/app/redux/provider';

import '@/app/styles/scss/style.scss';

import Loading from '@/app/components/Loading';
import Heads from '@/app/components/Head';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

import FloatingWhatsApp from '@/app/components/FloatingWhatsApp';
const domain = process.env.NEXT_PUBLIC_DOMAIN;

export const metadata = {
  authors: [{ name: 'ZRdigitalTech' }],
  keywords: ['Jual Cokelat', 'Jual Kaos', 'Jual Kue', 'ZRdigitalTech', 'Zikri Ramdani'],
  manifest: `${domain}/manifest.json`,
  title: 'Yuk, temukan yang kamu butuhkan! | VandZ15',
  description:
    'Tersedia berbagai pilihan cemilan lezat dan koleksi fashion trendi untuk melengkapi harimu.',
  openGraph: {
    url: domain,
    images: `${domain}/assets/images/vandz15.png`
  }
};

export const viewport = {
  themeColor: '#ffffff'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Heads
        title={metadata.title}
        description={metadata.description}
        author={metadata.authors}
        keywords={metadata.keywords}
        themecolor={viewport.themeColor}
        manifest={metadata.manifest}
        url={metadata.openGraph.url}
        image={metadata.openGraph.images}
      />
      <body>
        <ReduxProvider>
          <Navbar />
          <Suspense fallback={<Loading />}>{children}</Suspense>
          <Footer />
          <FloatingWhatsApp />
        </ReduxProvider>
      </body>
    </html>
  );
}
