'use client';

import React, { useEffect } from 'react';
import Beranda from '@/app/pages/Beranda';

import AOS from 'aos';
import 'aos/dist/aos.css';

import '@/app/styles/scss/style.scss';

export default function Home() {
  useEffect(() => {
    AOS.init();
  });

  return <Beranda />;
}
