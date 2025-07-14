// src/components/ProductDrillDownSelector.js
import React, { useState, useEffect } from 'react';

function ProductDrillDownSelector({ allBrandsData, onSelectFinalProduct, selectedBrandName, selectedProductId, labelPrefix, initialCategory }) {
  const [selectedBrand, setSelectedBrand] = useState(selectedBrandName || '');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || ''); // Initialize with initialCategory
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedSeries, setSelectedSeries] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedFunction, setSelectedFunction] = useState(selectedProductId || '');

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
    } else if (!initialCategory && selectedCategory) { // If parent clears category, reset everything
      setSelectedCategory('');
      setSelectedBrand('');
      setSelectedSubCategory('');
      setSelectedSeries('');
      setSelectedModel('');
      setSelectedFunction('');
      onSelectFinalProduct(null);
    }

    // This condition ensures internal product ID state is updated only when the prop changes
    if (selectedProductId !== selectedFunction) {
      setSelectedFunction(selectedProductId || '');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCategory, selectedBrandName, selectedProductId]); // Dependencies include initialCategory prop

  // Determine if the model selection should be skipped for Sargent Mortise/Bored Locks
  const shouldSkipModelSelection =
    (selectedBrand === 'Sargent' || selectedBrand === 'Corbin Russwin') &&
    (selectedCategory === 'Mortise Locks' || selectedCategory === 'Bored Locks') &&
    (selectedSubCategory === 'Mortise Locks' || selectedSubCategory === 'Bored Locks');

  // Helper functions to get data based on current selections
  // Modified to filter brands based on the initialCategory
  const getBrands = (categoryName) => {
    if (!categoryName) return allBrandsData.map(b => b.brand); // If no category selected, return all brands
    const brandsWithCategory = allBrandsData.filter(brand =>
      brand.categories.some(cat => cat.name === categoryName)
    );
    return brandsWithCategory.map(b => b.brand);
  };

  // getCategories is no longer used for a dropdown in this component
  // const getCategories = (brandName) => {
  //   const brand = allBrandsData.find(b => b.brand === brandName);
  //   return brand ? brand.categories : [];
  // };

  const getSubCategories = (brandName, categoryName) => {
    const brand = allBrandsData.find(b => b.brand === brandName);
    const category = brand?.categories.find(c => c.name === categoryName);
    return category ? category.subCategories : [];
  };

  const getSeries = (brandName, categoryName, subCategoryName) => {
    const brand = allBrandsData.find(b => b.brand === brandName);
    const category = brand?.categories.find(c => c.name === categoryName);
    const subCategory = category?.subCategories.find(sc => sc.name === subCategoryName);
    return subCategory ? subCategory.series : [];
  };

  const getModels = (brandName, categoryName, subCategoryName, seriesName) => {
    const brand = allBrandsData.find(b => b.brand === brandName);
    const category = brand?.categories.find(c => c.name === categoryName);
    const subCategory = category?.subCategories.find(sc => sc.name === subCategoryName);
    const series = subCategory?.series.find(s => s.seriesName === seriesName);
    return series ? series.models : [];
  };

  const getFunctions = (brandName, categoryName, subCategoryName, seriesName, modelNumber) => {
    const brand = allBrandsData.find(b => b.brand === brandName);
    const category = brand?.categories.find(c => c.name === categoryName);
    const subCategory = category?.subCategories.find(sc => sc.name === subCategoryName);
    const series = subCategory?.series.find(s => s.seriesName === seriesName);

    if (!series) return [];

    if (shouldSkipModelSelection && (brandName === 'Sargent' || brandName === 'Corbin Russwin') && (categoryName === 'Mortise Locks' || categoryName === 'Bored Locks')) {
      let allSeriesFunctions = [];
      series.models.forEach(model => {
        allSeriesFunctions = allSeriesFunctions.concat(model.functions);
      });
      return allSeriesFunctions;
    } else {
      const model = series.models.find(m => m.modelNumber === modelNumber);
      return model ? model.functions : [];
    }
  };

  // Handlers for dropdown changes
  const handleBrandChange = (e) => {
    const brand = e.target.value;
    setSelectedBrand(brand);
    // Keep selectedCategory if it came from parent (initialCategory)
    setSelectedSubCategory('');
    setSelectedSeries('');
    setSelectedModel('');
    setSelectedFunction('');
    onSelectFinalProduct(null);
  };

  // handleCategoryChange is no longer needed as the dropdown is removed
  // const handleCategoryChange = (e) => {
  //   const category = e.target.value;
  //   setSelectedCategory(category);
  //   setSelectedSubCategory('');
  //   setSelectedSeries('');
  //   setSelectedModel('');
  //   setSelectedFunction('');
  //   onSelectFinalProduct(null);
  // };

  const handleSubCategoryChange = (e) => {
    const subCategory = e.target.value;
    setSelectedSubCategory(subCategory);
    setSelectedSeries('');
    setSelectedModel('');
    setSelectedFunction('');
    onSelectFinalProduct(null);
  };

  const handleSeriesChange = (e) => {
    const series = e.target.value;
    setSelectedSeries(series);
    setSelectedModel('');
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
    onSelectFinalProduct(functionId);
  };

  // Filter brands based on the initialCategory if provided
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
      <h2>{labelPrefix} Brand:</h2>
      <select value={selectedBrand} onChange={handleBrandChange}>
        <option value="">Select Brand</option>
        {availableBrands.map((brandName) => (
          <option key={brandName} value={brandName}>
            {brandName}
          </option>
        ))}
      </select>

      {/* NEW: Category selection is now handled by tabs in App.js, so this dropdown is hidden if initialCategory is present */}
      {/* {selectedBrand && !initialCategory && (
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
      )} */}

      {selectedBrand && selectedCategory && ( // Sub-Category depends on selectedBrand and selectedCategory (which might be from initialCategory)
        <>
          <h3>Select Sub-Category:</h3>
          <select value={selectedSubCategory} onChange={handleSubCategoryChange}>
            <option value="">Select Sub-Category</option>
            {subCategories.map((subCat) => (
              <option key={subCat.name} value={subCat.name}>
                {subCat.name}
              </option>
            ))}
          </select>
        </>
      )}

      {selectedSubCategory && ( // Series depends on sub-category
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