import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormWrapper from '../../components/FormComponents/FormWrapper';
import FormSection from '../../components/FormComponents/FormSection';
import SelectField from '../../components/FormComponents/SelectField';
import TextField from '../../components/FormComponents/TextField';
import TextArea from '../../components/FormComponents/TextArea';
import ImageUpload from '../../components/FormComponents/ImageUpload';
import './CreateCategory.css';

const CreateCategory = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    description: '',
    image_url: '',
    link_url: '',
    link_icon_url: '',
    is_published: true
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const typeOptions = [
    { value: '', label: 'Select Type' },
    { value: 'Category', label: 'Category' },
    { value: 'Link', label: 'Link' }
  ];

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.type) {
      newErrors.type = 'Please select a type';
    }

    if (!formData.name) {
      newErrors.name = 'Name is required';
    }

    if (formData.type === 'Category') {
      if (!formData.description) {
        newErrors.description = 'Description is required for categories';
      }
    }

    if (formData.type === 'Link') {
      if (!formData.link_url) {
        newErrors.link_url = 'Link URL is required for links';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL || 'http://localhost:5000'}/api/categories`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setErrors({ submit: result.message || 'Failed to create category' });
      }
    } catch (error) {
      console.error('Error creating category:', error);
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="create-category-page">
      <FormWrapper title="Add Category" onSubmit={handleSubmit}>
        {submitSuccess && (
          <div className="alert alert-success animate__animated animate__fadeIn">
            Category Created Successfully!
          </div>
        )}

        {errors.submit && (
          <div className="alert alert-danger animate__animated animate__shakeX">
            {errors.submit}
          </div>
        )}

        <FormSection title="Category Type">
          <SelectField
            label="Select Type"
            name="type"
            value={formData.type}
            options={typeOptions}
            onChange={handleChange}
            error={errors.type}
            required
          />
        </FormSection>

        {formData.type === 'Category' && (
          <div className="animate__animated animate__fadeIn">
            <FormSection title="Category Information">
              <TextField
                label="Category Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="Enter category name"
                required
              />

              <TextArea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={errors.description}
                placeholder="Enter category description"
                rows={4}
                required
              />

              <ImageUpload
                label="Category Image"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                error={errors.image_url}
              />

              <div className="form-check form-switch mt-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="is_published"
                  checked={formData.is_published}
                  onChange={(e) => handleChange('is_published', e.target.checked)}
                />
                <label className="form-check-label" htmlFor="is_published">
                  Publish Category
                </label>
              </div>
            </FormSection>
          </div>
        )}

        {formData.type === 'Link' && (
          <div className="animate__animated animate__fadeIn">
            <FormSection title="Link Information">
              <TextField
                label="Link Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="Enter link name"
                required
              />

              <TextField
                label="Link URL"
                name="link_url"
                value={formData.link_url}
                onChange={handleChange}
                error={errors.link_url}
                placeholder="https://example.com"
                required
              />

              <ImageUpload
                label="Link Icon"
                name="link_icon_url"
                value={formData.link_icon_url}
                onChange={handleChange}
                error={errors.link_icon_url}
              />

              <div className="form-check form-switch mt-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="is_published_link"
                  checked={formData.is_published}
                  onChange={(e) => handleChange('is_published', e.target.checked)}
                />
                <label className="form-check-label" htmlFor="is_published_link">
                  Publish Link
                </label>
              </div>
            </FormSection>
          </div>
        )}

        {formData.type && (
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Creating...
                </>
              ) : (
                'Create Category'
              )}
            </button>
          </div>
        )}
      </FormWrapper>
    </div>
  );
};

export default CreateCategory;
