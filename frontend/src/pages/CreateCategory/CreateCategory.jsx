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

    // ⭐ Separate images for each section
    category_images: [],
    link_icon_images: [],

    link_url: '',
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

  /** ------------------------------
   * FORM CHANGE HANDLER
   --------------------------------*/
  const handleChange = (nameOrEvent, value) => {
    let fieldName, fieldValue;

    if (typeof nameOrEvent === 'string') {
      fieldName = nameOrEvent;
      fieldValue = value;
    } else {
      const event = nameOrEvent;
      fieldName = event.target.name;
      fieldValue = event.target.value;
    }

    setFormData(prev => ({ ...prev, [fieldName]: fieldValue }));

    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  /** ------------------------------
   * VALIDATION
   --------------------------------*/
  const validateForm = () => {
    const newErrors = {};

    if (!formData.type) newErrors.type = 'Please select a type';
    if (!formData.name) newErrors.name = 'Name is required';

    if (formData.type === 'Category' && !formData.description)
      newErrors.description = 'Description is required';

    if (formData.type === 'Link' && !formData.link_url)
      newErrors.link_url = 'Link URL is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** ------------------------------
   * SUBMIT HANDLER
   --------------------------------*/
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const apiUrl = `http://localhost:5000/api/categories`;

      const dataToSubmit = {
        type: formData.type,
        name: formData.name,

        description:
          formData.type === 'Category' ? formData.description : null,

        image_url:
          formData.type === 'Category'
            ? formData.category_images?.[0]?.url || null
            : null,

        link_url: formData.type === 'Link' ? formData.link_url : null,

        link_icon_url:
          formData.type === 'Link'
            ? formData.link_icon_images?.[0]?.url || null
            : null,

        is_published: formData.is_published
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit)
      });

      const result = await response.json();

      if (result.success) {
        setSubmitSuccess(true);
        setTimeout(() => navigate('/'), 2000);
      } else {
        setErrors({ submit: result.message || 'Failed to create entry' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-category-page">
      <FormWrapper title="Add Category" onSubmit={handleSubmit}>

        {/* ⭐ COMMON - Type Selection */}
        <FormSection title="Select Type">
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

        {/* ⭐ CATEGORY SECTION */}
        {formData.type === 'Category' && (
          <FormSection title="Category Information">

            <TextField
              label="Category Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
            />

            <TextArea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={errors.description}
              rows={4}
              required
            />

            <ImageUpload
              label="Category Image"
              images={formData.category_images}
              onImagesChange={(category_images) =>
                setFormData(prev => ({ ...prev, category_images }))
              }
            />

            <div className="form-check form-switch mt-4">
              <input
                className="form-check-input"
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) =>
                  handleChange('is_published', e.target.checked)
                }
              />
              <label className="form-check-label">Publish Category</label>
            </div>
          </FormSection>
        )}

        {/* ⭐ LINK SECTION */}
        {formData.type === 'Link' && (
          <FormSection title="Link Information">

            <TextField
              label="Link Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
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
              images={formData.link_icon_images}
              onImagesChange={(link_icon_images) =>
                setFormData(prev => ({ ...prev, link_icon_images }))
              }
            />

            <div className="form-check form-switch mt-4">
              <input
                className="form-check-input"
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) =>
                  handleChange('is_published', e.target.checked)
                }
              />
              <label className="form-check-label">Publish Link</label>
            </div>
          </FormSection>
        )}

      </FormWrapper>
    </div>
  );
};

export default CreateCategory;
