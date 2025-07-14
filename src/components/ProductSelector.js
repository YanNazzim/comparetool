import React from 'react';

function ProductSelector({ brands, productsData, onSelectProduct, selectedBrand, selectedProduct, labelPrefix }) {
  // Filter products based on the currently selected brand
  const productsForSelectedBrand = productsData.filter(
    (product) => product.brand === selectedBrand
  );

  const handleBrandChange = (e) => {
    const brand = e.target.value;
    onSelectProduct(brand, null); // Reset product when brand changes
  };

  const handleProductChange = (e) => {
    const productId = e.target.value;
    const product = productsData.find(p => p.id === productId);
    onSelectProduct(selectedBrand, product);
  };

  return (
    <div className="product-selector">
      <h2>{labelPrefix} Brand 1:</h2>
      <select value={selectedBrand} onChange={handleBrandChange}>
        <option value="">Select Brand 1</option>
        {brands.map((brand) => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </select>

      {selectedBrand && (
        <div className="product-dropdown">
          <h3>Select Product:</h3>
          <select value={selectedProduct ? selectedProduct.id : ''} onChange={handleProductChange}>
            <option value="">Select a Product</option>
            {productsForSelectedBrand.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

export default ProductSelector;