'use client';

import { Fragment, useState } from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

import { LazyLoadImage } from 'react-lazy-load-image-component';

const ProductCard = (props) => {
  const { product, styles, handleFormWhatsApp } = props;

  const [varians, setVarian] = useState(null);
  const [quantity, setQuantity] = useState(1); // Default quantity
  const domain = process.env.NEXT_PUBLIC_DOMAIN; // Access the environment variable

  const handleVarian = (ID) => {
    const selectedVarian = product?.varian?.find((varian) => varian?.id === ID);

    if (selectedVarian) {
      // If the same variant is clicked, toggle it (i.e., disable it)
      if (varians?.id === selectedVarian?.id) {
        setVarian(null); // Deselect variant
      } else {
        setVarian(selectedVarian); // Select new variant
        setQuantity(1); // Reset quantity when selecting a new varian
      }
    }
  };

  const handleQuantityChange = (action) => {
    setQuantity((prev) => {
      if (action === 'increment' && prev < varians?.stok) {
        return prev + 1; // Increment the quantity
      }
      if (action === 'decrement' && prev > 1) {
        return prev - 1; // Decrement the quantity
      }
      return prev; // Return the current value if no change is needed
    });
  };

  // Calculate discount percentage for the first variant
  const calculateDiscount = (normalPrice, currentPrice) => {
    if (normalPrice && currentPrice) {
      return Math.round(((normalPrice - currentPrice) / normalPrice) * 100);
    }
    return 0;
  };

  // First variant
  const firstVarian = product?.varian?.[0];

  return (
    <div className="recipe recipe-card" style={{ position: 'relative', ...styles }}>
      {/* Show discount percentage for the first variant */}
      {firstVarian && firstVarian?.harga_normal && firstVarian?.harga && (
        <div
          className="discount-percentage"
          style={{
            position: 'absolute',
            top: '0px',
            right: '0px',
            color: 'rgb(0 255 76)',
            fontSize: '14px',
            fontWeight: 'bold',
            padding: '5px',
            borderBottomLeftRadius: '5px',
            backgroundColor: 'rgb(0 128 0 / 44%)'
          }}
        >
          -{calculateDiscount(firstVarian?.harga_normal, firstVarian?.harga)}%
        </div>
      )}
      <div className="d--image">
        <Zoom>
          <img
            src={
              product?.images?.startsWith('/assets/images/')
                ? domain + product.images
                : product?.images || 'https://placehold.co/1024x1024'
            }
            alt={product?.name}
            className={`${product?.varian?.every((v) => v?.stok === 0) ? 'out-of-stock' : ''}`}
          />
          {/* <LazyLoadImage
          src={product?.images}
          alt={product?.name}
          effect="blur" // Optional: Add a blur effect while loading
          placeholderSrc="https://placehold.co/1024x1024" // Placeholder image
          className={`${product?.varian?.every((v) => v?.stok === 0) ? 'out-of-stock' : ''}`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/1024x1024';
          }} // Important for preventing infinite loops
        /> */}
        </Zoom>
      </div>
      <div
        className={`recipe-body ${
          product?.varian?.every((v) => v?.stok === 0) ? 'out-of-stock' : ''
        }`}
      >
        <div>
          <h4 className="text-primary">
            <small>Rp</small>
            {product?.varian?.find((v) => v.id === varians?.id)
              ? varians?.harga?.toLocaleString('id-ID')
              : product?.varian?.length > 1
                ? product?.varian[0]?.harga?.toLocaleString('id-ID') +
                  ' - ' +
                  product?.varian[product?.varian.length - 1]?.harga?.toLocaleString('id-ID')
                : product?.varian[0]?.harga.toLocaleString('id-ID')}
            {/* Displaying the normal price */}
            {product?.varian?.find((v) => v.id === varians?.id) &&
              product?.varian?.length !== 1 && (
                <small style={{ textDecoration: 'line-through', color: '#a0a0a0' }}>
                  {' '}
                  Rp{varians?.harga_normal?.toLocaleString('id-ID')}
                </small>
              )}
            {product?.varian?.length === 1 && (
              <small style={{ textDecoration: 'line-through', color: '#a0a0a0' }}>
                {' '}
                Rp{product?.varian[0]?.harga_normal?.toLocaleString('id-ID')}
              </small>
            )}
          </h4>
        </div>
        <a className="recipe-title recipe-link" title={product.name}>
          {product.name}
        </a>
        {product?.varian?.length > 0 && (
          <Fragment>
            <div className="mt-1">
              <p>
                Pilih Ukuran <small>({product?.varian?.length} Pilihan)</small>
              </p>
            </div>

            <div className="recipe-info">
              {product?.varian?.map((varian, idx) => (
                <div className="icon-group" key={idx} onClick={() => handleVarian(varian?.id)}>
                  <span
                    className={`badge badge-outline-primary ${
                      varians?.id === varian?.id ? 'active' : ''
                    }`}
                  >
                    {varian?.jumlah} {varian?.nama_berat}
                  </span>
                </div>
              ))}
            </div>
          </Fragment>
        )}

        {product?.link_shopee === null ? (
          <Fragment>
            {product?.varian?.find((v) => v.id === varians?.id) && varians?.stok !== 0 && (
              <Fragment>
                <div className="mt-1">
                  <p>Jumlah</p>
                </div>

                <div className="quantity-container">
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange('decrement')}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    className="quantity-input"
                    type="number"
                    value={isNaN(quantity) ? 1 : quantity} // Ensure quantity is always a valid number
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value, 10);

                      if (!isNaN(newValue)) {
                        const newQuantity = Math.min(Math.max(1, newValue), varians?.stok);
                        setQuantity(newQuantity);
                      } else {
                        // If invalid input, don't update quantity, reset the input value
                        e.target.value = quantity;
                      }
                    }}
                    min="1"
                    max={varians?.stok}
                  />
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange('increment')}
                    disabled={
                      product?.varian?.find((v) => v.id === varians?.id) &&
                      quantity >= varians?.stok
                    }
                  >
                    +
                  </button>
                </div>
              </Fragment>
            )}
          </Fragment>
        ) : (
          product?.varian?.find((v) => v.id === varians?.id) && (
            <Fragment>
              <div className="mt-1">
                <p>Jumlah</p>
              </div>

              <div className="quantity-container">
                <button
                  className="quantity-btn"
                  onClick={() => setQuantity(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  className="quantity-input"
                  type="number"
                  value={quantity} // Ensure quantity is always a valid number
                  onChange={(e) => {
                    const newQuantity = Math.max(1, parseInt(e.target.value)); // Enforce minimum of 1
                    setQuantity(newQuantity);
                  }}
                  min="1"
                />
                <button className="quantity-btn" onClick={() => setQuantity(quantity + 1)}>
                  +
                </button>
              </div>
            </Fragment>
          )
        )}

        {product?.varian?.every((v) => v?.stok === 0) ? (
          <button
            className="btn btn-primary"
            style={{ marginTop: '2rem', filter: 'grayscale()' }}
            disabled={
              product?.varian?.find((v) => v.id === varians?.id) && varians?.stok === 0 // Tidak ada stok
            }
          >
            Stok habis
          </button>
        ) : (
          <Fragment>
            {product?.link_wa !== null ? (
              <Fragment>
                {product?.varian?.find((v) => v.id === varians?.id) && varians?.stok === 0 ? (
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: '2rem', filter: 'grayscale()' }}
                    disabled={
                      product?.varian?.find((v) => v.id === varians?.id) && varians?.stok === 0 // Tidak ada stok
                    }
                  >
                    Stok habis
                  </button>
                ) : (
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: '2rem' }}
                    // onClick={() =>
                    //   window.open(
                    //     `https://wa.me/${product?.link_wa}?text=Halo, saya ingin membeli ${product?.id_kategori === 7 ? 'Kue' : 'Produk'} ${product.name} ukuran ${
                    //       varians?.nama_berat || product?.varian[0]?.nama_berat || ''
                    //     } sebanyak ${quantity} pcs dengan ${quantity === 1 ? 'harga' : 'total harga'} Rp ${
                    //       varians?.harga
                    //         ? (varians?.harga * quantity)?.toLocaleString('id-ID')
                    //         : product?.varian[0]?.harga.toLocaleString('id-ID')
                    //     }. Mohon dikirimkan ke alamat [Isi Nama, No Hp dan Alamat Anda]. Terima kasih!`,
                    //     '_blank'
                    //   )
                    // }
                    onClick={(e) => handleFormWhatsApp(e, product, varians, quantity)}
                    disabled={
                      product?.varian?.find((v) => v.id === varians?.id) ||
                      product?.varian?.every((v) => v?.stok === 0)
                        ? false
                        : true // Tidak ada stok
                    }
                  >
                    {product?.varian[0]?.stok > 0 &&
                    product?.varian?.find((v) => v.id === varians?.id)
                      ? 'Pesan via WhatsApp'
                      : 'Pilih Varian (size)'}
                  </button>
                )}
              </Fragment>
            ) : null}

            {product?.link_wa !== null && product?.link_shopee !== null && <br />}

            {product?.link_shopee !== null ? (
              <Fragment>
                <button
                  className="btn btn-shopee"
                  style={{ marginTop: '1rem' }}
                  onClick={() => window.open(product?.link_shopee, '_blank')}
                  target="_blank"
                  disabled={
                    product?.varian?.find((v) => v.id === varians?.id) ||
                    product?.varian?.every((v) => v?.stok === 0)
                      ? false
                      : true // Tidak ada stok
                  }
                >
                  {product?.varian[0]?.stok > 0 &&
                  product?.varian?.find((v) => v.id === varians?.id)
                    ? 'Pesan via Shopee'
                    : 'Pilih Varian (size)'}
                </button>
              </Fragment>
            ) : null}
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
