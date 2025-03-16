import React, { use } from 'react';
import Page from "./index";

export async function generateStaticParams() {
  // Contoh: ambil daftar WhatsApp ID dari API atau database
  const waIds = ['6281228883616', '628977663923']; // Ganti dengan ID yang valid
  
  return waIds.map((id) => ({
    whatsApp: id,
  }));
}

const TokoPage = ({ params }) => {
  const { whatsApp } = use(params);

  return <Page whatsApp={whatsApp} />;
};

export default TokoPage;

