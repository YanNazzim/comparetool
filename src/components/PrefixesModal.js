// src/components/PrefixesModal.js
import React from 'react';

function PrefixesModal({ isOpen, onClose, product }) {
  if (!isOpen || !product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>X</button>
        <h2>Prefix Options for {product.functionName}</h2>
        {product.prefixAddOns && product.prefixAddOns.length > 0 ? (
          <ul className="prefix-list">
            {product.prefixAddOns.map((addOn, index) => (
              <li key={index} className="prefix-item">
                <span className="prefix-name">{addOn.prefix}</span>
                <span className="prefix-price-addon">
                  {addOn.addOnPrice > 0 ? `+ $${addOn.addOnPrice.toFixed(2)}` : 'No additional cost'}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No specific prefix add-ons listed for this product.</p>
        )}
      </div>
    </div>
  );
}

export default PrefixesModal;