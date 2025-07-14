// src/components/ProductDrillDownSelector.js
import React, { useState, useEffect, useCallback } from 'react';

// Removed: import './ProductDrillDownSelector.css';

function ProductDrillDownSelector({ allBrandsData, onSelectFinalProduct, selectedBrandName, selectedProductId, labelPrefix, initialCategory }) {
  const [selectedBrand, setSelectedBrand] = useState(selectedBrandName || '');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || ''); // Initialize with initialCategory
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedSeries, setSelectedSeries] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedFunction, setSelectedFunction] = useState(''); // Initialize with empty string, will be updated by prop in useEffect

  // State to control the pulsing animation
  const [showSubCategory, setShowSubCategory] = useState(false);
  const [showSeries, setShowSeries] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [showFunction, setShowFunction] = useState(false);

  // Determine if the model selection should be skipped for Sargent Mortise/Bored Locks
  const shouldSkipModelSelection =
    (selectedBrand === 'Sargent' || selectedBrand === 'Corbin Russwin') &&
    (selectedCategory === 'Mortise Locks' || selectedCategory === 'Bored Locks') &&
    (selectedSubCategory === 'Mortise Locks' || selectedSubCategory === 'Bored Locks');

  // Helper functions to get data based on current selections, wrapped in useCallback
  const getBrands = useCallback((categoryName) => {
    if (!categoryName) return allBrandsData.map(b => b.brand);
    const brandsWithCategory = allBrandsData.filter(brand =>
      brand.categories.some(cat => cat.name === categoryName)
    );
    return brandsWithCategory.map(b => b.brand);
  }, [allBrandsData]); // allBrandsData is a prop

  const getSubCategories = useCallback((brandName, categoryName) => {
    const brand = allBrandsData.find(b => b.brand === brandName);
    const category = brand?.categories.find(c => c.name === categoryName);
    return category ? category.subCategories : [];
  }, [allBrandsData]);

  const getSeries = useCallback((brandName, categoryName, subCategoryName) => {
    const brand = allBrandsData.find(b => b.brand === brandName);
    const category = brand?.categories.find(c => c.name === categoryName);
    const subCategory = category?.subCategories.find(sc => sc.name === subCategoryName);
    return subCategory ? subCategory.series : [];
  }, [allBrandsData]);

  const getModels = useCallback((brandName, categoryName, subCategoryName, seriesName) => {
    const brand = allBrandsData.find(b => b.brand === brandName);
    const category = brand?.categories.find(c => c.name === categoryName);
    const subCategory = category?.subCategories.find(sc => sc.name === subCategoryName);
    const series = subCategory?.series.find(s => s.seriesName === seriesName);
    return series ? series.models : [];
  }, [allBrandsData]);

  const getFunctions = useCallback((brandName, categoryName, subCategoryName, seriesName, modelNumber) => {
    const brand = allBrandsData.find(b => b.brand === brandName);
    const category = brand?.categories.find(c => c.name === categoryName);
    const subCategory = category?.subCategories.find(sc => sc.name === subCategoryName);
    const series = subCategory?.series.find(s => s.seriesName === seriesName);

    if (!series) return [];

    const skipModelCalculation =
      (brandName === 'Sargent' || brandName === 'Corbin') && // Corrected 'Corbin Russwin' to 'Corbin' for data consistency if needed, but original was 'Corbin Russwin'
      (categoryName === 'Mortise Locks' || categoryName === 'Bored Locks') &&
      (subCategoryName === 'Mortise Locks' || subCategoryName === 'Bored Locks');

    if (skipModelCalculation) {
      let allSeriesFunctions = [];
      series.models.forEach(model => {
        allSeriesFunctions = allSeriesFunctions.concat(model.functions);
      });
      return allSeriesFunctions;
    } else {
      const model = series.models.find(m => m.modelNumber === modelNumber);
      return model ? model.functions : [];
    }
  }, [allBrandsData]); // This function depends on allBrandsData

  useEffect(() => {
    // If the initialCategory prop changes, update the internal selectedCategory state
    if (initialCategory && initialCategory !== selectedCategory) {
      setSelectedCategory(initialCategory);
      setSelectedBrand(''); // Reset brand if category changes from parent
      setSelectedSubCategory('');
      setSelectedSeries('');
      setSelectedModel('');
      setSelectedFunction('');
      onSelectFinalProduct(null);
      // Reset visibility states on category change
      setShowSubCategory(false);
      setShowSeries(false);
      setShowModel(false);
      setShowFunction(false);
    } else if (!initialCategory && selectedCategory) { // If parent clears category, reset everything
      setSelectedCategory('');
      setSelectedBrand('');
      setSelectedSubCategory('');
      setSelectedSeries('');
      setSelectedModel('');
      setSelectedFunction('');
      onSelectFinalProduct(null);
      // Reset visibility states if parent clears category
      setShowSubCategory(false);
      setShowSeries(false);
      setShowModel(false);
      setShowFunction(false);
    }

    // This condition ensures internal product ID state is updated only when the prop changes
    if (selectedProductId !== selectedFunction) {
      setSelectedFunction(selectedProductId || '');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCategory, selectedBrandName, selectedProductId]);

  useEffect(() => {
    // Trigger glow for sub-category
    if (selectedBrand && !selectedSubCategory && getSubCategories(selectedBrand, selectedCategory).length > 0) {
      setShowSubCategory(true);
      const timer = setTimeout(() => setShowSubCategory(false), 1500); // Duration of the glow
      return () => clearTimeout(timer);
    } else {
      setShowSubCategory(false);
    }
  }, [selectedBrand, selectedCategory, selectedSubCategory, getSubCategories]); // Added getSubCategories to dependencies

  useEffect(() => {
    // Trigger glow for series
    if (selectedSubCategory && !selectedSeries && getSeries(selectedBrand, selectedCategory, selectedSubCategory).length > 0) {
      setShowSeries(true);
      const timer = setTimeout(() => setShowSeries(false), 1500);
      return () => clearTimeout(timer);
    } else {
      setShowSeries(false);
    }
  }, [selectedBrand, selectedCategory, selectedSubCategory, selectedSeries, getSeries]); // Added getSeries to dependencies

  useEffect(() => {
    // Trigger glow for model
    if (selectedSeries && !shouldSkipModelSelection && !selectedModel && getModels(selectedBrand, selectedCategory, selectedSubCategory, selectedSeries).length > 0) {
      setShowModel(true);
      const timer = setTimeout(() => setShowModel(false), 1500);
      return () => clearTimeout(timer);
    } else {
      setShowModel(false);
    }
  }, [selectedBrand, selectedCategory, selectedSubCategory, selectedSeries, selectedModel, shouldSkipModelSelection, getModels]); // Added shouldSkipModelSelection and getModels to dependencies

  useEffect(() => {
    // Trigger glow for function
    if ((selectedModel || (shouldSkipModelSelection && selectedSeries)) && !selectedFunction && getFunctions(selectedBrand, selectedCategory, selectedSubCategory, selectedSeries, shouldSkipModelSelection ? null : selectedModel).length > 0) {
      setShowFunction(true);
      const timer = setTimeout(() => setShowFunction(false), 1500);
      return () => clearTimeout(timer);
    } else {
      setShowFunction(false);
    }
  }, [selectedBrand, selectedCategory, selectedSubCategory, selectedSeries, selectedModel, selectedFunction, shouldSkipModelSelection, getFunctions]); // Added shouldSkipModelSelection and getFunctions to dependencies

  // Handlers for dropdown changes
  const handleBrandChange = (e) => {
    const brand = e.target.value;
    setSelectedBrand(brand);
    setSelectedSubCategory('');
    setSelectedSeries('');
    setSelectedModel('');
    setSelectedFunction('');
    onSelectFinalProduct(null);
    // Reset visibility for subsequent dropdowns
    setShowSubCategory(false);
    setShowSeries(false);
    setShowModel(false);
    setShowFunction(false);
  };

  const handleSubCategoryChange = (e) => {
    const subCategory = e.target.value;
    setSelectedSubCategory(subCategory);
    setSelectedSeries('');
    setSelectedModel('');
    setSelectedFunction('');
    onSelectFinalProduct(null);
    setShowSeries(false);
    setShowModel(false);
    setShowFunction(false);
  };

  const handleSeriesChange = (e) => {
    const series = e.target.value;
    setSelectedSeries(series);
    setSelectedModel('');
    setSelectedFunction('');
    onSelectFinalProduct(null);
    setShowModel(false);
    setShowFunction(false);
  };

  const handleModelChange = (e) => {
    const model = e.target.value;
    setSelectedModel(model);
    setSelectedFunction('');
    onSelectFinalProduct(null);
    setShowFunction(false);
  };

  const handleFunctionChange = (e) => {
    const functionId = e.target.value;
    setSelectedFunction(functionId);
    onSelectFinalProduct(functionId);
  };

  const availableBrands = getBrands(initialCategory);
  const subCategories = getSubCategories(selectedBrand, selectedCategory);
  const series = getSeries(selectedBrand, selectedCategory, selectedSubCategory);
  const models = getModels(selectedBrand, selectedCategory, selectedSubCategory, selectedSeries);
  const functions = getFunctions(
    selectedBrand,
    selectedCategory,
    selectedSubCategory,
    selectedSeries,
    shouldSkipModelSelection ? null : selectedModel
  );

  return (
    <div className="product-selector">
      <div className="drilldown-grid-container">
        <div className="drilldown-item">
          <h2>{labelPrefix} Brand:</h2>
          <select value={selectedBrand} onChange={handleBrandChange}>
            <option value="">Select Brand</option>
            {availableBrands.map((brandName) => (
              <option key={brandName} value={brandName}>
                {brandName}
              </option>
            ))}
          </select>
        </div>

        {selectedBrand && subCategories.length > 0 && (
          <div className="drilldown-item">
            <h3>Select Sub-Category:</h3>
            <select
              value={selectedSubCategory}
              onChange={handleSubCategoryChange}
              className={showSubCategory ? 'pulsing-border' : ''} // Apply class here
            >
              <option value="">Select Sub-Category</option>
              {subCategories.map((subCat) => (
                <option key={subCat.name} value={subCat.name}>
                  {subCat.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedSubCategory && series.length > 0 && (
          <div className="drilldown-item">
            <h3>Select Series:</h3>
            <select
              value={selectedSeries}
              onChange={handleSeriesChange}
              className={showSeries ? 'pulsing-border' : ''} // Apply class here
            >
              <option value="">Select Series</option>
              {series.map((s) => (
                <option key={s.seriesName} value={s.seriesName}>
                  {s.seriesName}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedSeries && !shouldSkipModelSelection && models.length > 0 && (
          <div className="drilldown-item">
            <h3>Select Model:</h3>
            <select
              value={selectedModel}
              onChange={handleModelChange}
              className={showModel ? 'pulsing-border' : ''} // Apply class here
            >
              <option value="">Select Model</option>
              {models.map((m) => (
                <option key={m.modelNumber} value={m.modelNumber}>
                  {m.modelNumber}
                </option>
              ))}
            </select>
          </div>
        )}

        {(selectedModel || (shouldSkipModelSelection && selectedSeries)) && functions.length > 0 && (
          <div className="drilldown-item">
            <h3>Select Function/Trim:</h3>
            <select
              value={selectedFunction}
              onChange={handleFunctionChange}
              className={showFunction ? 'pulsing-border' : ''} // Apply class here
            >
              <option value="">Select Function</option>
              {functions.map((func) => (
                <option key={func.id} value={func.id}>
                  {func.functionName}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDrillDownSelector;