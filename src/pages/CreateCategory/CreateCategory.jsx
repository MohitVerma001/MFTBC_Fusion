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
    images: [],
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.type) newErrors.type = 'Please select a type';
    if (!formData.name) newErrors.name = 'Name is required';

    if (formData.type === 'Category' && !formData.description)
      newErrors.description = 'Description is required for categories';

    if (formData.type === 'Link' && !formData.link_url)
      newErrors.link_url = 'Link URL is required for links';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const apiUrl = `http://localhost:5000/api/categories`;

      const dataToSubmit = {
        type: formData.type,
        name: formData.name,
        description: formData.type === 'Category' ? formData.description : null,
        image_url: formData.images?.[0]?.url || null,
        link_url: formData.type === 'Link' ? formData.link_url : null,
        link_icon_url: formData.type === 'Link' ? formData.link_icon_url : null,
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
        setErrors({ submit: result.message || 'Failed to create category' });
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

        {/* ⭐ ADD BACK THIS BLOCK */}
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

        {/* ⭐ Now Category section will show properly */}
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
              images={formData.images}
              onImagesChange={(images) =>
                setFormData(prev => ({ ...prev, images }))
              }
            />

            <div className="form-check form-switch mt-4">
              <input
                className="form-check-input"
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => handleChange('is_published', e.target.checked)}
              />
              <label className="form-check-label">
                Publish Category
              </label>
            </div>
          </FormSection>
        )}

      </FormWrapper>
    </div>
  );
};

export default CreateCategory;
