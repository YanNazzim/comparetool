// src/App.js
import React, { useState, useRef, useEffect } from 'react'; // Import useRef and useEffect
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

  // Create a ref for the comparison container
  const comparisonRef = useRef(null);

  // Define the brands that can be compared against Sargent
  const allowedOtherBrands = ['Best', 'Von Duprin', 'Schlage'];

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

    // Reset Brand 2 selection and comparison when Product 1 changes
    setComparedBrand2('');
    setComparedProduct2(null);
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

  // Filter available brand 2 options based on selectedProduct1
  const getAvailableBrand2Options = () => {
    if (!selectedProduct1) {
      // If no product 1 is selected yet, no brands can be selected for Brand 2.
      // This helps guide the user to select Product 1 first.
      return [];
    }

    const brand1 = selectedProduct1.brand;
    if (brand1 === 'Sargent') {
      // If Product 1 is Sargent, Brand 2 can be any of the allowed other brands
      return allowedOtherBrands;
    } else if (allowedOtherBrands.includes(brand1)) {
      // If Product 1 is one of the allowed other brands, Brand 2 must be Sargent
      return ['Sargent'];
    }
    // If Product 1 is from any other brand not in the allowed list,
    // or if the comparison logic needs to be stricter, return an empty array
    return [];
  };

  const availableBrand2Options = getAvailableBrand2Options();

  // Effect to scroll to the comparison section when both products are selected
  useEffect(() => {
    if (selectedProduct1 && comparedProduct2 && comparisonRef.current) {
      comparisonRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedProduct1, comparedProduct2]);


  return (
    <div className="App">
      <div className="navbar-header">
        <img src={Images.AllBrandsLogo} alt="All Brands Logo" className="Logo"/>
        <h1>Sargent Product Comparison Tool</h1>
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
                disabled={!selectedProduct1} // Disable until Product 1 is selected
              >
                <option value="">Select Brand 2</option>
                {availableBrand2Options.map(brandName => (
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
        <div ref={comparisonRef}>
          <ComparisonDisplay
            product1={selectedProduct1}
            product2={comparedProduct2}
            onShowPrefixes={handleShowPrefixesModal}
          />
        </div>
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