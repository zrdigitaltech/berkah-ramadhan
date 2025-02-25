import Modals from '@/app/components/Modals';
import { Fragment, useState } from 'react';
import './formWhatsApp.scss';

const Index = (props) => {
  const { show, onClose, products, varians, quantitys } = props;
  console.log('as', products)
  const [dataForm, setDataForm] = useState({
    nama: '',
    no_hp: '',
    alamat: '',
  });

  const [error, setError] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setDataForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Hapus error ketika input diisi
    setError((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const validateNoHp = (no_hp) => {
    return /^[0-9]+$/.test(no_hp) && no_hp.length >= 10;
  };

  const handlePesanViaWhatsApp = () => {
    const { nama, no_hp, alamat } = dataForm;

    let newError = {};
    if (!nama) newError.nama = 'Nama harus diisi';
    if (!no_hp) {
      newError.no_hp = 'No Hp harus diisi';
    } else if (!validateNoHp(no_hp)) {
      newError.no_hp = 'No Hp harus berupa angka dan minimal 10 karakter';
    }
    if (!alamat) newError.alamat = 'Alamat harus diisi';

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

    const message = `Halo ${domain}, saya tertarik untuk membeli ${kategori} berikut:\nNama ${kategori}: ${productName}\nUkuran: ${ukuran}\nJumlah: ${quantitys} pcs\n${quantitys === 1 ? 'Harga' : 'Total Harga'}: Rp ${harga}\n\nInformasi Pemesanan:\nNama Lengkap: ${nama}\nNo HP: ${no_hp}\nAlamat: ${alamat}\n\nMohon konfirmasinya. Terima kasih!`;

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
