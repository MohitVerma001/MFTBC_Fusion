import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import FormWrapper from "../../components/FormComponents/FormWrapper";
import FormSection from "../../components/FormComponents/FormSection";
import TextField from "../../components/FormComponents/TextField";
import TextArea from "../../components/FormComponents/TextArea";
import SelectField from "../../components/FormComponents/SelectField";
import DynamicList from "../../components/FormComponents/DynamicList";
import TagInput from "../../components/FormComponents/TagInput";

const CreatePoll = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    publishTo: "",
    subject: "",
    contentText: "",
    options: [],
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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.publishTo) newErrors.publishTo = "Please select where to publish";
    if (!formData.subject.trim()) newErrors.subject = "Question is required";
    if (formData.options.length < 2) newErrors.options = "At least 2 options are required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createPoll = async (data) => {
    const poll = {
      publishTo: data.publishTo,
      subject: data.subject,
      content: { text: data.contentText },
      options: data.options,
      tags: data.tags,
      published: new Date().toISOString(),
      author: { id: "current-user-id", name: "John Doe", avatar: "JD" },
      parentPlace: data.publishTo,
      type: "poll",
    };

    console.log("Creating poll:", poll);
    return poll;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await createPoll(formData);
      alert("Poll Published Successfully!");
      navigate(formData.publishTo === "news" ? "/news" : "/");
    } catch (error) {
      console.error("Error creating poll:", error);
      alert("Failed to publish poll. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <FormWrapper
        title="Create Poll"
        subtitle="Gather feedback and opinions from your team"
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
        submitLabel="Publish Poll"
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

        <FormSection title="Poll Question" icon="📊">
          <TextField
            label="Question"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            placeholder="What would you like to ask?"
            required
            error={errors.subject}
            icon="❓"
          />
          <TextArea
            label="Additional Context (Optional)"
            name="contentText"
            value={formData.contentText}
            onChange={handleInputChange}
            placeholder="Provide more details about this poll..."
            rows={4}
          />
        </FormSection>

        <FormSection title="Poll Options" icon="✅">
          <DynamicList
            label="Answer Options"
            items={formData.options}
            onItemsChange={(options) =>
              setFormData((prev) => ({ ...prev, options }))
            }
            placeholder="Enter an option"
          />
          {errors.options && (
            <div className="text-danger small mt-2">{errors.options}</div>
          )}
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

export default CreatePoll;
