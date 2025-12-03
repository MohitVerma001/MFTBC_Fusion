import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import FormWrapper from "../../components/FormComponents/FormWrapper";
import FormSection from "../../components/FormComponents/FormSection";
import TextField from "../../components/FormComponents/TextField";
import RichTextEditor from "../../components/FormComponents/RichTextEditor";
import SelectField from "../../components/FormComponents/SelectField";
import ImageUpload from "../../components/FormComponents/ImageUpload";

const CreateSubSpace = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    publishTo: "",
    name: "",
    description: "",
    coverImage: [],
  });

  const [errors, setErrors] = useState({});

  const publishToOptions = [
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

  const handleDescriptionChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      description: value,
    }));
    if (errors.description) {
      setErrors((prev) => ({ ...prev, description: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.publishTo) newErrors.publishTo = "Please select where to publish";
    if (!formData.name.trim()) newErrors.name = "SubSpace name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createSubSpace = async (data) => {
    const subSpace = {
      publishTo: data.publishTo,
      name: data.name,
      description: data.description,
      coverImage: data.coverImage.length > 0 ? data.coverImage[0].url : null,
      published: new Date().toISOString(),
      author: { id: "current-user-id", name: "John Doe", avatar: "JD" },
      parentPlace: data.publishTo,
    };

    console.log("Creating subspace:", subSpace);
    return subSpace;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await createSubSpace(formData);
      alert("SubSpace Created Successfully!");
      navigate(formData.publishTo === "news" ? "/news" : "/");
    } catch (error) {
      console.error("Error creating subspace:", error);
      alert("Failed to create subspace. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <FormWrapper
        title="Create SubSpace"
        subtitle="Establish a dedicated area for focused collaboration"
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
        submitLabel="Create SubSpace"
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
            placeholder="Select a section..."
          />
        </FormSection>

        <FormSection title="SubSpace Information" icon="🏢">
          <TextField
            label="SubSpace Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter subspace name"
            required
            error={errors.name}
            icon="🏷️"
          />
          <RichTextEditor
            label="Description"
            value={formData.description}
            onChange={handleDescriptionChange}
            placeholder="Describe the purpose of this subspace..."
            required
            error={errors.description}
          />
        </FormSection>

        <FormSection title="Cover Image" icon="🖼️">
          <ImageUpload
            label="SubSpace Cover Image"
            images={formData.coverImage}
            onImagesChange={(images) =>
              setFormData((prev) => ({ ...prev, coverImage: images.slice(0, 1) }))
            }
          />
          <small className="text-muted">Only one cover image allowed</small>
        </FormSection>
      </FormWrapper>
    </>
  );
};

export default CreateSubSpace;
