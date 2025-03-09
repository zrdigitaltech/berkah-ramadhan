import Modals from '@/app/components/Modals';
import { Fragment, useState } from 'react';
import './formWhatsApp.scss';
import { useDispatch } from 'react-redux';
import { removeSelectedItemsFromCart } from '@/app/redux/action/keranjangs/creator';

const Index = (props) => {
  const { show, onClose, products, handlePesananViaWhatsApp } = props;
  const dispatch = useDispatch();
  console.log('formWhatsApp', products);

  const [dataForm, setDataForm] = useState({
    nama: '',
    no_hp: '',
    metode_pengiriman: '',
    alamat: '',
    metode_pembayaran: '',
    catatan: ''
  });

  const [error, setError] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setDataForm((prev) => ({
      ...prev,
      [name]: value
    }));

    // Hapus error ketika input diisi
    setError((prev) => ({
      ...prev,
      [name]: ''
    }));
  };

  const validateNoHp = (no_hp) => {
    return /^[0-9]+$/.test(no_hp) && no_hp.length >= 10;
  };

  const handlePesanViaWhatsApp = () => {
    const { nama, no_hp, metode_pengiriman, alamat, metode_pembayaran, catatan } = dataForm;
    let newError = {};

    // Validasi Nama
    if (!nama) {
      newError.nama = 'Nama harus diisi';
    } else if (nama.length < 5) {
      newError.nama = 'Nama harus minimal 5 karakter';
    }

    // Validasi No HP
    if (!no_hp) {
      newError.no_hp = 'No Hp harus diisi';
    } else if (!validateNoHp(no_hp)) {
      newError.no_hp = 'No Hp harus berupa angka dan minimal 10 karakter';
    }

    // Validasi Metode Pengiriman
    if (!metode_pengiriman) {
      newError.metode_pengiriman = 'Metode Pengiriman harus dipilih';
    }

    // Validasi Alamat jika metode pengiriman adalah "Dikirim"
    if (metode_pengiriman === 'Dikirim') {
      if (!alamat) {
        newError.alamat = 'Alamat harus diisi';
      } else if (alamat.length < 20) {
        newError.alamat = 'Alamat harus minimal 20 karakter';
      }
    }

    // Validasi Metode Pembayaran
    if (!metode_pembayaran) {
      newError.metode_pembayaran = 'Metode Pembayaran harus dipilih';
    }

    // Jika ada error, set state dan hentikan proses
    if (Object.keys(newError).length > 0) {
      setError(newError);
      return;
    }

    // **Menyiapkan data untuk WhatsApp**
    const domain = process.env.NEXT_PUBLIC_DOMAIN || 'Berkah Ramadhan';
    const phoneNumber = process.env.NEXT_PUBLIC_WA_NUMBER || '628123456789'; // Ubah dengan nomor tujuan default jika tidak tersedia

    let totalHargaPesanan = 0;
    let totalHargaHemat = 0;

    const productMessages = products
      .slice()
      .reverse()
      .map((product, index) => {
        const kategori = product?.id_kategori === 7 ? 'Kue' : 'Produk';
        const teksUkuran =
          product?.id_kategori === 1 || product?.id_kategori === 2 || product?.id_kategori === 7
            ? 'Varian'
            : 'Ukuran';

        const ukuran = product?.variant?.nama_berat || '-';
        const quantity = product?.quantity || 1;
        const harga = product?.variant?.harga || 0;
        const harga_normal = product?.variant?.harga_normal || 0;
        const totalHargaProduk = harga * quantity;
        const totalHargaProdukNormal = harga_normal * quantity;
        const totalHemat = (harga_normal - harga) * quantity;

        // Tambahkan ke total harga keseluruhan
        totalHargaPesanan += totalHargaProduk;
        totalHargaHemat += totalHemat;

        return `
${index + 1}. ${kategori}: ${product.name}
 ${teksUkuran}: ${ukuran}
 Jumlah: ${quantity}
 Harga Normal (Sebelum Diskon): Rp ${harga_normal.toLocaleString('id-ID')}
 Harga Setelah Diskon: Rp ${harga.toLocaleString('id-ID')}
 Hemat: Rp ${totalHemat.toLocaleString('id-ID')}
 SubTotal: Rp ${totalHargaProduk.toLocaleString('id-ID')}
  `.trim();
      });

    // **Format pesan WhatsApp**
    const message = `
Halo ${domain}, saya tertarik untuk membeli produk berikut:

${productMessages.join('\n\n')}

Total: Rp ${totalHargaPesanan.toLocaleString('id-ID')}
Hemat: Rp ${totalHargaHemat.toLocaleString('id-ID')}

Informasi Pemesanan:
Nama: ${nama}
No HP: ${no_hp}
Metode Pengiriman: ${metode_pengiriman}
Alamat: ${metode_pengiriman === 'Dikirim' ? alamat : '-'}
Metode Pembayaran: ${metode_pembayaran}
Catatan: ${catatan || '-'}

Mohon konfirmasinya. Terima kasih!
`.trim();

    // Encode message dan buka WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const waLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(waLink, '_blank');

    handleClose();
    // Ambil hanya ID yang akan dihapus
    const selectedIds = products?.map((item) => item?.id);

    // Dispatch penghapusan berdasarkan ID
    dispatch(removeSelectedItemsFromCart(selectedIds));
    handlePesananViaWhatsApp();
  };

  const resetForm = async () => {
    setDataForm((prev) => ({
      ...prev,
      metode_pengiriman: '',
      metode_pembayaran: ''
    }));
    setError({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Hitung total harga dan total hemat
  const totalHarga = Array.isArray(products)
    ? products?.reduce((sum, item) => sum + (item.variant?.harga || 0) * item.quantity, 0)
    : 0;

  const totalHargaNormal = Array.isArray(products)
    ? products?.reduce((sum, item) => sum + (item.variant?.harga_normal || 0) * item.quantity, 0)
    : 0;

  const totalHemat = totalHargaNormal - totalHarga;

  return (
    <Modals
      title="Form Pemesanan"
      show={show}
      onClose={handleClose}
      modalBody={
        <Fragment>
          <form>
            {Array.isArray(products) &&
              products
                ?.slice()
                ?.reverse()
                ?.map((item, idx) => (
                  <div className="card-item mb-2" key={idx || item.id}>
                    <img src={item.images} alt={item.name} className="item-image" />
                    <div className="w-100 h-100 text-truncate">
                      <div className="item-info text-truncate">
                        <div className="text-truncate">
                          <h4 className="item-name text-truncate" title={item.name}>
                            {item.name}
                          </h4>
                        </div>
                        <div>
                          <p className="item-price mb-0">
                            {item.quantity} x Rp{' '}
                            {item.variant?.harga ? item.variant.harga.toLocaleString('id-ID') : '0'}
                          </p>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between ml-4">
                        <div style={{ color: '#a0a0a0' }}>{item.variant?.nama_berat}</div>
                        <div>
                          <small className="item-price-normal">
                            Rp{' '}
                            {item.variant?.harga_normal
                              ? item.variant.harga_normal.toLocaleString('id-ID')
                              : '0'}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            {products && (
              <Fragment>
                <div className="p-2 pr-4">
                  <p className="d-flex justify-content-between">
                    <b>Total</b>
                    <strong className="text-primary">
                      Rp {totalHarga.toLocaleString('id-ID')}
                    </strong>
                  </p>
                  <p className="d-flex justify-content-between">
                    <b>Hemat</b>
                    <strong className="harga-normal">
                      Rp {totalHemat.toLocaleString('id-ID')}
                    </strong>
                  </p>
                </div>
                <hr className="mb-4" />
              </Fragment>
            )}
            <div className="mb-3">
              <h4>Informasi Pemesanan :</h4>
            </div>
            <div className="mb-2">
              <label>Nama Lengkap</label>
              <input
                type="text"
                className="form-control"
                name="nama"
                placeholder="Contoh : Adi Rahmat Setiawan"
                value={dataForm.nama}
                onChange={handleChange}
              />
              {error.nama && <small className="form-text text-danger">{error.nama}</small>}
            </div>

            <div className="mb-2">
              <label>No Hp</label>
              <input
                type="text"
                className="form-control"
                name="no_hp"
                placeholder="Contoh : 081234567890"
                value={dataForm.no_hp}
                onChange={handleChange}
              />
              {error.no_hp && <small className="form-text text-danger">{error.no_hp}</small>}
            </div>

            <div className="mb-2">
              <label>Metode Pengiriman</label>
              <select
                className="form-control"
                name="metode_pengiriman"
                value={dataForm.metode_pengiriman}
                onChange={handleChange}
              >
                <option value="">Pilih Metode Pengiriman</option>
                <option value="Ambil di Toko">Ambil di Toko</option>
                <option value="Dikirim">Dikirim</option>
              </select>
              {error.metode_pengiriman && (
                <small className="form-text text-danger">{error.metode_pengiriman}</small>
              )}
            </div>

            {dataForm.metode_pengiriman === 'Dikirim' && (
              <div>
                <label>Alamat</label>
                <textarea
                  className="form-control"
                  rows="4"
                  name="alamat"
                  placeholder="Contoh : Jalan Sudirman No. 123, Jakarta"
                  value={dataForm.alamat}
                  onChange={handleChange}
                />
                {error.alamat && <small className="form-text text-danger">{error.alamat}</small>}
              </div>
            )}

            <div className="mb-2">
              <label>Metode Pembayaran</label>
              <select
                className="form-control"
                name="metode_pembayaran"
                value={dataForm.metode_pembayaran}
                onChange={handleChange}
              >
                <option value="">Pilih Metode Pembayaran</option>
                <option value="Transfer Bank">Transfer Bank</option>
                {dataForm.metode_pengiriman !== 'Dikirim' && (
                  <option value="COD">Bayar di Tempat (COD)</option>
                )}
                <option value="E-Wallet">E-Wallet (OVO, Dana, GoPay)</option>
              </select>
              {error.metode_pembayaran && (
                <small className="form-text text-danger">{error.metode_pembayaran}</small>
              )}
            </div>

            <div className="mb-2">
              <label>Catatan Tambahan</label>
              <textarea
                className="form-control"
                rows="2"
                name="catatan"
                placeholder="Contoh: Tolong bungkus dengan rapi."
                value={dataForm.catatan}
                onChange={handleChange}
              />
            </div>
          </form>
        </Fragment>
      }
      modalFooter={
        <Fragment>
          <button onClick={handlePesanViaWhatsApp} type="button" className="btn btn-primary m-auto">
            Pemesanan Via WhatsApp
          </button>
        </Fragment>
      }
    />
  );
};

export default Index;
