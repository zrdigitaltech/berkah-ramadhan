'use client';
import React, { Fragment, useEffect } from 'react';
import { FloatingWhatsApp } from 'react-floating-whatsapp';

import { useSelector, useDispatch } from 'react-redux';
import { getListFloatingWhatsapp } from '@/app/redux/action/floatingWhatsapp/creator';
import { usePathname } from 'next/navigation';

const Index = () => {
  const domain = process.env.NEXT_PUBLIC_DOMAIN; // Access the environment variables
  const floatingWhatsAppList = useSelector((state) => state.floatingWhatsapp.floatingWhatsappList);
  const dispatch = useDispatch();
  const pathname = usePathname();

  const fetchFloatingWhatsApp = async () => {
    dispatch(getListFloatingWhatsapp());
  };

  useEffect(() => {
    fetchFloatingWhatsApp();
  });
  return (
    <Fragment>
      {pathname !== '/keranjang' && (
        <FloatingWhatsApp
          avatar={domain + floatingWhatsAppList?.avatar}
          phoneNumber={floatingWhatsAppList?.phone_number}
          accountName={floatingWhatsAppList?.account_name}
          chatMessage={floatingWhatsAppList?.chat_message}
          statusMessage={floatingWhatsAppList?.status_message}
          darkMode={true}
          placeholder="Ketik pesan..."
          // allowEsc={true}
          // allowClickAway
          // notification
          // notificationDelay={60000} // 1 minute
          // notificationSound
          styles={{
            position: 'fixed',
            bottom: '15px',
            height: '0px !important',
            fontSize: '14px'
          }}
        />
      )}
    </Fragment>
  );
};

export default Index;
