import React from 'react';

function ComparisonDisplay({ product1, product2 }) {
  if (!product1 || !product2) {
    return null; // Don't render if products aren't selected
  }

  // Determine price highlighting
  const getPriceColor = (price, otherPrice) => {
    if (price < otherPrice) {
      return 'green-price';
    } else if (price > otherPrice) {
      return 'red-price';
    }
    return ''; // No specific highlight if prices are equal
  };

  // Helper to convert brand names to CSS friendly class names
  const getBrandClass = (brandName) => {
    return brandName.toLowerCase().replace(/\s+/g, '-');
  };

  const product1PriceClass = getPriceColor(product1.price, product2.price);
  const product2PriceClass = getPriceColor(product2.price, product1.price);

  const product1BrandClass = getBrandClass(product1.brand);
  const product2BrandClass = getBrandClass(product2.brand);

  return (
    <div className="comparison-container">
      <div className={`product-card ${product1BrandClass}`}> {/* Added brand class */}
        <img src={product1.imageUrl} alt={product1.functionName} className="product-image" />
        <h2>Brand: {product1.brand} <br /> Series: {product1.seriesName} <br /> Model: {product1.modelNumber}</h2>
        <h3>{product1.functionName}</h3>
        <p className="product-category">Category: {product1.category}</p>
        <p className={`product-price ${product1PriceClass}`}>
          Price: ${product1.price.toFixed(2)}
        </p>
        <h4>Description:</h4>
        <p dangerouslySetInnerHTML={{ __html: product1.description }}></p>
      </div>

      <div className={`product-card ${product2BrandClass}`}> {/* Added brand class */}
        <img src={product2.imageUrl} alt={product2.functionName} className="product-image" />
        <h2>Brand: {product2.brand} <br />Series: {product2.seriesName} <br />Model: {product2.modelNumber}</h2>
        <h3>{product2.functionName}</h3>
        <p className="product-category">Category: {product2.category}</p>
        <p className={`product-price ${product2PriceClass}`}>
          Price: ${product2.price.toFixed(2)}
        </p>
        <h4>Description:</h4>
        <p dangerouslySetInnerHTML={{ __html: product2.description }}></p>
      </div>
    </div>
  );
}

export default ComparisonDisplay;