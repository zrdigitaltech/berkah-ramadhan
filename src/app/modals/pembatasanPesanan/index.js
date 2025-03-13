import Modals from '@/app/components/Modals';
import React, { Fragment } from 'react';

const Index = (props) => {
  const { show, onClose } = props;

  return (
    <Modals
      title="Pemesanan Tidak Dapat Dilanjutkan"
      show={show}
      onClose={onClose}
      modalBody={
        <Fragment>
          <div className="text-center">
            Pemesanan hanya bisa dilakukan jika semua produk memiliki nomor WhatsApp yang sama.
          </div>
        </Fragment>
      }
      modalFooter={<Fragment></Fragment>}
    />
  );
};

export default Index;
