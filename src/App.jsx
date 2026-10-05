// src/App.jsx
import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import allBrandsData from './data/products';
import ProductDrillDownSelector from './components/ProductDrillDownSelector';
import ComparisonDisplay from './components/ComparisonDisplay';
import ConversationalSpecAdvisor from './components/ConversationalSpecAdvisor';
import PrefixesModal from './components/PrefixesModal';
import Images from './Images/images';
import { findProductById, findEquivalentProducts } from './utils/hardwareEngine';

function App() {
  const [viewMode, setViewMode] = useState('AI'); // 'AI' or 'CLASSIC'
  const [selectedMajorCategory, setSelectedMajorCategory] = useState('Exit Devices');
  const [selectedProduct1, setSelectedProduct1] = useState(null);
  const [selectedBrand2, setComparedBrand2] = useState('');
  const [comparedProduct2, setComparedProduct2] = useState(null);
  const [equivalentOptions, setEquivalentOptions] = useState([]);
  const [isPrefixesModalOpen, setIsPrefixesModalOpen] = useState(false);
  const [productForPrefixesModal, setProductForPrefixesModal] = useState(null);

  const comparisonRef = useRef(null);
  const allowedOtherBrands = ['Von Duprin', 'Best', 'Schlage'];

  // Unique major categories
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

  // Set default demo comparison on first load if desired
  useEffect(() => {
    const defaultP1 = findProductById('sargent-8313-et');
    if (defaultP1) {
      setSelectedProduct1(defaultP1);
      setComparedBrand2('Von Duprin');
      const eq = findEquivalentProducts(defaultP1, 'Von Duprin');
      setEquivalentOptions(eq);
      setComparedProduct2(eq[0] || null);
    }
  }, []);

  const handleProduct1FinalSelection = (productFunctionId) => {
    const fullProduct = findProductById(productFunctionId);
    setSelectedProduct1(fullProduct);

    if (fullProduct && fullProduct.category) {
      setSelectedMajorCategory(fullProduct.category);
    }

    setComparedBrand2('');
    setComparedProduct2(null);
    setEquivalentOptions([]);
  };

  const handleBrand2Selection = (brand) => {
    setComparedBrand2(brand);
    const equivalents = findEquivalentProducts(selectedProduct1, brand);
    setEquivalentOptions(equivalents);
    setComparedProduct2(equivalents[0] || null);
  };

  const handleEquivalentSelection = (productId) => {
    setComparedProduct2(equivalentOptions.find(product => product.id === productId) || null);
  };

  const handleMajorCategorySelection = (category) => {
    setSelectedMajorCategory(category);
    setSelectedProduct1(null);
    setComparedBrand2('');
    setComparedProduct2(null);
    setEquivalentOptions([]);
    setIsPrefixesModalOpen(false);
  };

  const handleShowPrefixesModal = (product) => {
    setProductForPrefixesModal(product);
    setIsPrefixesModalOpen(true);
  };

  const handleClosePrefixesModal = () => {
    setIsPrefixesModalOpen(false);
    setProductForPrefixesModal(null);
  };

  // Callback from AI Assistant to immediately open classic comparison
  const handleSelectFromAdvisor = (p1, p2) => {
    setSelectedProduct1(p1);
    if (p1 && p1.category) {
      setSelectedMajorCategory(p1.category);
    }
    if (p2) {
      setComparedBrand2(p2.brand);
      const eq = findEquivalentProducts(p1, p2.brand);
      setEquivalentOptions(eq);
      setComparedProduct2(p2);
    }
    setViewMode('CLASSIC');
    setTimeout(() => {
      comparisonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  // Scroll to comparison section when comparison is active in Classic mode
  useEffect(() => {
    if (selectedProduct1 && comparedProduct2 && comparisonRef.current && viewMode === 'CLASSIC') {
      const timer = setTimeout(() => {
        comparisonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [selectedProduct1, comparedProduct2, viewMode]);

  return (
    <div className="App">
      {/* Top Navigation Bar */}
      <header className="navbar-header">
        <div className="header-brand-wrap">
          <div className="header-logo-badge">
            <img src={Images.AllBrandsLogo} alt="Architectural Brands: Sargent, Von Duprin, Best, Schlage" className="Logo" />
          </div>
          <div className="header-text-block">
            <div className="header-title-row">
              <h1>Sargent Product Comparison Tool</h1>
              <span className="header-status-badge">
                <span className="status-dot"></span> Grade 1 Specification Engine
              </span>
            </div>
            <p className="header-subtitle">
              Architectural Hardware Cross-Reference & ANSI/BHMA Function Bridge
            </p>
          </div>
        </div>

        {/* Minimal View Switcher */}
        <div className="view-mode-selector">
          <button
            className={`view-mode-pill ${viewMode === 'AI' ? 'active' : ''}`}
            onClick={() => setViewMode('AI')}
          >
            ✨ AI Spec Advisor
          </button>
          <button
            className={`view-mode-pill ${viewMode === 'CLASSIC' ? 'active' : ''}`}
            onClick={() => setViewMode('CLASSIC')}
          >
            📋 Classic Comparison
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="main-content">
        {viewMode === 'AI' ? (
          <ConversationalSpecAdvisor onSelectComparison={handleSelectFromAdvisor} />
        ) : (
          <div className="classic-selector-view">
            {/* Category Tabs */}
            <div className="category-tabs-container">
              <h2>Select Product Category:</h2>
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

            {/* Selection Grid */}
            {selectedMajorCategory && (
              <div className="selection-area">
                <div className="selection-column left">
                  <div className="column-title">1. Baseline Hardware (Sargent)</div>
                  <ProductDrillDownSelector
                    allBrandsData={allBrandsData}
                    onSelectFinalProduct={handleProduct1FinalSelection}
                    selectedProductId={selectedProduct1?.id || ''}
                    selectedBrandName={selectedProduct1?.brand || ''}
                    labelPrefix="Select"
                    initialCategory={selectedMajorCategory}
                  />
                </div>

                <div className="selection-column right">
                  <div className="column-title">2. Approved Equivalent Brand</div>
                  <div className="brand2-selector">
                    <h3>Select Competitor Brand:</h3>
                    <select
                      value={selectedBrand2}
                      onChange={(e) => handleBrand2Selection(e.target.value)}
                      disabled={!selectedProduct1}
                    >
                      <option value="">Select Target Brand</option>
                      {allowedOtherBrands.map(brandName => (
                        <option key={brandName} value={brandName}>
                          {brandName}
                        </option>
                      ))}
                    </select>

                    {equivalentOptions.length > 1 && (
                      <div className="series-flip-wrap">
                        <h3>Matching Series / Architecture:</h3>
                        <select
                          className="equivalent-select"
                          value={comparedProduct2?.id || ''}
                          onChange={(e) => handleEquivalentSelection(e.target.value)}
                        >
                          {equivalentOptions.map(product => (
                            <option key={product.id} value={product.id}>
                              {product.seriesName} - {product.modelNumber}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Comparison Display */}
            {selectedProduct1 && comparedProduct2 && (
              <div ref={comparisonRef} className="comparison-section">
                <ComparisonDisplay
                  product1={selectedProduct1}
                  product2={comparedProduct2}
                  onShowPrefixes={handleShowPrefixesModal}
                />
              </div>
            )}

            {selectedMajorCategory && !selectedProduct1 && (
              <div className="selector-prompt-card">
                <div className="prompt-icon">👈</div>
                <p>Please select Series, Model, and Function in Column 1 to begin comparison.</p>
              </div>
            )}

            {selectedProduct1 && !comparedProduct2 && selectedBrand2 && (
              <div className="no-equivalent-card">
                <div className="prompt-icon">⚠️</div>
                <p>
                  No direct equivalent found for <strong>"{selectedProduct1.functionName}"</strong> in <strong>"{selectedBrand2}"</strong>.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Prefixes Modal */}
      <PrefixesModal
        isOpen={isPrefixesModalOpen}
        onClose={handleClosePrefixesModal}
        product={productForPrefixesModal}
      />
    </div>
  );
}

export default App;