import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import FormWrapper from "../../components/FormComponents/FormWrapper";
import FormSection from "../../components/FormComponents/FormSection";
import TextField from "../../components/FormComponents/TextField";
import RichTextEditor from "../../components/FormComponents/RichTextEditor";
import SelectField from "../../components/FormComponents/SelectField";
import TagInput from "../../components/FormComponents/TagInput";
import ImageUpload from "../../components/FormComponents/ImageUpload";
import FileUpload from "../../components/FormComponents/FileUpload";

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
      type: "post",
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
    <>
      <Header />
      <FormWrapper
        title="Create Blog Post"
        subtitle="Share your insights and updates with the organization"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel="Publish Blog"
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

        <FormSection title="Basic Information" icon="📝">
          <TextField
            label="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            placeholder="Enter blog post subject"
            required
            error={errors.subject}
          />
          <RichTextEditor
            label="Content"
            value={formData.contentText}
            onChange={handleContentChange}
            placeholder="Write your blog content here..."
            required
            error={errors.contentText}
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

export default CreateBlog;
