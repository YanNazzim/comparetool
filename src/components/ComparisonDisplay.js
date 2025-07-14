import React from 'react';

function ComparisonDisplay({ product1, product2 }) {
  if (!product1 || !product2) {
    return null; // Don't render if products aren't selected
  }

  // Determine price highlighting based on minPrice comparison
  const getPriceColor = (currentProductMinPrice, otherProductMinPrice) => {
    if (currentProductMinPrice < otherProductMinPrice) {
      return 'green-price';
    } else if (currentProductMinPrice > otherProductMinPrice) {
      return 'red-price';
    }
    return ''; // No specific highlight if min prices are equal
  };

  // Helper to convert brand names to CSS friendly class names
  const getBrandClass = (brandName) => {
    return brandName.toLowerCase().replace(/\s+/g, '-');
  };

  const product1PriceClass = getPriceColor(product1.minPrice, product2.minPrice);
  const product2PriceClass = getPriceColor(product2.minPrice, product1.minPrice);

  const product1BrandClass = getBrandClass(product1.brand);
  const product2BrandClass = getBrandClass(product2.brand);

  return (
    <div className="comparison-container">
      <div className={`product-card ${product1BrandClass}`}>
        <img src={product1.imageUrl} alt={product1.functionName} className="product-image" />
        <h2>Brand: {product1.brand} <br /> Series: {product1.seriesName} <br /> Model: {product1.modelNumber}</h2>
        <h3>{product1.functionName}</h3>
        <p className="product-category">Category: {product1.category}</p>
        <p className={`product-price ${product1PriceClass}`}>
          Price Range: ${product1.minPrice.toFixed(2)} - ${product1.maxPrice.toFixed(2)}
        </p>
        <h4>Description:</h4>
        <p dangerouslySetInnerHTML={{ __html: product1.description }}></p>
      </div>

      <div className={`product-card ${product2BrandClass}`}>
        <img src={product2.imageUrl} alt={product2.functionName} className="product-image" />
        <h2>Brand: {product2.brand} <br />Series: {product2.seriesName} <br />Model: {product2.modelNumber}</h2>
        <h3>{product2.functionName}</h3>
        <p className="product-category">Category: {product2.category}</p>
        <p className={`product-price ${product2PriceClass}`}>
          Price Range: ${product2.minPrice.toFixed(2)} - ${product2.maxPrice.toFixed(2)}
        </p>
        <h4>Description:</h4>
        <p dangerouslySetInnerHTML={{ __html: product2.description }}></p>
      </div>
    </div>
  );
}

export default ComparisonDisplay;