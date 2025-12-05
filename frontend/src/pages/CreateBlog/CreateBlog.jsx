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
import { tagsApi, placesApi, spacesApi, blogsApi } from "../../services";
import "./CreateBlog.css";

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
    placeId: "",
    spaceId: "" // ⭐ NEW: selected space (MFTBC / DTA / etc.)
  });

  const [errors, setErrors] = useState({});
  const [tags, setTags] = useState([]);
  const [places, setPlaces] = useState([]);
  const [spaces, setSpaces] = useState([]); // ⭐ NEW: list of subspaces / spaces
  const [tagSearch, setTagSearch] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);

  const publishToOptions = [
    { value: "News", label: "News" },
    { value: "HR", label: "HR" },
    { value: "IT", label: "IT" }
  ];

  useEffect(() => {
    fetchTags();
    fetchPlaces();
    fetchSpaces();
  }, []);

  useEffect(() => {
    if (tagSearch) fetchTags(tagSearch);
  }, [tagSearch]);

  const fetchTags = async (search = "") => {
    try {
      const result = search
        ? await tagsApi.search(search)
        : await tagsApi.getAll();
      if (result.success) setTags(result.data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const fetchPlaces = async () => {
    try {
      const result = await placesApi.getAll();
      if (result.success) setPlaces(result.data);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  const fetchSpaces = async () => {
    try {
      const result = await spacesApi.getSubspaces('?is_published=true');

      if (result.success) {
        const list = result.data || [];
        setSpaces(list);

        // Auto-set default MFTBC if nothing selected
        const mftbc = list.find(
          (s) => s.name && s.name.toLowerCase() === "mftbc"
        );
        if (mftbc && !formData.spaceId) {
          setFormData((prev) => ({
            ...prev,
            spaceId: String(mftbc.id)
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching spaces:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleContentChange = (value) => {
    setFormData((prev) => ({ ...prev, content: value }));
    if (errors.content) {
      setErrors((prev) => ({ ...prev, content: "" }));
    }
  };

  const handleAddTag = async () => {
    if (!tagInput.trim()) return;

    const existingTag = tags.find(
      (t) => t.name.toLowerCase() === tagInput.toLowerCase()
    );

    if (existingTag) {
      if (!formData.tags.some((t) => t.id === existingTag.id)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, existingTag]
        }));
      }
      setTagInput("");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: tagInput })
      });

      const result = await response.json();
      if (result.success) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, result.data]
        }));
        setTags((prev) => [...prev, result.data]);
      }
      setTagInput("");
    } catch (error) {
      console.error("Error creating tag:", error);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag.id !== tagToRemove.id)
    }));
  };

  const handleTagSelect = (tag) => {
    if (!formData.tags.some((t) => t.id === tag.id)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.publishTo)
      newErrors.publishTo = "Please select where to publish";

    if (formData.publishTo === "HR" && !formData.categoryId)
      newErrors.categoryId = "Select a category";

    if (!formData.title.trim()) newErrors.title = "Title is required";

    if (!formData.content.trim() || formData.content === "<p><br></p>")
      newErrors.content = "Content is required";

    if (!formData.spaceId)
      newErrors.spaceId = "Please select a space (e.g. MFTBC, DTA)";

    if (formData.isPlaceBlog && !formData.placeId)
      newErrors.placeId = "Select a place";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const imageUrls = [];
      for (const image of formData.contentImages) {
        if (image.file) {
          const fd = new FormData();
          fd.append("file", image.file);
          const res = await fetch(`${API_URL}/upload/single`, {
            method: "POST",
            body: fd
          });
          const out = await res.json();
          if (out.success) imageUrls.push(out.data.url);
        } else if (image.url) {
          imageUrls.push(image.url);
        }
      }

      const attachmentData = [];
      for (const file of formData.attachments) {
        if (file.file) {
          const fd = new FormData();
          fd.append("file", file.file);
          const res = await fetch(`${API_URL}/upload/single`, {
            method: "POST",
            body: fd
          });
          const out = await res.json();
          if (out.success) {
            attachmentData.push({
              url: out.data.url,
              name: out.data.filename,
              size: out.data.size,
              contentType: out.data.mimeType
            });
          }
        } else if (file.url) {
          attachmentData.push({
            url: file.url,
            name: file.name,
            size: file.size || 0,
            contentType: file.type || "application/octet-stream"
          });
        }
      }

      const wrappedContent = formData.content.startsWith("<body>")
        ? formData.content
        : `<body>${formData.content}</body>`;

      const payload = {
        subject: formData.title,
        content: formData.content,
        content_html: wrappedContent,
        publish_to: formData.publishTo,
        restrictReplies: formData.restrictedComments,
        isPlaceBlog: formData.isPlaceBlog,
        authorId: 1,
        spaceId: formData.spaceId ? Number(formData.spaceId) : undefined,
        tags: formData.tags.map((t) => t.name),
        contentImages: imageUrls,
        attachments: attachmentData
      };

      if (formData.categoryId) payload.categoryId = formData.categoryId;
      if (formData.placeId) payload.placeId = formData.placeId;

      const response = await fetch(`${API_URL}/blogs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result?.id) {
        alert("Blog posted successfully!");
        navigate(formData.publishTo === "News" ? "/news" : "/");
      } else {
        alert("Failed: " + (result?.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error creating blog:", err);
      alert("Failed to publish blog");
    }

    setLoading(false);
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
        <FormSection title="Publish Type" icon="📍">
          <SelectField
            label="Publish To"
            name="publishTo"
            value={formData.publishTo}
            onChange={handleInputChange}
            options={publishToOptions}
            required
            error={errors.publishTo}
            placeholder="Select where to publish"
          />

          {/* Space selection – MFTBC / DTA / etc. */}
          <SelectField
            label="Space"
            name="spaceId"
            value={formData.spaceId}
            onChange={handleInputChange}
            options={spaces.map((s) => ({
              value: s.id,
              label: s.name
            }))}
            required
            error={errors.spaceId}
            placeholder="Select a space (e.g. MFTBC, DTA)"
          />

          <CategoryDropdown
            value={formData.categoryId}
            onChange={(name, value) =>
              setFormData((prev) => ({ ...prev, categoryId: value }))
            }
            publishTo={formData.publishTo}
            error={errors.categoryId}
            required={formData.publishTo === "HR"}
          />
        </FormSection>

        <FormSection title="Basic Information" icon="📝">
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter title"
            required
            error={errors.title}
          />

          <RichTextEditor
            label="Content"
            value={formData.content}
            onChange={handleContentChange}
            required
            error={errors.content}
          />
        </FormSection>

        <FormSection title="Images" icon="🖼️">
          <ImageUpload
            label="Content Images"
            images={formData.contentImages}
            onImagesChange={(images) =>
              setFormData((prev) => ({ ...prev, contentImages: images }))
            }
          />
        </FormSection>

        <FormSection title="Attachments" icon="📎">
          <FileUpload
            label="File Attachments"
            files={formData.attachments}
            onFilesChange={(files) =>
              setFormData((prev) => ({ ...prev, attachments: files }))
            }
          />
        </FormSection>

        <FormSection title="Tags" icon="🏷️">
          <div className="mb-3">
            <label className="form-label">Search and Add Tags</label>

            <div className="tag-input-container">
              <input
                type="text"
                className="form-control"
                placeholder="Type to search or create"
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
                {tags
                  .filter((t) => !formData.tags.some((ft) => ft.id === t.id))
                  .map((tag) => (
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

        <FormSection title="Advanced Options" icon="⚙️">
          <div className="form-check mb-3">
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

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="isPlaceBlog"
              name="isPlaceBlog"
              checked={formData.isPlaceBlog}
              onChange={handleInputChange}
            />
            <label className="form-check-label" htmlFor="isPlaceBlog">
              Place Blog
            </label>
          </div>

          {formData.isPlaceBlog && (
            <div className="fade-in">
              <SelectField
                label="Select Place"
                name="placeId"
                value={formData.placeId}
                onChange={handleInputChange}
                options={places.map((p) => ({
                  value: p.id,
                  label: p.name
                }))}
                required
                error={errors.placeId}
              />
            </div>
          )}
        </FormSection>
      </FormWrapper>
    </>
  );
};

export default CreateBlog;
