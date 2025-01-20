'use client';

import ProductCard from '@/app/components/ProductCard';

const ProductList = ({ product }) => {
  // Sort products: first available stock, then out of stock
  const sortedProducts = [...product].sort((a, b) => {
    const aInStock = a.varian?.some(v => v.stok > 0); // Check if any variant has stock
    const bInStock = b.varian?.some(v => v.stok > 0);

    if (aInStock && !bInStock) return -1; // a comes before b
    if (!aInStock && bInStock) return 1;  // b comes before a
    return 0; // No change if both have same stock status
  });
  return (
    <div className="recipe-list">
      {sortedProducts.map((prod, idx) => (
        <ProductCard product={prod} key={idx} />
      ))}
    </div>
  );
};

export default ProductList;
