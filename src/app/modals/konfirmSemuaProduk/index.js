import Modals from '@/app/components/Modals';
import React, { Fragment } from 'react';

const Index = (props) => {
  const { show, onClose, selectItem, handleOk } = props;

  return (
    <Modals
      show={show}
      onClose={onClose}
      modalBody={
        <Fragment>
          <div className="text-center">
            <h3>Hapus {selectItem} produk?</h3>
            <span style={{ color: '#a0a0a0' }}>
              Produk yang kamu pilih akan dihapus dari Keranjang.
            </span>
          </div>
        </Fragment>
      }
      modalFooter={
        <Fragment>
          <div className="d-flex justify-content-between w-100">
            <div className="w-50">
              <button onClick={onClose} type="button" className="btn btn-outline-primary">
                Batal
              </button>
            </div>
            <div className="p-3"></div>
            <div className="w-50">
              <button type="button" onClick={handleOk} className="btn btn-primary">
                Hapus
              </button>
            </div>
          </div>
        </Fragment>
      }
    />
  );
};

export default Index;
