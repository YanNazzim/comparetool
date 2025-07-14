// src/components/ProductDrillDownSelector.js
import React, { useState, useEffect } from 'react';

function ProductDrillDownSelector({ allBrandsData, onSelectFinalProduct, selectedBrandName, selectedProductId, labelPrefix }) {
  const [selectedBrand, setSelectedBrand] = useState(selectedBrandName || '');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSeries, setSelectedSeries] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedFunction, setSelectedFunction] = useState(selectedProductId || '');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // This condition ensures internal state is updated only when the prop changes
    // from the parent, allowing internal user selections to stick.
    if (selectedBrandName !== selectedBrand) {
      setSelectedBrand(selectedBrandName || '');
      setSelectedCategory('');
      setSelectedSeries('');
      setSelectedModel('');
      setSelectedFunction('');
    } else if (!selectedBrandName && selectedBrand) { // If parent clears brand, reset everything
      setSelectedBrand('');
      setSelectedCategory('');
      setSelectedSeries('');
      setSelectedModel('');
      setSelectedFunction('');
    }

    if (selectedProductId !== selectedFunction) {
      setSelectedFunction(selectedProductId || '');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBrandName, selectedProductId]); // Dependencies are only the props.

  // Determine if the model selection should be skipped for Sargent Mortise/Bored Locks
  const shouldSkipModelSelection =
    (selectedBrand === 'Sargent' || selectedBrand === 'Corbin Russwin') &&
    (selectedCategory === 'Mortise Locks' || selectedCategory === 'Bored Locks');

  // Helper functions to get data based on current selections
  const getCategories = (brandName) => {
    const brand = allBrandsData.find(b => b.brand === brandName);
    return brand ? brand.categories : [];
  };

  const getSeries = (brandName, categoryName) => {
    const brand = allBrandsData.find(b => b.brand === brandName);
    const category = brand?.categories.find(c => c.name === categoryName);
    return category ? category.series : [];
  };

  const getModels = (brandName, categoryName, seriesName) => {
    const brand = allBrandsData.find(b => b.brand === brandName);
    const category = brand?.categories.find(c => c.name === categoryName);
    const series = category?.series.find(s => s.seriesName === seriesName);
    return series ? series.models : [];
  };

  // Modified getFunctions to handle skipping model selection
  const getFunctions = (brandName, categoryName, seriesName, modelNumber) => {
    const brand = allBrandsData.find(b => b.brand === brandName);
    const category = brand?.categories.find(c => c.name === categoryName);
    const series = category?.series.find(s => s.seriesName === seriesName);

    if (!series) return [];

    // If model selection is skipped for Sargent Mortise/Bored Locks,
    // return all functions from all models within the selected series
    if (shouldSkipModelSelection && (brandName === 'Sargent' || brandName === 'Corbin Russwin') && (categoryName === 'Mortise Locks' || categoryName === 'Bored Locks')) {
      let allSeriesFunctions = [];
      series.models.forEach(model => {
        allSeriesFunctions = allSeriesFunctions.concat(model.functions);
      });
      return allSeriesFunctions;
    } else {
      // Normal flow: return functions from a specific model
      const model = series.models.find(m => m.modelNumber === modelNumber);
      return model ? model.functions : [];
    }
  };


  // Handlers for dropdown changes
  const handleBrandChange = (e) => {
    const brand = e.target.value;
    setSelectedBrand(brand);
    setSelectedCategory('');
    setSelectedSeries('');
    setSelectedFunction('');
    onSelectFinalProduct(null); // Reset product on higher-level change
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setSelectedSeries('');
    setSelectedModel(''); // Always reset model
    setSelectedFunction('');
    onSelectFinalProduct(null);
  };

  const handleSeriesChange = (e) => {
    const series = e.target.value;
    setSelectedSeries(series);
    setSelectedModel(''); // Always reset model
    setSelectedFunction('');
    onSelectFinalProduct(null);
  };

  const handleModelChange = (e) => {
    const model = e.target.value;
    setSelectedModel(model);
    setSelectedFunction('');
    onSelectFinalProduct(null);
  };

  const handleFunctionChange = (e) => {
    const functionId = e.target.value;
    setSelectedFunction(functionId);
    onSelectFinalProduct(functionId); // Pass ONLY the ID to parent
  };

  const brands = allBrandsData.map(b => b.brand);
  const categories = getCategories(selectedBrand);
  const series = getSeries(selectedBrand, selectedCategory);
  // models are only relevant if not skipping the model selection
  const models = getModels(selectedBrand, selectedCategory, selectedSeries);

  // Functions are retrieved based on whether model selection is skipped or not
  const functions = getFunctions(
    selectedBrand,
    selectedCategory,
    selectedSeries,
    shouldSkipModelSelection ? null : selectedModel // Pass null model if skipping
  );


  return (
    <div className="product-selector">
      <h2>{labelPrefix} Brand:</h2>
      <select value={selectedBrand} onChange={handleBrandChange}>
        <option value="">Select Brand</option>
        {brands.map((brandName) => (
          <option key={brandName} value={brandName}>
            {brandName}
          </option>
        ))}
      </select>

      {selectedBrand && (
        <>
          <h3>Select Category:</h3>
          <select value={selectedCategory} onChange={handleCategoryChange}>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </>
      )}

      {selectedCategory && (
        <>
          <h3>Select Series:</h3>
          <select value={selectedSeries} onChange={handleSeriesChange}>
            <option value="">Select Series</option>
            {series.map((s) => (
              <option key={s.seriesName} value={s.seriesName}>
                {s.seriesName}
              </option>
            ))}
          </select>
        </>
      )}

      {/* Conditionally render Model selector: only show if not skipping model selection */}
      {selectedSeries && !shouldSkipModelSelection && (
        <>
          <h3>Select Model:</h3>
          <select value={selectedModel} onChange={handleModelChange}>
            <option value="">Select Model</option>
            {models.map((m) => (
              <option key={m.modelNumber} value={m.modelNumber}>
                {m.modelNumber}
              </option>
            ))}
          </select>
        </>
      )}

      {/* Render Function/Trim selector if a model is selected OR if model selection is skipped and series is selected */}
      {(selectedModel || (shouldSkipModelSelection && selectedSeries)) && (
        <>
          <h3>Select Function/Trim:</h3>
          <select value={selectedFunction} onChange={handleFunctionChange}>
            <option value="">Select Function</option>
            {functions.map((func) => (
              <option key={func.id} value={func.id}>
                {func.functionName}
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  );
}

export default ProductDrillDownSelector;