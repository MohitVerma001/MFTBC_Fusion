import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import { spacesApi } from "../../services";
import "./CreateSpace.css";

const NAVIGATION_ITEMS = [
  { id: "News", label: "News", icon: "📰" },
  { id: "HR", label: "HR", icon: "👥" },
  { id: "Activity", label: "Activity", icon: "⚡" },
  { id: "Content", label: "Content", icon: "📚" },
  { id: "IT", label: "IT", icon: "💻" },
  { id: "People", label: "People", icon: "👤" },
  { id: "Spaces", label: "Spaces", icon: "🌐" },
  { id: "Calendar", label: "Calendar", icon: "📅" },
  { id: "CEO Message", label: "CEO Message", icon: "💼" }
];

const CreateSpace = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [rootSpaces, setRootSpaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSpace, setLoadingSpace] = useState(false);

  const [formData, setFormData] = useState({
    parentSpaceId: "",
    name: "",
    description: "",
    navigationItems: [],
    language: "en",
    visibility: "public",
    isPublished: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadRootSpaces();
    if (isEditMode) {
      loadSpace();
    }
  }, [id]);

  const loadRootSpaces = async () => {
    try {
      const result = await spacesApi.getSubspaces('?is_root_space=true');
      if (result.success) {
        setRootSpaces(result.data || []);
        if (result.data && result.data.length > 0 && !formData.parentSpaceId) {
          const mftbc = result.data.find(s => s.name === 'MFTBC');
          if (mftbc) {
            setFormData(prev => ({ ...prev, parentSpaceId: mftbc.id }));
          }
        }
      }
    } catch (error) {
      console.error("Error loading root spaces:", error);
    }
  };

  const loadSpace = async () => {
    try {
      setLoadingSpace(true);
      const result = await spacesApi.getById(id);
      if (result.success && result.data) {
        const space = result.data;
        setFormData({
          parentSpaceId: space.parent_space_id || "",
          name: space.name || "",
          description: space.description || "",
          navigationItems: space.navigation_items || [],
          language: space.language || "en",
          visibility: space.visibility || "public",
          isPublished: space.is_published !== false
        });
      }
    } catch (error) {
      console.error("Error loading space:", error);
    } finally {
      setLoadingSpace(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const toggleNavigationItem = (itemId) => {
    setFormData(prev => {
      const items = prev.navigationItems.includes(itemId)
        ? prev.navigationItems.filter(id => id !== itemId)
        : [...prev.navigationItems, itemId];
      return { ...prev, navigationItems: items };
    });
    setErrors(prev => ({ ...prev, navigationItems: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.parentSpaceId) {
      newErrors.parentSpaceId = "Parent Space is required";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Space Name is required";
    }

    if (formData.navigationItems.length === 0) {
      newErrors.navigationItems = "Please select at least one navigation item";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const payload = {
        name: formData.name,
        description: formData.description,
        parent_space_id: formData.parentSpaceId,
        navigation_items: formData.navigationItems,
        language: formData.language,
        visibility: formData.visibility,
        is_published: formData.isPublished,
        content_html: `<p>${formData.description || 'Welcome to ' + formData.name}</p>`,
        created_by: "00000000-0000-0000-0000-000000000001"
      };

      let result;
      if (isEditMode) {
        result = await spacesApi.update(id, payload);
      } else {
        result = await spacesApi.create(payload);
      }

      if (result.success) {
        navigate("/spaces");
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
    navigate("/spaces");
  };

  if (loadingSpace) {
    return (
      <>
        <Header />
        <div className="create-space-container">
          <div className="loading-state">
            <div className="spinner-border text-danger" role="status"></div>
            <p>Loading space data...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="create-space-container">
        <div className="create-space-card">
          <div className="card-header-custom">
            <h1 className="page-title">{isEditMode ? 'Edit Space' : 'Create New Space'}</h1>
            <p className="page-subtitle">Configure your collaborative workspace</p>
          </div>

          <form onSubmit={handleSubmit} className="space-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="parentSpaceId">
                  Parent Space <span className="required">*</span>
                </label>
                <select
                  id="parentSpaceId"
                  name="parentSpaceId"
                  className={`form-control ${errors.parentSpaceId ? 'is-invalid' : ''}`}
                  value={formData.parentSpaceId}
                  onChange={handleChange}
                >
                  <option value="">Select Parent Space</option>
                  {rootSpaces.map(space => (
                    <option key={space.id} value={space.id}>
                      {space.name}
                    </option>
                  ))}
                </select>
                {errors.parentSpaceId && (
                  <div className="error-feedback">{errors.parentSpaceId}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  Space Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  placeholder="e.g., Marketing Team, Engineering Hub"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <div className="error-feedback">{errors.name}</div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                placeholder="Brief description of this space..."
                rows="3"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Navigation Items <span className="required">*</span>
              </label>
              {errors.navigationItems && (
                <div className="error-feedback mb-2">{errors.navigationItems}</div>
              )}
              <div className="navigation-grid">
                {NAVIGATION_ITEMS.map(item => (
                  <div
                    key={item.id}
                    className={`nav-checkbox-card ${formData.navigationItems.includes(item.id) ? 'selected' : ''}`}
                    onClick={() => toggleNavigationItem(item.id)}
                  >
                    <input
                      type="checkbox"
                      id={`nav-${item.id}`}
                      checked={formData.navigationItems.includes(item.id)}
                      onChange={() => {}}
                      className="nav-checkbox-input"
                    />
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                    {formData.navigationItems.includes(item.id) && (
                      <span className="check-icon">✓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="language">
                  Language / 言語
                </label>
                <select
                  id="language"
                  name="language"
                  className="form-control bilingual-select"
                  value={formData.language}
                  onChange={handleChange}
                >
                  <option value="en">English / 英語</option>
                  <option value="ja">Japanese / 日本語</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="visibility">
                  Visibility
                </label>
                <select
                  id="visibility"
                  name="visibility"
                  className="form-control"
                  value={formData.visibility}
                  onChange={handleChange}
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="restricted">Restricted</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-checkbox-label">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <span>Publish this space immediately</span>
              </label>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-cancel"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    {isEditMode ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>{isEditMode ? 'Update Space' : 'Create Space'}</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateSpace;
