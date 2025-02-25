import Modals from '@/app/components/Modals';
import { Fragment, useState } from 'react';
import './formWhatsApp.scss';

const Index = (props) => {
  const { show, onClose, products, varians, quantitys } = props;

  const [dataForm, setDataForm] = useState({
    nama: '',
    no_hp: '',
    alamat: '',
    metode_pembayaran: 'Transfer Bank',
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
    const { nama, no_hp, alamat, metode_pembayaran, catatan } = dataForm;

    let newError = {};
    if (!nama) {
      newError.nama = 'Nama harus diisi';
    } else if (nama.length < 5) {
      newError.nama = 'Nama harus minimal 5 karakter';
    }
    if (!no_hp) {
      newError.no_hp = 'No Hp harus diisi';
    } else if (!validateNoHp(no_hp)) {
      newError.no_hp = 'No Hp harus berupa angka dan minimal 10 karakter';
    }
    if (!alamat) {
      newError.alamat = 'Alamat harus diisi';
    } else if (alamat.length < 20) {
      newError.alamat = 'Alamat harus minimal 20 karakter';
    }

    if (Object.keys(newError).length > 0) {
      setError(newError);
      return;
    }

    const domain = process.env.NEXT_PUBLIC_DOMAIN; // Access the environment variable
    const phoneNumber = products?.link_wa || '-'; // Pastikan nomor ada
    const productName = products?.name || '-';
    const kategori = products?.id_kategori === 7 ? 'Kue' : 'Produk';
    const ukuran = varians?.nama_berat || products?.varian?.[0]?.nama_berat || '-';
    const harga = varians?.harga
      ? (varians.harga * quantitys)?.toLocaleString('id-ID')
      : products?.varian?.[0]?.harga?.toLocaleString('id-ID') || '0';

    const message = `Halo ${domain}, saya tertarik untuk membeli ${kategori} berikut:\nNama ${kategori}: ${productName}\nUkuran: ${ukuran}\nJumlah: ${quantitys}\n${quantitys === 1 ? 'Harga' : 'Total Harga'}: Rp ${harga}\n\nInformasi Pemesanan:\nNama Lengkap: ${nama}\nNo HP: ${no_hp}\nAlamat: ${alamat}\nMetode Pembayaran: ${metode_pembayaran}\nCatatan: ${catatan || '-'}\n\nMohon konfirmasinya. Terima kasih!`;

    const encodedMessage = encodeURIComponent(message);
    const waLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(waLink, '_blank');
    handleClose();
  };

  const handleClose = () => {
    setDataForm({
      nama: '',
      no_hp: '',
      alamat: '',
      metode_pembayaran: 'Transfer Bank',
      catatan: ''
    });
    setError({});
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
            <p className="product-info">
              <b>Nama {products?.id_kategori === 7 ? 'Kue' : 'Produk'}:</b>{' '}
              <span title={`${products?.name || '-'}`}>{products?.name || '-'}</span>
            </p>

            <p>
              <b>Ukuran:</b> {varians?.nama_berat || products?.varian?.[0]?.nama_berat || '-'}
            </p>
            <p>
              <b>Jumlah:</b> {quantitys}
            </p>
            <p className="mb-4">
              <b>{quantitys === 1 ? 'Harga' : 'Total Harga'}:</b> Rp{' '}
              {varians?.harga
                ? (varians.harga * quantitys)?.toLocaleString('id-ID')
                : products?.varian?.[0]?.harga?.toLocaleString('id-ID') || '0'}
            </p>
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

            <div className="mb-2">
              <label>Metode Pembayaran</label>
              <select
                className="form-control"
                name="metode_pembayaran"
                value={dataForm.metode_pembayaran}
                onChange={handleChange}
              >
                <option value="Transfer Bank">Transfer Bank</option>
                <option value="COD">Bayar di Tempat (COD)</option>
                <option value="E-Wallet">E-Wallet (OVO, Dana, GoPay)</option>
              </select>
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
            Pesan Via WhatsApp
          </button>
        </Fragment>
      }
    />
  );
};

export default Index;
