import React, { useState, useEffect } from 'react';
import SelectField from '../FormComponents/SelectField';
import './CategoryDropdown.css';

const CategoryDropdown = ({ value, onChange, publishTo, error, required = false }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (publishTo === 'HR') {
      fetchCategories();
    } else {
      setCategories([]);
      setLoading(false);
    }
  }, [publishTo]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setFetchError(null);

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL || 'http://localhost:5000'}/api/categories?type=Category`;

      const response = await fetch(apiUrl);
      const result = await response.json();

      if (result.success) {
        setCategories(result.data || []);
      } else {
        setFetchError('Failed to load categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setFetchError('Network error while loading categories');
    } finally {
      setLoading(false);
    }
  };

  if (publishTo !== 'HR') {
    return null;
  }

  const categoryOptions = [
    { value: '', label: 'Select a category' },
    ...categories.map(cat => ({
      value: cat.id,
      label: cat.name
    }))
  ];

  return (
    <div className="category-dropdown-wrapper">
      {loading ? (
        <div className="category-loading">
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Loading categories...
        </div>
      ) : fetchError ? (
        <div className="alert alert-warning">
          {fetchError}
        </div>
      ) : (
        <SelectField
          label="Category"
          name="category_id"
          value={value}
          options={categoryOptions}
          onChange={(name, val) => onChange(name, val)}
          error={error}
          required={required}
        />
      )}
    </div>
  );
};

export default CategoryDropdown;
