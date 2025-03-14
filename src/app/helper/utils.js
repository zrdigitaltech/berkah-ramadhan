// Format nomor telepon dari 6281228883616 menjadi 628122888xxxx
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';

  // Konversi ke string jika input berupa angka
  const phoneStr = phone.toString();

  // Pastikan panjang nomor minimal 12 digit sebelum diproses
  if (phoneStr.length < 12) return phoneStr;

  return phoneStr.replace(/(\d{8})\d{4}$/, '$1xxxx');
};

// Format angka ke format mata uang Rupiah (IDR) dengan pemisah ribuan
export const formatRupiah = (value) => {
  return new Intl.NumberFormat('id-ID').format(value);
};

// Menghapus titik dari format rupiah (misalnya "1.000.000" menjadi 1000000)
export const unFormatRupiah = (value) => {
  return Number(value.replace(/\./g, '')) || 0;
};

// Fungsi untuk menghasilkan ID unik
export const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 11);
};

export const groupDataByLinkWa = (data) => {
  if (!Array.isArray(data)) return []; // Pastikan data adalah array

  return Object.values(
    data.reduce((acc, item) => {
      if (!item?.link_wa) return acc; // Pastikan item memiliki link_wa

      if (!acc[item.link_wa]) {
        acc[item.link_wa] = { id: generateUniqueId(), link_wa: item.link_wa, product: [] };
      }

      acc[item.link_wa].product.push(item); // Gunakan "product" bukan "items"
      return acc;
    }, {})
  );
};
