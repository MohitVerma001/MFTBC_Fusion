import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import FormWrapper from "../../components/FormComponents/FormWrapper";
import FormSection from "../../components/FormComponents/FormSection";
import TextField from "../../components/FormComponents/TextField";
import RichTextEditor from "../../components/FormComponents/RichTextEditor";
import SelectField from "../../components/FormComponents/SelectField";
import TagInput from "../../components/FormComponents/TagInput";
import FileUpload from "../../components/FormComponents/FileUpload";

const CreateDocument = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    publishTo: "",
    subject: "",
    contentText: "",
    tags: [],
    attachments: [],
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
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.contentText.trim()) newErrors.contentText = "Content is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createDocument = async (data) => {
    const document = {
      publishTo: data.publishTo,
      subject: data.subject,
      content: { text: data.contentText },
      tags: data.tags,
      attachments: data.attachments.map((att) => ({
        name: att.name,
        size: att.size,
      })),
      published: new Date().toISOString(),
      author: { id: "current-user-id", name: "John Doe", avatar: "JD" },
      parentPlace: data.publishTo,
    };

    console.log("Creating document:", document);
    return document;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await createDocument(formData);
      alert("Document Published Successfully!");
      navigate(formData.publishTo === "news" ? "/news" : "/");
    } catch (error) {
      console.error("Error creating document:", error);
      alert("Failed to publish document. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <FormWrapper
        title="Create Document"
        subtitle="Share policies, procedures, and important documents"
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
        submitLabel="Publish Document"
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

        <FormSection title="Document Information" icon="📄">
          <TextField
            label="Document Title"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            placeholder="Enter document title"
            required
            error={errors.subject}
          />
          <RichTextEditor
            label="Description"
            value={formData.contentText}
            onChange={handleContentChange}
            placeholder="Describe the document..."
            required
            error={errors.contentText}
          />
        </FormSection>

        <FormSection title="File Attachments" icon="📎">
          <FileUpload
            label="Upload Documents (PDF, DOC, etc.)"
            files={formData.attachments}
            onFilesChange={(files) =>
              setFormData((prev) => ({ ...prev, attachments: files }))
            }
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
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

export default CreateDocument;
