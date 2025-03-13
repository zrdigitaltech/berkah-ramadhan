import Modals from '@/app/components/Modals';
import React, { Fragment, useEffect } from 'react';
import Link from 'next/link';
import './statusKeranjang.scss';

const Index = (props) => {
  const { show, onClose, product } = props;
  const domain = process.env.NEXT_PUBLIC_DOMAIN; // Access the environment variables

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        onClose(); // Tutup modal setelah 5 detik
      }, 5000);

      return () => clearTimeout(timer); // Bersihkan timeout jika modal ditutup sebelum 5 detik
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <Modals
      title="Berhasil Ditambahkan"
      show={show}
      onClose={onClose}
      onCloseBackDrop={onClose}
      modalBody={
        <Fragment>
          <div className="d-flex align-items-center gap-3 card">
            <div className="card-image">
              <img
                src={
                  product?.images?.startsWith('/assets/images/')
                    ? domain + product.images
                    : product?.images || 'https://placehold.co/1024x1024'
                }
                alt={product?.name}
              />
            </div>
            <div className="card-details text-truncate">
              <span className="card-name text-truncate" title={product?.name}>
                {product?.name}
              </span>
              <span className="card-size">
                {product?.variant?.jumlah} {product?.variant?.nama_berat}
              </span>
            </div>
          </div>
        </Fragment>
      }
      modalFooter={
        <Fragment>
          <Link
            href="/keranjang"
            onClick={onClose}
            type="button"
            className="btn btn-primary m-auto"
          >
            Lihat Keranjang
          </Link>
        </Fragment>
      }
    />
  );
};

export default Index;
