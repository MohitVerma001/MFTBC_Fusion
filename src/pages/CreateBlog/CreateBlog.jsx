import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import "./CreateBlog.css";

const CreateBlog = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    publishTo: "",
    subject: "",
    contentText: "",
    tags: [],
    contentImages: [],
    attachments: [],
  });

  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState({});

  const publishToOptions = [
    { value: "", label: "Select a section..." },
    { value: "news", label: "News" },
    { value: "hr", label: "HR" },
    { value: "it", label: "IT" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imagePromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            id: Date.now() + Math.random(),
            name: file.name,
            url: reader.result,
            file: file,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then((images) => {
      setFormData((prev) => ({
        ...prev,
        contentImages: [...prev.contentImages, ...images],
      }));
    });
  };

  const handleRemoveImage = (imageId) => {
    setFormData((prev) => ({
      ...prev,
      contentImages: prev.contentImages.filter((img) => img.id !== imageId),
    }));
  };

  const handleAttachmentUpload = (e) => {
    const files = Array.from(e.target.files);
    const attachments = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: (file.size / 1024).toFixed(2) + " KB",
      file: file,
    }));

    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...attachments],
    }));
  };

  const handleRemoveAttachment = (attachmentId) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((att) => att.id !== attachmentId),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.publishTo) {
      newErrors.publishTo = "Please select where to publish";
    }
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    if (!formData.contentText.trim()) {
      newErrors.contentText = "Content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createBlogPost = async (data) => {
    const blogPost = {
      publishTo: data.publishTo,
      subject: data.subject,
      content: {
        text: data.contentText,
      },
      tags: data.tags,
      contentImages: data.contentImages.map((img) => ({
        url: img.url,
        name: img.name,
      })),
      attachments: data.attachments.map((att) => ({
        name: att.name,
        size: att.size,
      })),
      published: new Date().toISOString(),
      author: {
        id: "current-user-id",
        name: "John Doe",
        avatar: "JD",
      },
      parentPlace: data.publishTo,
    };

    console.log("Creating blog post:", blogPost);
    return blogPost;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await createBlogPost(formData);

      alert("Blog Post Published Successfully!");

      if (formData.publishTo === "news") {
        navigate("/news");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error creating blog post:", error);
      alert("Failed to publish blog post. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="create-blog-page">
      <Header />

      <div className="container py-4">
        <div className="create-blog-container">
          <div className="create-blog-header">
            <h1 className="create-blog-title">Create Blog Post</h1>
            <p className="create-blog-subtitle">
              Share your insights and updates with the organization
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="card form-section">
              <div className="card-body">
                <h3 className="form-section-title">Publish Type</h3>
                <div className="mb-3">
                  <label htmlFor="publishTo" className="form-label required">
                    Publish To:
                  </label>
                  <select
                    id="publishTo"
                    name="publishTo"
                    className={`form-select ${errors.publishTo ? "is-invalid" : ""}`}
                    value={formData.publishTo}
                    onChange={handleInputChange}
                  >
                    {publishToOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.publishTo && (
                    <div className="invalid-feedback">{errors.publishTo}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="card form-section">
              <div className="card-body">
                <h3 className="form-section-title">Basic Information</h3>
                <div className="mb-3">
                  <label htmlFor="subject" className="form-label required">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className={`form-control ${errors.subject ? "is-invalid" : ""}`}
                    placeholder="Enter blog post subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                  />
                  {errors.subject && (
                    <div className="invalid-feedback">{errors.subject}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="contentText" className="form-label required">
                    Content
                  </label>
                  <textarea
                    id="contentText"
                    name="contentText"
                    className={`form-control ${errors.contentText ? "is-invalid" : ""}`}
                    rows="10"
                    placeholder="Write your blog content here..."
                    value={formData.contentText}
                    onChange={handleInputChange}
                  ></textarea>
                  {errors.contentText && (
                    <div className="invalid-feedback">{errors.contentText}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="card form-section">
              <div className="card-body">
                <h3 className="form-section-title">Metadata</h3>
                <div className="mb-3">
                  <label htmlFor="tags" className="form-label">
                    Tags
                  </label>
                  <div className="input-group mb-2">
                    <input
                      type="text"
                      id="tags"
                      className="form-control"
                      placeholder="Add a tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleAddTag}
                    >
                      Add Tag
                    </button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="tags-container">
                      {formData.tags.map((tag, index) => (
                        <span key={index} className="badge tag-badge">
                          {tag}
                          <button
                            type="button"
                            className="tag-remove"
                            onClick={() => handleRemoveTag(tag)}
                            aria-label="Remove tag"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="card form-section">
              <div className="card-body">
                <h3 className="form-section-title">Images</h3>
                <div className="mb-3">
                  <label className="form-label">Content Images</label>
                  <div className="file-upload-area">
                    <input
                      type="file"
                      id="imageUpload"
                      className="d-none"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                    />
                    <label htmlFor="imageUpload" className="btn btn-outline-primary">
                      <svg
                        className="me-2"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M8 3.5V12.5M3.5 8H12.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                      Add Images
                    </label>
                  </div>

                  {formData.contentImages.length > 0 && (
                    <div className="uploaded-files-list mt-3">
                      {formData.contentImages.map((image) => (
                        <div key={image.id} className="uploaded-file-item image-preview">
                          <img
                            src={image.url}
                            alt={image.name}
                            className="preview-thumbnail"
                          />
                          <div className="file-info">
                            <span className="file-name">{image.name}</span>
                          </div>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger remove-btn"
                            onClick={() => handleRemoveImage(image.id)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="card form-section">
              <div className="card-body">
                <h3 className="form-section-title">Attachments</h3>
                <div className="mb-3">
                  <label className="form-label">File Attachments</label>
                  <div className="file-upload-area">
                    <input
                      type="file"
                      id="attachmentUpload"
                      className="d-none"
                      multiple
                      onChange={handleAttachmentUpload}
                    />
                    <label
                      htmlFor="attachmentUpload"
                      className="btn btn-outline-primary"
                    >
                      <svg
                        className="me-2"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M8 3.5V12.5M3.5 8H12.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                      Add Attachments
                    </label>
                  </div>

                  {formData.attachments.length > 0 && (
                    <div className="uploaded-files-list mt-3">
                      {formData.attachments.map((attachment) => (
                        <div key={attachment.id} className="uploaded-file-item">
                          <div className="file-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path
                                d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M14 2V8H20"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <div className="file-info">
                            <span className="file-name">{attachment.name}</span>
                            <span className="file-size">{attachment.size}</span>
                          </div>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger remove-btn"
                            onClick={() => handleRemoveAttachment(attachment.id)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-outline-secondary btn-lg"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-danger btn-lg">
                Publish Blog Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;
