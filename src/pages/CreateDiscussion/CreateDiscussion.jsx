import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import FormWrapper from "../../components/FormComponents/FormWrapper";
import FormSection from "../../components/FormComponents/FormSection";
import TextField from "../../components/FormComponents/TextField";
import RichTextEditor from "../../components/FormComponents/RichTextEditor";
import SelectField from "../../components/FormComponents/SelectField";
import TagInput from "../../components/FormComponents/TagInput";

const CreateDiscussion = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    publishTo: "",
    subject: "",
    contentText: "",
    tags: [],
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

  const handleContentChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      contentText: value,
    }));
    if (errors.contentText) {
      setErrors((prev) => ({ ...prev, contentText: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.publishTo) newErrors.publishTo = "Please select where to publish";
    if (!formData.subject.trim()) newErrors.subject = "Topic is required";
    if (!formData.contentText.trim()) newErrors.contentText = "Content is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createDiscussion = async (data) => {
    const discussion = {
      publishTo: data.publishTo,
      subject: data.subject,
      content: { text: data.contentText },
      tags: data.tags,
      published: new Date().toISOString(),
      author: { id: "current-user-id", name: "John Doe", avatar: "JD" },
      parentPlace: data.publishTo,
    };

    console.log("Creating discussion:", discussion);
    return discussion;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await createDiscussion(formData);
      alert("Discussion Published Successfully!");
      navigate(formData.publishTo === "news" ? "/news" : "/");
    } catch (error) {
      console.error("Error creating discussion:", error);
      alert("Failed to publish discussion. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <FormWrapper
        title="Create Discussion"
        subtitle="Start a conversation and engage with your team"
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
        submitLabel="Publish Discussion"
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

        <FormSection title="Discussion Topic" icon="💬">
          <TextField
            label="Topic"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            placeholder="What would you like to discuss?"
            required
            error={errors.subject}
            icon="💡"
          />
          <RichTextEditor
            label="Content"
            value={formData.contentText}
            onChange={handleContentChange}
            placeholder="Share your thoughts and start the discussion..."
            required
            error={errors.contentText}
          />
        </FormSection>

        <FormSection title="Metadata" icon="🏷️">
          <TagInput
            label="Tags"
            tags={formData.tags}
            onTagsChange={(tags) =>
              setFormData((prev) => ({ ...prev, tags }))
            }
          />
        </FormSection>
      </FormWrapper>
    </>
  );
};

export default CreateDiscussion;
