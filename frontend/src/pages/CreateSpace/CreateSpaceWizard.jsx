import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import { spacesApi } from "../../services";
import "./CreateSpaceWizard.css";

const NAVIGATION_ITEMS = [
  { id: "News", label: "News", icon: "📰", color: "#2563EB", description: "Company news and announcements" },
  { id: "HR", label: "HR", icon: "👥", color: "#DC2626", description: "Human resources and policies" },
  { id: "Activity", label: "Activity", icon: "⚡", color: "#F59E0B", description: "Team activities and events" },
  { id: "Content", label: "Content", icon: "📚", color: "#10B981", description: "Knowledge base and documents" },
  { id: "IT", label: "IT", icon: "💻", color: "#8B5CF6", description: "IT support and resources" },
  { id: "People", label: "People", icon: "👤", color: "#EC4899", description: "Team directory" },
  { id: "Spaces", label: "Spaces", icon: "🌐", description: "Sub-spaces and groups" },
  { id: "Calendar", label: "Calendar", icon: "📅", color: "#06B6D4", description: "Events and schedules" },
  { id: "CEO Message", label: "CEO Message", icon: "💼", color: "#7C3AED", description: "Leadership communications" }
];

const CreateSpaceWizard = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [currentStep, setCurrentStep] = useState(1);
  const [rootSpaces, setRootSpaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSpace, setLoadingSpace] = useState(false);

  const [formData, setFormData] = useState({
    parentSpaceId: "",
    name: "",
    navigationItems: [],
    language: "English",
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
          navigationItems: space.navigation_items || [],
          language: space.language || "English",
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

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.parentSpaceId) {
        newErrors.parentSpaceId = "Please select a parent space";
      }
    }

    if (step === 2) {
      if (!formData.name.trim()) {
        newErrors.name = "Space name is required";
      }
    }

    if (step === 3) {
      if (formData.navigationItems.length === 0) {
        newErrors.navigationItems = "Please select at least one navigation item";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleParentSpaceSelect = (spaceId) => {
    setFormData(prev => ({ ...prev, parentSpaceId: spaceId }));
    setErrors(prev => ({ ...prev, parentSpaceId: "" }));
  };

  const handleNameChange = (e) => {
    setFormData(prev => ({ ...prev, name: e.target.value }));
    setErrors(prev => ({ ...prev, name: "" }));
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

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    try {
      setLoading(true);

      const payload = {
        name: formData.name,
        parent_space_id: formData.parentSpaceId,
        navigation_items: formData.navigationItems,
        language: formData.language,
        visibility: formData.visibility,
        is_published: formData.isPublished,
        description: `${formData.name} - Collaborative Space`,
        content_html: `<p>Welcome to ${formData.name}</p>`,
        created_by: "00000000-0000-0000-0000-000000000001"
      };

      let result;
      if (isEditMode) {
        result = await spacesApi.update(id, payload);
      } else {
        result = await spacesApi.create(payload);
      }

      if (result.success) {
        setCurrentStep(5);
        setTimeout(() => {
          navigate("/spaces");
        }, 2000);
      } else {
        alert(result.message || "Failed to create space");
      }
    } catch (error) {
      console.error("Error creating space:", error);
      alert("An error occurred while creating the space");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/my-spaces");
  };

  const renderProgressBar = () => (
    <div className="progress-bar-container">
      <div className="progress-steps">
        {[1, 2, 3, 4].map(step => (
          <div key={step} className="progress-step-wrapper">
            <div className={`progress-step ${currentStep >= step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}>
              {currentStep > step ? '✓' : step}
            </div>
            {step < 4 && <div className={`progress-line ${currentStep > step ? 'completed' : ''}`} />}
          </div>
        ))}
      </div>
      <div className="progress-labels">
        <span className={currentStep >= 1 ? 'active' : ''}>Parent Space</span>
        <span className={currentStep >= 2 ? 'active' : ''}>Space Name</span>
        <span className={currentStep >= 3 ? 'active' : ''}>Navigation</span>
        <span className={currentStep >= 4 ? 'active' : ''}>Review</span>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="wizard-step step-1" key="step1">
      <div className="step-header">
        <h2 className="step-title">Select Parent Space</h2>
        <p className="step-description">Choose where your new space will be created</p>
      </div>

      {errors.parentSpaceId && <div className="error-message">{errors.parentSpaceId}</div>}

      <div className="parent-spaces-grid">
        {rootSpaces.map(space => (
          <div
            key={space.id}
            className={`parent-space-card ${formData.parentSpaceId === space.id ? 'selected' : ''}`}
            onClick={() => handleParentSpaceSelect(space.id)}
          >
            <div className="space-card-icon">🌐</div>
            <h3 className="space-card-name">{space.name}</h3>
            <p className="space-card-description">{space.description || 'Root space'}</p>
            {formData.parentSpaceId === space.id && (
              <div className="selected-badge">✓ Selected</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="wizard-step step-2" key="step2">
      <div className="step-header">
        <h2 className="step-title">Enter Space Name</h2>
        <p className="step-description">Give your space a unique and descriptive name</p>
      </div>

      {errors.name && <div className="error-message">{errors.name}</div>}

      <div className="name-input-container">
        <input
          type="text"
          className="space-name-input"
          placeholder="e.g., Marketing Team, Engineering Hub, Sales Department"
          value={formData.name}
          onChange={handleNameChange}
          autoFocus
        />
        {formData.name && (
          <div className="name-preview">
            <span className="preview-label">Preview:</span>
            <span className="preview-text">🌐 {formData.name}</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="wizard-step step-3" key="step3">
      <div className="step-header">
        <h2 className="step-title">Select Navigation Items</h2>
        <p className="step-description">Choose which sections will be available in your space</p>
      </div>

      {errors.navigationItems && <div className="error-message">{errors.navigationItems}</div>}

      <div className="navigation-items-grid">
        {NAVIGATION_ITEMS.map(item => (
          <div
            key={item.id}
            className={`nav-item-card ${formData.navigationItems.includes(item.id) ? 'selected' : ''}`}
            onClick={() => toggleNavigationItem(item.id)}
          >
            <div className="nav-item-icon" style={{ background: `${item.color}20`, color: item.color }}>
              {item.icon}
            </div>
            <h3 className="nav-item-label">{item.label}</h3>
            <p className="nav-item-description">{item.description}</p>
            {formData.navigationItems.includes(item.id) && (
              <div className="selected-checkmark">✓</div>
            )}
          </div>
        ))}
      </div>

      {formData.navigationItems.length > 0 && (
        <div className="selected-count">
          {formData.navigationItems.length} item{formData.navigationItems.length !== 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  );

  const renderStep4 = () => {
    const parentSpace = rootSpaces.find(s => s.id === formData.parentSpaceId);
    const selectedNavItems = NAVIGATION_ITEMS.filter(item => formData.navigationItems.includes(item.id));

    return (
      <div className="wizard-step step-4" key="step4">
        <div className="step-header">
          <h2 className="step-title">Review & Create</h2>
          <p className="step-description">Verify your space details before creating</p>
        </div>

        <div className="review-container">
          <div className="review-section">
            <h3 className="review-section-title">Parent Space</h3>
            <div className="review-content">
              <span className="review-icon">🌐</span>
              <span className="review-text">{parentSpace?.name}</span>
            </div>
          </div>

          <div className="review-section">
            <h3 className="review-section-title">Space Name</h3>
            <div className="review-content">
              <span className="review-icon">📝</span>
              <span className="review-text">{formData.name}</span>
            </div>
          </div>

          <div className="review-section">
            <h3 className="review-section-title">Navigation Items ({selectedNavItems.length})</h3>
            <div className="review-nav-items">
              {selectedNavItems.map(item => (
                <div key={item.id} className="review-nav-item">
                  <span className="review-nav-icon">{item.icon}</span>
                  <span className="review-nav-label">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStep5 = () => (
    <div className="wizard-step step-5 success-step" key="step5">
      <div className="success-animation">
        <div className="success-checkmark">✓</div>
      </div>
      <h2 className="success-title">Space Created Successfully!</h2>
      <p className="success-message">Redirecting you to Spaces...</p>
    </div>
  );

  if (loadingSpace) {
    return (
      <>
        <Header />
        <div className="wizard-container loading-state">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading space data...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="wizard-container">
        <div className="wizard-content">
          <div className="wizard-header">
            <h1 className="wizard-main-title">{isEditMode ? 'Edit Space' : 'Create New Space'}</h1>
            <button className="wizard-close" onClick={handleCancel}>✕</button>
          </div>

          {currentStep < 5 && renderProgressBar()}

          <div className="wizard-body">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
            {currentStep === 5 && renderStep5()}
          </div>

          {currentStep < 5 && (
            <div className="wizard-footer">
              <button
                className="wizard-btn wizard-btn-secondary"
                onClick={currentStep === 1 ? handleCancel : handleBack}
              >
                {currentStep === 1 ? 'Cancel' : 'Back'}
              </button>
              {currentStep < 4 ? (
                <button
                  className="wizard-btn wizard-btn-primary"
                  onClick={handleNext}
                >
                  Next
                </button>
              ) : (
                <button
                  className="wizard-btn wizard-btn-primary wizard-btn-submit"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Creating...
                    </>
                  ) : (
                    <>
                      <span className="wizard-btn-icon">🚀</span>
                      Create Space
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CreateSpaceWizard;
