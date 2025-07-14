// src/components/PrefixesModal.js
import React from 'react';

function PrefixesModal({ isOpen, onClose, product }) {
  if (!isOpen || !product) return null;

  // Helper function to extract numeric value and relevant information from the price
  const getParsedPriceInfo = (price) => {
    let numericValue = 0;
    let isNegative = false;
    let nonNumericText = '';
    let hasValidNumericFormat = false; // Flag to indicate if a valid number format was detected

    if (typeof price === 'number') {
      numericValue = price;
      isNegative = price < 0;
      hasValidNumericFormat = true;
    } else if (typeof price === 'string') {
      // Regex to explicitly match a number at the beginning of the string
      // This pattern is strict: it must start with a number (optional sign, optional decimals)
      const numericStringMatch = price.match(/^(-?\d+(\.\d+)?)/);

      if (numericStringMatch) {
        numericValue = parseFloat(numericStringMatch[0]); // Extract and parse the matched numeric part
        isNegative = numericValue < 0;
        nonNumericText = price.substring(numericStringMatch[0].length).trim(); // Get the rest of the string
        hasValidNumericFormat = true;
      } else {
        // If no leading number, the whole string is considered non-numeric text
        nonNumericText = price;
        hasValidNumericFormat = false;
      }
    }
    return { numericValue, isNegative, nonNumericText, hasValidNumericFormat };
  };

  // Helper function to format the price display based on the parsed info
  const formatAddOnPriceText = (info) => {
    const { numericValue, nonNumericText, hasValidNumericFormat } = info;
    let formattedDisplay = '';

    if (hasValidNumericFormat) {
      // If a valid number format was found, format it as currency
      if (numericValue > 0) {
        formattedDisplay = `+ $${numericValue.toFixed(2)}`;
      } else if (numericValue < 0) {
        formattedDisplay = `- $${Math.abs(numericValue).toFixed(2)}`;
      } else {
        formattedDisplay = 'No additional cost'; // Only for true zero numeric values
      }

      // Append non-numeric text if present and the numeric part isn't "No additional cost"
      if (nonNumericText && formattedDisplay !== 'No additional cost') {
        return `${formattedDisplay} ${nonNumericText}`;
      }
      return formattedDisplay;
    } else {
      // If no valid numeric format was found at all, just return the original non-numeric text
      return nonNumericText;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>X</button>
        <h2>Prefix Options for {product.modelNumber}</h2>
        {product.prefixAddOns && product.prefixAddOns.length > 0 ? (
          <ul className="prefix-list">
            {product.prefixAddOns.map((addOn, index) => {
              // Get all the necessary info about the price
              const priceInfo = getParsedPriceInfo(addOn.addOnPrice);

              return (
                <li key={index} className="prefix-item">
                  <span className="prefix-name">{addOn.prefix}</span>
                  {/* Apply 'negative' class based on the parsed 'isNegative' flag */}
                  <span className={`prefix-price-addon ${priceInfo.isNegative ? 'negative' : ''}`}>
                    {/* Display the formatted text using the helper */}
                    {formatAddOnPriceText(priceInfo)}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No specific prefix add-ons listed for this product.</p>
        )}
      </div>
    </div>
  );
}

export default PrefixesModal;