// src/App.js
import React, { useState } from 'react';
import './App.css';
import allBrandsData from './data/products';
import ProductDrillDownSelector from './components/ProductDrillDownSelector';
import ComparisonDisplay from './components/ComparisonDisplay';
import Images from './Images/images'; // Import the images module
import PrefixesModal from './components/PrefixesModal'; // NEW: Import PrefixesModal

function App() {
  const [selectedMajorCategory, setSelectedMajorCategory] = useState('');
  const [selectedProduct1, setSelectedProduct1] = useState(null);
  const [selectedBrand2, setComparedBrand2] = useState('');
  const [comparedProduct2, setComparedProduct2] = useState(null);
  const [isPrefixesModalOpen, setIsPrefixesModalOpen] = useState(false); // NEW: State for modal visibility
  const [productForPrefixesModal, setProductForPrefixesModal] = useState(null); // NEW: State for product data to show in modal

  // Helper to get unique major categories
  const getUniqueMajorCategories = () => {
    const categories = new Set();
    allBrandsData.forEach(brand => {
      brand.categories.forEach(category => {
        categories.add(category.name);
      });
    });
    return Array.from(categories);
  };

  const majorCategories = getUniqueMajorCategories();

  const findProductById = (productId) => {
    if (!productId) return null;
    for (const brandData of allBrandsData) {
      for (const categoryData of brandData.categories) {
        for (const subCategoryData of categoryData.subCategories) {
          for (const seriesData of subCategoryData.series) {
            for (const modelData of seriesData.models) {
              const foundFunction = modelData.functions.find(f => f.id === productId);
              if (foundFunction) {
                return {
                  ...foundFunction,
                  brand: brandData.brand,
                  category: categoryData.name,
                  subCategory: subCategoryData.name,
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

  const handleMajorCategorySelection = (category) => {
    setSelectedMajorCategory(category);
    setSelectedProduct1(null);
    setComparedBrand2('');
    setComparedProduct2(null);
    setIsPrefixesModalOpen(false); // Close modal if open
    setProductForPrefixesModal(null); // Clear modal product
  };

  // NEW: Handlers for Prefixes Modal
  const handleShowPrefixesModal = (product) => {
    setProductForPrefixesModal(product);
    setIsPrefixesModalOpen(true);
  };

  const handleClosePrefixesModal = () => {
    setIsPrefixesModalOpen(false);
    setProductForPrefixesModal(null);
  };

  const allBrandNames = allBrandsData.map(b => b.brand);

  return (
    <div className="App">
      <div className="navbar-header">
        <img src={Images.AccentraLogo} alt="Accentra Logo" className="Logo"/>
        <img src={Images.CorbinRusswinLogo} alt="Corbin Russwin Logo" className="Logo"/>
        <img src={Images.SargentLogo} alt="Sargent Logo" className="Logo"/>
        <img src={Images.BESTAccessLogo} alt="BEST Access Logo" className="Logo"/>
        <img src={Images.VonDuprinLogo} alt="VonDuprin Logo" className="Logo"/>
        <img src={Images.SchlageLogo} alt="Schlage Logo" className="Logo"/>
        <h1>ASSA ABLOY Product Comparison Tool</h1>
      </div>

      <div className="category-tabs-container">
        <h2>Select a Product Category:</h2>
        <div className="category-tabs">
          {majorCategories.map((category) => (
            <button
              key={category}
              className={`category-tab ${selectedMajorCategory === category ? 'active' : ''}`}
              onClick={() => handleMajorCategorySelection(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {selectedMajorCategory && (
        <>
          <div className="selection-area">
            <ProductDrillDownSelector
              allBrandsData={allBrandsData}
              onSelectFinalProduct={handleProduct1FinalSelection}
              selectedProductId={selectedProduct1?.id || ''}
              selectedBrandName={selectedProduct1?.brand || ''}
              labelPrefix="Compare"
              initialCategory={selectedMajorCategory}
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

        </>
      )}

      {(selectedProduct1 && comparedProduct2) && (
        <ComparisonDisplay
          product1={selectedProduct1}
          product2={comparedProduct2}
          onShowPrefixes={handleShowPrefixesModal} // Pass modal handler to ComparisonDisplay
        />
      )}

      {selectedMajorCategory && !selectedProduct1 && (
        <p className="initial-message">Please select Brand and Product Function for Brand 1, then select Brand 2 to begin comparison.</p>
      )}

      {selectedProduct1 && !comparedProduct2 && selectedBrand2 && (
        <p className="no-equivalent-message">
          No direct equivalent found for "{selectedProduct1.functionName}" ({selectedProduct1.brand} {selectedProduct1.seriesName} {selectedProduct1.modelNumber}) in "{selectedBrand2}".
        </p>
      )}

      {!selectedMajorCategory && (
        <p className="initial-message">Please select a product category above to begin.</p>
      )}

      {/* NEW: Prefixes Modal */}
      <PrefixesModal
        isOpen={isPrefixesModalOpen}
        onClose={handleClosePrefixesModal}
        product={productForPrefixesModal}
      />
    </div>
  );
}

export default App;