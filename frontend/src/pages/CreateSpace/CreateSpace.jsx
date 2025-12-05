import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import FormWrapper from "../../components/FormComponents/FormWrapper";
import FormSection from "../../components/FormComponents/FormSection";
import TextField from "../../components/FormComponents/TextField";
import SelectField from "../../components/FormComponents/SelectField";
import ImageUpload from "../../components/FormComponents/ImageUpload";
import RichTextEditor from "../../components/FormComponents/RichTextEditor";
import DateTimeField from "../../components/FormComponents/DateTimeField";
import { spacesApi } from "../../services";
import "./CreateSpace.css";

const CreateSpace = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    language: "English",
    imageUrl: "",
    description: "",
    visibility: "public",
    scheduledAt: "",
    isPublished: true
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingSpace, setLoadingSpace] = useState(false);

  const languageOptions = [
    { value: "English", label: "English" },
    { value: "Japanese", label: "日本語 (Japanese)" },
    { value: "German", label: "Deutsch (German)" },
    { value: "Spanish", label: "Español (Spanish)" },
    { value: "French", label: "Français (French)" }
  ];

  useEffect(() => {
    if (isEditMode) {
      loadSpace();
    }
  }, [id]);

  const loadSpace = async () => {
    try {
      setLoadingSpace(true);
      const result = await spacesApi.getById(id);
      if (result.success && result.data) {
        const space = result.data;
        setFormData({
          name: space.name || "",
          language: space.language || "English",
          imageUrl: space.image_url || "",
          description: space.description || "",
          visibility: space.visibility || "public",
          scheduledAt: space.scheduled_at || "",
          isPublished: space.is_published !== false
        });
      }
    } catch (error) {
      console.error("Error loading space:", error);
      alert("Failed to load space data");
    } finally {
      setLoadingSpace(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleDescriptionChange = (value) => {
    setFormData(prev => ({
      ...prev,
      description: value
    }));
    if (errors.description) {
      setErrors(prev => ({ ...prev, description: "" }));
    }
  };

  const handleImageUpload = (files) => {
    if (files && files.length > 0) {
      const imageUrl = files[0].url;
      setFormData(prev => ({
        ...prev,
        imageUrl
      }));
    }
  };

  const handleImageRemove = () => {
    setFormData(prev => ({
      ...prev,
      imageUrl: ""
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Space name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.name,
        language: formData.language,
        image_url: formData.imageUrl,
        description: formData.description,
        content_html: formData.description,
        visibility: formData.visibility,
        scheduled_at: formData.scheduledAt || null,
        is_published: formData.isPublished,
        created_by: "00000000-0000-0000-0000-000000000001"
      };

      let result;
      if (isEditMode) {
        result = await spacesApi.update(id, payload);
      } else {
        result = await spacesApi.create(payload);
      }

      if (result.success) {
        alert(isEditMode ? "Space updated successfully!" : "Space created successfully!");
        navigate("/my-spaces");
      } else {
        alert(result.message || "Failed to save space");
      }
    } catch (error) {
      console.error("Error saving space:", error);
      alert("An error occurred while saving the space");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/my-spaces");
  };

  if (loadingSpace) {
    return (
      <>
        <Header />
        <div className="create-space-page">
          <div className="container py-5 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading space data...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <FormWrapper
        title={isEditMode ? "Edit Space" : "Create New Space"}
        subtitle={isEditMode ? "Update your space details" : "Create a collaborative space for your team"}
      >
        <form onSubmit={handleSubmit}>
          <FormSection title="Basic Information" icon="📝">
            <TextField
              label="Space Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter space name (e.g., MFTBC Japanese)"
              required
              error={errors.name}
            />

            <SelectField
              label="Language"
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              options={languageOptions}
              required
            />
          </FormSection>

          <FormSection title="Visual Content" icon="🖼️">
            <ImageUpload
              label="Space Image"
              onUpload={handleImageUpload}
              onRemove={handleImageRemove}
              existingImages={formData.imageUrl ? [{ url: formData.imageUrl, name: "Space Image" }] : []}
              accept="image/*"
              maxFiles={1}
            />

            <RichTextEditor
              label="Description"
              value={formData.description}
              onChange={handleDescriptionChange}
              placeholder="Provide a detailed description of this space..."
              required
              error={errors.description}
            />
          </FormSection>

          <FormSection title="Visibility & Publishing" icon="👁️">
            <div className="form-group">
              <label className="form-label">Visibility</label>
              <div className="visibility-options">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={formData.visibility === "public"}
                    onChange={handleInputChange}
                  />
                  <span className="radio-label">
                    <strong>Public</strong>
                    <small>Everyone can view this space</small>
                  </span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="visibility"
                    value="restricted"
                    checked={formData.visibility === "restricted"}
                    onChange={handleInputChange}
                  />
                  <span className="radio-label">
                    <strong>Restricted</strong>
                    <small>Only selected members can view</small>
                  </span>
                </label>
              </div>
            </div>

            <DateTimeField
              label="Schedule for Later"
              name="scheduledAt"
              value={formData.scheduledAt}
              onChange={handleInputChange}
              helpText="Leave empty to publish immediately"
            />

            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="isPublished"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleInputChange}
              />
              <label className="form-check-label" htmlFor="isPublished">
                Publish immediately
              </label>
            </div>
          </FormSection>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : (
                isEditMode ? "Update Space" : "Create Space"
              )}
            </button>
          </div>
        </form>
      </FormWrapper>
    </>
  );
};

export default CreateSpace;
