import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import FormWrapper from "../../components/FormComponents/FormWrapper";
import FormSection from "../../components/FormComponents/FormSection";
import TextField from "../../components/FormComponents/TextField";
import RichTextEditor from "../../components/FormComponents/RichTextEditor";
import SelectField from "../../components/FormComponents/SelectField";
import ImageUpload from "../../components/FormComponents/ImageUpload";
import FileUpload from "../../components/FormComponents/FileUpload";
import CategoryDropdown from "../../components/CategoryDropdown/CategoryDropdown";
import "./CreateBlog.css";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CreateBlog = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    publishTo: "",
    categoryId: "",
    title: "",
    content: "",
    tags: [],
    contentImages: [],
    attachments: [],
    restrictedComments: false,
    isPlaceBlog: false,
    placeId: ""
  });

  const [errors, setErrors] = useState({});
  const [tags, setTags] = useState([]);
  const [places, setPlaces] = useState([]);
  const [tagSearch, setTagSearch] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);

  const publishToOptions = [
    { value: "News", label: "News" },
    { value: "HR", label: "HR" },
    { value: "IT", label: "IT" },
  ];

  useEffect(() => {
    fetchTags();
    fetchPlaces();
  }, []);

  useEffect(() => {
    if (tagSearch) {
      fetchTags(tagSearch);
    }
  }, [tagSearch]);

  const fetchTags = async (search = "") => {
    try {
      const url = search ? `${API_URL}/tags?search=${search}` : `${API_URL}/tags`;
      const response = await fetch(url);
      const result = await response.json();
      if (result.success) {
        setTags(result.data);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const fetchPlaces = async () => {
    try {
      const response = await fetch(`${API_URL}/places`);
      const result = await response.json();
      if (result.success) {
        setPlaces(result.data);
      }
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleContentChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      content: value,
    }));
    if (errors.content) {
      setErrors((prev) => ({ ...prev, content: "" }));
    }
  };

  const handleAddTag = async () => {
    if (!tagInput.trim()) return;

    const existingTag = tags.find(t => t.name.toLowerCase() === tagInput.toLowerCase());

    if (existingTag) {
      if (!formData.tags.some(t => t.id === existingTag.id)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, existingTag]
        }));
      }
      setTagInput("");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: tagInput })
      });
      const result = await response.json();

      if (result.success) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, result.data]
        }));
        setTags(prev => [...prev, result.data]);
      }
      setTagInput("");
    } catch (error) {
      console.error('Error creating tag:', error);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag.id !== tagToRemove.id),
    }));
  };

  const handleTagSelect = (tag) => {
    if (!formData.tags.some(t => t.id === tag.id)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.publishTo) {
      newErrors.publishTo = "Please select where to publish";
    }
    if (formData.publishTo === "HR" && !formData.categoryId) {
      newErrors.categoryId = "Please select a category for HR";
    }
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.content.trim() || formData.content === '<p><br></p>') {
      newErrors.content = "Content is required";
    }
    if (formData.isPlaceBlog && !formData.placeId) {
      newErrors.placeId = "Please select a place";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('publishTo', formData.publishTo);
      formDataToSend.append('restrictedComments', formData.restrictedComments);
      formDataToSend.append('isPlaceBlog', formData.isPlaceBlog);
      formDataToSend.append('authorId', 'current-user-id');

      if (formData.categoryId) {
        formDataToSend.append('categoryId', formData.categoryId);
      }

      if (formData.placeId) {
        formDataToSend.append('placeId', formData.placeId);
      }

      if (formData.tags.length > 0) {
        formDataToSend.append('tagIds', JSON.stringify(formData.tags.map(t => t.id)));
      }

      formData.contentImages.forEach((image) => {
        if (image.file) {
          formDataToSend.append('images', image.file);
        }
      });

      formData.attachments.forEach((attachment) => {
        if (attachment.file) {
          formDataToSend.append('attachments', attachment.file);
        }
      });

      const response = await fetch(`${API_URL}/blogs`, {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.success) {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-animation';
        successMessage.innerHTML = `
          <div class="success-checkmark">
            <div class="check-icon">
              <span class="icon-line line-tip"></span>
              <span class="icon-line line-long"></span>
              <div class="icon-circle"></div>
              <div class="icon-fix"></div>
            </div>
          </div>
          <h2>Blog Published Successfully!</h2>
        `;
        document.body.appendChild(successMessage);

        setTimeout(() => {
          successMessage.remove();
          if (formData.publishTo === "News") {
            navigate("/news");
          } else {
            navigate("/");
          }
        }, 2000);
      } else {
        alert(`Failed to publish blog: ${result.message}`);
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      alert("Failed to publish blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <FormWrapper
        title="Create Blog Post"
        subtitle="Share your insights and updates with the organization"
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
        submitLabel={loading ? "Publishing..." : "Publish Blog"}
      >
        <FormSection title="Publish Type" icon="📍" className="animate-slide-in">
          <SelectField
            label="Publish To"
            name="publishTo"
            value={formData.publishTo}
            onChange={handleInputChange}
            options={publishToOptions}
            required
            error={errors.publishTo}
            placeholder="Select a section..."
          />

          <CategoryDropdown
            value={formData.categoryId}
            onChange={(name, value) => setFormData(prev => ({ ...prev, categoryId: value }))}
            publishTo={formData.publishTo}
            error={errors.categoryId}
            required={formData.publishTo === "HR"}
          />
        </FormSection>

        <FormSection title="Basic Information" icon="📝" className="animate-slide-in delay-1">
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter blog post title"
            required
            error={errors.title}
            icon="✍️"
          />
          <RichTextEditor
            label="Content"
            value={formData.content}
            onChange={handleContentChange}
            placeholder="Write your blog content here..."
            required
            error={errors.content}
          />
        </FormSection>

        <FormSection title="Images" icon="🖼️" className="animate-slide-in delay-2">
          <ImageUpload
            label="Content Images"
            images={formData.contentImages}
            onImagesChange={(images) =>
              setFormData((prev) => ({ ...prev, contentImages: images }))
            }
          />
        </FormSection>

        <FormSection title="Attachments" icon="📎" className="animate-slide-in delay-3">
          <FileUpload
            label="File Attachments"
            files={formData.attachments}
            onFilesChange={(files) =>
              setFormData((prev) => ({ ...prev, attachments: files }))
            }
          />
        </FormSection>

        <FormSection title="Tags" icon="🏷️" className="animate-slide-in delay-4">
          <div className="mb-3">
            <label className="form-label">Search and Add Tags</label>
            <div className="tag-input-container">
              <input
                type="text"
                className="form-control"
                placeholder="Type to search or create new tag..."
                value={tagInput}
                onChange={(e) => {
                  setTagInput(e.target.value);
                  setTagSearch(e.target.value);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={handleAddTag}
              >
                Add Tag
              </button>
            </div>

            {tagSearch && tags.length > 0 && (
              <div className="tag-suggestions">
                {tags.filter(t => !formData.tags.some(ft => ft.id === t.id)).map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    className="tag-suggestion-item"
                    onClick={() => {
                      handleTagSelect(tag);
                      setTagInput("");
                      setTagSearch("");
                    }}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            )}

            {formData.tags.length > 0 && (
              <div className="tags-container mt-3">
                {formData.tags.map((tag) => (
                  <span key={tag.id} className="badge tag-badge">
                    {tag.name}
                    <button
                      type="button"
                      className="tag-remove"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </FormSection>

        <FormSection title="Advanced Options" icon="⚙️" className="animate-slide-in delay-5">
          <div className="mb-3">
            <label className="form-label">Comments</label>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="restrictedComments"
                name="restrictedComments"
                checked={formData.restrictedComments}
                onChange={handleInputChange}
              />
              <label className="form-check-label" htmlFor="restrictedComments">
                Restricted Comments
              </label>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Place Blog</label>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="isPlaceBlog"
                name="isPlaceBlog"
                checked={formData.isPlaceBlog}
                onChange={handleInputChange}
              />
              <label className="form-check-label" htmlFor="isPlaceBlog">
                A Place's Blog: Use a place's blog to reach specific audience
              </label>
            </div>
          </div>

          {formData.isPlaceBlog && (
            <div className="place-field fade-in">
              <SelectField
                label="Select Place"
                name="placeId"
                value={formData.placeId}
                onChange={handleInputChange}
                options={places.map(place => ({ value: place.id, label: place.name }))}
                required
                error={errors.placeId}
                placeholder="Select a place..."
              />
            </div>
          )}
        </FormSection>
      </FormWrapper>
    </>
  );
};

export default CreateBlog;
