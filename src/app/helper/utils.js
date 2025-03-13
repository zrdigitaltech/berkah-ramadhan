// Format nomor telepon dari 62xxxxxxxxxx menjadi 08xxxxxxxxxx
export const formatPhoneNumber = (phone) => {
  // Pastikan phone selalu berupa string
  const phoneStr = String(phone);

  if (phoneStr.startsWith('62')) {
    return '0' + phoneStr.slice(2);
  }
  return phoneStr; // Jika sudah dalam format yang benar, biarkan saja
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
