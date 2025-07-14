// src/App.js
import React, { useState } from 'react';
import './App.css';
import allBrandsData from './data/products';
import ProductDrillDownSelector from './components/ProductDrillDownSelector';
import ComparisonDisplay from './components/ComparisonDisplay';
import Images from './Images/images'; // Import the images module

function App() {
  const [selectedProduct1, setSelectedProduct1] = useState(null);
  const [selectedBrand2, setComparedBrand2] = useState('');
  const [comparedProduct2, setComparedProduct2] = useState(null);

  const findProductById = (productId) => {
    if (!productId) return null;
    for (const brandData of allBrandsData) {
      for (const categoryData of brandData.categories) {
        // NEW: Loop through subCategories
        for (const subCategoryData of categoryData.subCategories) {
          for (const seriesData of subCategoryData.series) { // Series are now in subCategory
            for (const modelData of seriesData.models) {
              const foundFunction = modelData.functions.find(f => f.id === productId);
              if (foundFunction) {
                return {
                  ...foundFunction,
                  brand: brandData.brand,
                  category: categoryData.name,
                  subCategory: subCategoryData.name, // Include subCategory name
                  seriesName: seriesData.seriesName,
                  modelNumber: modelData.modelNumber,
                };
              }
            }
          }
        }
      }
    }
    return null;
  };

  const findEquivalentProduct = (product1, targetBrandName) => {
    if (!product1 || !targetBrandName) return null;

    for (const equivalentId of product1.equivalentProductIds) {
      const equivalentProduct = findProductById(equivalentId);
      if (equivalentProduct && equivalentProduct.brand === targetBrandName) {
          return equivalentProduct;
      }
    }
    return null;
  };

  const handleProduct1FinalSelection = (productFunctionId) => {
    const fullProduct = findProductById(productFunctionId);
    setSelectedProduct1(fullProduct);

    if (selectedBrand2 && fullProduct) {
      const equivalent = findEquivalentProduct(fullProduct, selectedBrand2);
      setComparedProduct2(equivalent);
    } else {
      setComparedProduct2(null);
    }
  };

  const handleBrand2Selection = (brand) => {
    setComparedBrand2(brand);
    if (selectedProduct1 && brand) {
      const equivalent = findEquivalentProduct(selectedProduct1, brand);
      setComparedProduct2(equivalent);
    } else {
      setComparedProduct2(null);
    }
  };

  const allBrandNames = allBrandsData.map(b => b.brand);

  return (
    <div className="App">
      <div className="navbar-header">
        <img src={Images.AccentraLogo} alt="Accentra Logo" className="Logo"/>
        <img src={Images.CorbinRusswinLogo} alt="Corbin Russwin Logo" className="Logo"/>
        <img src={Images.SargentLogo} alt="Sargent Logo" className="Logo"/>
        <img src={Images.BESTAccessLogo} alt="BEST Access Logo" className="Logo"/>
        <img src={Images.VonDuprinLogo} alt="Von Duprin Logo" className="Logo"/>
        <img src={Images.SchlageLogo} alt="Schlage Logo" className="Logo"/>
        <h1>ASSA ABLOY Product Comparison Tool</h1>
      </div>

      <div className="selection-area">
        <ProductDrillDownSelector
          allBrandsData={allBrandsData}
          onSelectFinalProduct={handleProduct1FinalSelection}
          selectedProductId={selectedProduct1?.id || ''}
          selectedBrandName={selectedProduct1?.brand || ''}
          labelPrefix="Compare"
        />

        <div className="brand2-selector">
          <h2>Compare To:</h2>
          <select
            value={selectedBrand2}
            onChange={(e) => handleBrand2Selection(e.target.value)}
          >
            <option value="">Select Brand 2</option>
            {allBrandNames
              .filter(brandName => brandName !== (selectedProduct1?.brand || ''))
              .map(brandName => (
                <option key={brandName} value={brandName}>
                  {brandName}
                </option>
              ))}
          </select>
        </div>
      </div>

      {(selectedProduct1 && comparedProduct2) && (
        <ComparisonDisplay
          product1={selectedProduct1}
          product2={comparedProduct2}
        />
      )}

      {selectedProduct1 && !comparedProduct2 && selectedBrand2 && (
        <p className="no-equivalent-message">
          No direct equivalent found for "{selectedProduct1.functionName}" ({selectedProduct1.brand} {selectedProduct1.seriesName} {selectedProduct1.modelNumber}) in "{selectedBrand2}".
        </p>
      )}

      {!selectedProduct1 && !selectedBrand2 && (
        <p className="initial-message">Please select Brand and Product Function for Brand 1, then select Brand 2 to begin comparison.</p>
      )}
    </div>
  );
}

export default App;