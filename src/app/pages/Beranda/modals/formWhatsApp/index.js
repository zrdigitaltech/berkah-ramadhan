import Modals from '@/app/components/Modals';
import { Fragment, useState } from 'react';
import './formWhatsApp.scss';

const Index = (props) => {
  const { show, onClose, products, varians, quantitys } = props;

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

    // Pastikan variabel produk tidak undefined/null
    const domain = process.env.NEXT_PUBLIC_DOMAIN || 'Berkah Ramadhan';
    const phoneNumber = products?.link_wa || '-';
    const productName = products?.name || '-';
    const kategori = products?.id_kategori === 7 ? 'Kue' : 'Produk';
    const teksUkuran = products?.id_kategori === 1 || products?.id_kategori === 2 || products?.id_kategori === 7 ? "Varian" : "Ukuran";
    const ukuran = varians?.jumlah
      ? `${varians.jumlah} ${varians.nama_berat || products?.varian?.[0]?.nama_berat || '-'}`
      : varians?.nama_berat || products?.varian?.[0]?.nama_berat || '-';
    const harga = varians?.harga ? `Rp ${varians.harga.toLocaleString('id-ID')}` : 'Rp 0';
    const total_harga =
      varians?.harga && quantitys
        ? `Rp ${(varians.harga * quantitys).toLocaleString('id-ID')}`
        : '';

    // Format pesan
    const message = `
Halo ${domain}, saya tertarik untuk membeli ${kategori} berikut:

Nama ${kategori}: ${productName}
${teksUkuran}: ${ukuran}
Jumlah: ${quantitys}
Harga: ${harga}
${quantitys >= 2 ? `Total Harga: ${total_harga}` : ''}

Informasi Pemesanan:
Nama Lengkap: ${nama}
No HP: ${no_hp}
Metode Pengiriman : ${metode_pengiriman}
Alamat: ${metode_pengiriman === 'Dikirim' ? alamat : '-'}
Metode Pembayaran: ${metode_pembayaran}
Catatan: ${catatan || '-'}

Mohon konfirmasinya. Terima kasih!
  `.trim();

    // Encode message dan buka WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const waLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(waLink, '_blank');

    // Reset form setelah sukses
    resetForm();
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

  return (
    <Modals
      title="Form Pemesanan"
      show={show}
      onClose={handleClose}
      modalBody={
        <Fragment>
          <form>
            <div className="mb-3">
              <h4>Produk detail :</h4>
            </div>
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th className="text-left">
                      Nama {products?.id_kategori === 7 ? 'Kue' : 'Produk'}
                    </th>
                    <th className="text-center">Ukuran</th>
                    <th className="text-center">Jumlah</th>
                    <th className="text-center">Harga</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-left" title={`${products?.name || '-'}`}>
                      <p className="product-info">{products?.name || '-'}</p>
                    </td>
                    <td className="text-center">
                      {varians?.jumlah}{' '}
                      {varians?.nama_berat || products?.varian?.[0]?.nama_berat || '-'}
                    </td>
                    <td className="text-center">{quantitys}</td>
                    <td className="text-right">{varians?.harga?.toLocaleString('id-ID') || '0'}</td>
                  </tr>
                </tbody>
              </table>

              <div className="total-harga">
                <b>Total Harga:</b> Rp{' '}
                <span>
                  {varians?.harga
                    ? (varians.harga * quantitys)?.toLocaleString('id-ID')
                    : products?.varian?.[0]?.harga?.toLocaleString('id-ID') || '0'}
                </span>
              </div>
            </div>
            <hr className="mb-4" />
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
