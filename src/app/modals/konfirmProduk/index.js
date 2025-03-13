import Modals from '@/app/components/Modals';
import React, { Fragment, useEffect } from 'react';

const Index = (props) => {
  const { show, onClose, message, handleBtn, btnTitle } = props;

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose(); // Tutup modal setelah 5 detik
      }, 5000);

      return () => clearTimeout(timer); // Bersihkan timeout jika modal ditutup sebelum 5 detik
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <Modals
      show={show}
      onClose={onClose}
      classModalBody="p-0"
      classModalContent="p-3"
      modalBackdrop={false}
      scrolls={true}
      styleModalContent={{
        background: 'rgba(0, 0, 0, 0.55)', // Gunakan rgba agar transparansi berfungsi
        color: '#fff'
      }}
      position="top"
      modalBody={
        <Fragment>
          <div className="d-flex justify-content-between">
            <div>{message}</div>
            <button onClick={handleBtn} type="button" className="btn btn-primary w-25">
              {btnTitle}
            </button>
          </div>
        </Fragment>
      }
    />
  );
};

export default Index;
