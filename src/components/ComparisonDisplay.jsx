// src/components/ComparisonDisplay.jsx
import React, { useState } from 'react';
import { getProductSpecInfo } from '../utils/hardwareEngine';

function ComparisonDisplay({ product1, product2, onShowPrefixes }) {
  const [copiedNote, setCopiedNote] = useState(false);

  if (!product1 || !product2) {
    return null;
  }

  // Determine price highlighting based on minPrice comparison
  const getPriceColor = (currentProductMinPrice, otherProductMinPrice) => {
    if (currentProductMinPrice == null || otherProductMinPrice == null) {
      return '';
    }
    if (currentProductMinPrice < otherProductMinPrice) {
      return 'green-price';
    } else if (currentProductMinPrice > otherProductMinPrice) {
      return 'red-price';
    }
    return '';
  };

  const formatPriceRange = (product) =>
    product.minPrice == null || product.maxPrice == null
      ? 'Price TBD'
      : `$${product.minPrice.toFixed(2)} - $${product.maxPrice.toFixed(2)}`;

  const getBrandClass = (brandName) => {
    return brandName.toLowerCase().replace(/\s+/g, '-');
  };

  const product1PriceClass = getPriceColor(product1.minPrice, product2.minPrice);
  const product2PriceClass = getPriceColor(product2.minPrice, product1.minPrice);

  const product1BrandClass = getBrandClass(product1.brand);
  const product2BrandClass = getBrandClass(product2.brand);

  const p1Spec = getProductSpecInfo(product1);
  const p2Spec = getProductSpecInfo(product2);

  const handleCopySubmittal = () => {
    const note = `ARCHITECTURAL HARDWARE SPECIFICATION SUBMITTAL
======================================================
BASELINE HARDWARE (SARGENT):
  Catalog Callout:  ${p1Spec.combinedNumber}
  Series / Chassis: ${product1.seriesName} (${product1.modelNumber})
  Function Code:    ${p1Spec.functionCode} (${p1Spec.ansiCode})
  Approved Trim:    ${p1Spec.trimStyle}
  List Price:       ${formatPriceRange(product1)}

APPROVED EQUIVALENT (${product2.brand.toUpperCase()}):
  Catalog Callout:  ${p2Spec.combinedNumber}
  Series / Chassis: ${product2.seriesName} (${product2.modelNumber})
  Function Suffix:  ${p2Spec.functionCode} (${p2Spec.ansiCode})
  Approved Trim:    ${p2Spec.trimStyle}
  List Price:       ${formatPriceRange(product2)}

EVALUATION:
  Both devices conform to ANSI/BHMA A156.3 Grade 1 operational and egress standards.
======================================================`;
    navigator.clipboard?.writeText(note).then(() => {
      setCopiedNote(true);
      setTimeout(() => setCopiedNote(false), 2200);
    });
  };

  // Matrix Spec Rows
  const matrixRows = [
    {
      label: 'Combined Catalog #',
      p1Val: p1Spec.combinedNumber,
      p2Val: p2Spec.combinedNumber,
      status: 'Exact Architectural Match',
      isHighlight: true
    },
    {
      label: 'Function Code / Suffix',
      p1Val: `${p1Spec.functionCode} (${p1Spec.codeLabel || product1.functionName})`,
      p2Val: `${p2Spec.functionCode} (${p2Spec.codeLabel || product2.functionName})`,
      status: 'Equivalent Operation'
    },
    {
      label: 'ANSI / BHMA Standard',
      p1Val: p1Spec.ansiCode || 'Grade 1',
      p2Val: p2Spec.ansiCode || 'Grade 1',
      status: 'Identical Grade 1'
    },
    {
      label: 'Chassis Form Factor',
      p1Val: `${product1.seriesName} (${product1.modelNumber})`,
      p2Val: `${product2.seriesName} (${product2.modelNumber})`,
      status: 'Matching Architecture'
    },
    {
      label: 'Outside Trim Style',
      p1Val: p1Spec.trimStyle,
      p2Val: p2Spec.trimStyle,
      status: 'Heavy Architectural Trim'
    },
    {
      label: 'List Price Range',
      p1Val: formatPriceRange(product1),
      p2Val: formatPriceRange(product2),
      status: 'Competitive Range',
      isPrice: true
    }
  ];

  return (
    <div className="comparison-wrapper">
      {/* Top Architectural Specification Bridge Banner */}
      <div className="cross-ref-summary-banner">
        <div className="summary-col p1">
          <span className="summary-brand-tag sargent">SARGENT • ASSA ABLOY</span>
          <span className="summary-part-num">{p1Spec.combinedNumber}</span>
          <span className="summary-func-tag">{p1Spec.codeLabel || p1Spec.ansiCode}</span>
        </div>

        <div className="summary-center">
          <span className="summary-match-badge">EXACT ARCHITECTURAL MATCH</span>
          <span className="summary-arrow">⟷</span>
          <span className="summary-ansi-badge">{p1Spec.ansiCode}</span>
        </div>

        <div className="summary-col p2">
          <span className={`summary-brand-tag ${product2BrandClass}`}>
            {product2.brand === 'Von Duprin' ? 'VON DUPRIN • ALLEGION' : product2.brand.toUpperCase()}
          </span>
          <span className="summary-part-num">{p2Spec.combinedNumber}</span>
          <span className="summary-func-tag">{p2Spec.codeLabel || p2Spec.ansiCode}</span>
        </div>
      </div>

      {/* Main Side-by-Side Product Cards */}
      <div className="comparison-container">
        {/* Product 1: Sargent */}
        <div className={`product-card ${product1BrandClass}`}>
          <div className="card-brand-header">
            <span className="brand-name-pill">{product1.brand}</span>
            <span className="category-pill">{product1.category}</span>
          </div>

          <div className="product-image-container">
            <img src={product1.imageUrl} alt={p1Spec.combinedNumber} className="product-image" />
          </div>

          <div className="part-callout-box">
            <span className="part-callout-label">COMBINED PART #:</span>
            <span className="part-callout-value">{p1Spec.combinedNumber}</span>
            <span className="part-function-badge">{p1Spec.ansiCode}</span>
          </div>

          <div className="device-spec-grid">
            <div className="spec-item">
              <span className="spec-label">Series:</span>
              <span className="spec-val">{product1.seriesName}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Chassis Model:</span>
              <span className="spec-val">{product1.modelNumber}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Outside Trim:</span>
              <span className="spec-val">{p1Spec.trimStyle}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Operation:</span>
              <span className="spec-val">{product1.functionName}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">List Price:</span>
              <span className={`spec-val price-val ${product1PriceClass}`}>{formatPriceRange(product1)}</span>
            </div>
          </div>

          {product1.description && (
            <div className="product-description-block">
              <h4>Engineering Description:</h4>
              <p dangerouslySetInnerHTML={{ __html: product1.description }}></p>
            </div>
          )}

          {product1.prefixAddOns && product1.prefixAddOns.length > 0 && (
            <button className="show-prefixes-button" onClick={() => onShowPrefixes(product1)}>
              🏷️ View Prefix Price Add-ons ({product1.prefixAddOns.length})
            </button>
          )}
        </div>

        {/* Product 2: Von Duprin / Competitor */}
        <div className={`product-card ${product2BrandClass}`}>
          <div className="card-brand-header">
            <span className="brand-name-pill">{product2.brand}</span>
            <span className="category-pill">{product2.category}</span>
          </div>

          <div className="product-image-container">
            <img src={product2.imageUrl} alt={p2Spec.combinedNumber} className="product-image" />
          </div>

          <div className="part-callout-box">
            <span className="part-callout-label">COMBINED PART #:</span>
            <span className="part-callout-value">{p2Spec.combinedNumber}</span>
            <span className="part-function-badge">{p2Spec.ansiCode}</span>
          </div>

          <div className="device-spec-grid">
            <div className="spec-item">
              <span className="spec-label">Series:</span>
              <span className="spec-val">{product2.seriesName}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Chassis Model:</span>
              <span className="spec-val">{product2.modelNumber}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Outside Trim:</span>
              <span className="spec-val">{p2Spec.trimStyle}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Operation:</span>
              <span className="spec-val">{product2.functionName}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">List Price:</span>
              <span className={`spec-val price-val ${product2PriceClass}`}>{formatPriceRange(product2)}</span>
            </div>
          </div>

          {product2.description && (
            <div className="product-description-block">
              <h4>Engineering Description:</h4>
              <p dangerouslySetInnerHTML={{ __html: product2.description }}></p>
            </div>
          )}

          {product2.prefixAddOns && product2.prefixAddOns.length > 0 && (
            <button className="show-prefixes-button" onClick={() => onShowPrefixes(product2)}>
              🏷️ View Prefix Price Add-ons ({product2.prefixAddOns.length})
            </button>
          )}
        </div>
      </div>

      {/* Side-by-Side Architectural Specification Matrix */}
      <div className="spec-matrix-card">
        <div className="spec-matrix-header">
          <div className="matrix-title-wrap">
            <span className="matrix-icon">⚡</span>
            <h3>Side-by-Side Architectural Specification Matrix</h3>
          </div>
          <button className="copy-submittal-btn" onClick={handleCopySubmittal}>
            {copiedNote ? '✓ Submittal Note Copied!' : '📋 Copy Submittal Note'}
          </button>
        </div>

        <div className="matrix-table-wrap">
          <table className="spec-matrix-table">
            <thead>
              <tr>
                <th>Hardware Parameter</th>
                <th>Sargent Spec</th>
                <th>{product2.brand} Equivalent</th>
                <th>Equivalency Status</th>
              </tr>
            </thead>
            <tbody>
              {matrixRows.map((row, idx) => (
                <tr key={idx} className={row.isHighlight ? 'highlight-row' : ''}>
                  <td className="row-label">{row.label}</td>
                  <td className="row-p1">{row.p1Val}</td>
                  <td className="row-p2">{row.p2Val}</td>
                  <td className="row-status">
                    <span className="status-badge-pill">{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ComparisonDisplay;