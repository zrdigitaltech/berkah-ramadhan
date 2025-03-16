import React, { use } from 'react';
import Page from './index';

// Data Json
import DataProducts from '@/app/redux/action/products/data-products.json';

export async function generateStaticParams() {
  // Filter hanya item yang memiliki link_wa yang valid
  const waIds = [
    ...new Set(
      DataProducts.map((item) => item.link_wa)
        .filter((wa) => wa !== null && wa !== undefined) // Hindari null & undefined
        .map((wa) => wa.toString()) // Konversi ke string setelah filtering
    )
  ];

  return waIds.map((whatsApp) => ({
    whatsApp
  }));
}

const TokoPage = ({ params }) => {
  const { whatsApp } = use(params);

  return <Page whatsApp={whatsApp} />;
};

export default TokoPage;
