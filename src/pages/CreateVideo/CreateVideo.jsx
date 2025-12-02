import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import FormWrapper from "../../components/FormComponents/FormWrapper";
import FormSection from "../../components/FormComponents/FormSection";
import TextField from "../../components/FormComponents/TextField";
import TextArea from "../../components/FormComponents/TextArea";
import SelectField from "../../components/FormComponents/SelectField";
import TagInput from "../../components/FormComponents/TagInput";
import ImageUpload from "../../components/FormComponents/ImageUpload";
import FileUpload from "../../components/FormComponents/FileUpload";

const CreateVideo = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    publishTo: "",
    subject: "",
    contentText: "",
    videoFile: [],
    thumbnail: [],
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
    if (!formData.subject.trim()) newErrors.subject = "Title is required";
    if (!formData.contentText.trim()) newErrors.contentText = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createVideo = async (data) => {
    const video = {
      publishTo: data.publishTo,
      subject: data.subject,
      content: { text: data.contentText },
      videoFile: data.videoFile.length > 0 ? data.videoFile[0] : null,
      thumbnail: data.thumbnail.length > 0 ? data.thumbnail[0].url : null,
      tags: data.tags,
      published: new Date().toISOString(),
      author: { id: "current-user-id", name: "John Doe", avatar: "JD" },
      parentPlace: data.publishTo,
    };

    console.log("Creating video:", video);
    return video;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await createVideo(formData);
      alert("Video Published Successfully!");
      navigate(formData.publishTo === "news" ? "/news" : "/");
    } catch (error) {
      console.error("Error creating video:", error);
      alert("Failed to publish video. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <FormWrapper
        title="Create Video"
        subtitle="Share video content with your organization"
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
        submitLabel="Publish Video"
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

        <FormSection title="Video Information" icon="🎥">
          <TextField
            label="Video Title"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            placeholder="Enter video title"
            required
            error={errors.subject}
            icon="📹"
          />
          <TextArea
            label="Description"
            name="contentText"
            value={formData.contentText}
            onChange={handleInputChange}
            placeholder="Describe the video content..."
            rows={6}
            required
            error={errors.contentText}
          />
        </FormSection>

        <FormSection title="Video Upload" icon="📹">
          <FileUpload
            label="Video File"
            files={formData.videoFile}
            onFilesChange={(files) =>
              setFormData((prev) => ({ ...prev, videoFile: files.slice(0, 1) }))
            }
            accept="video/*"
          />
          <small className="text-muted">Supported formats: MP4, MOV, AVI, WebM</small>
        </FormSection>

        <FormSection title="Thumbnail" icon="🖼️">
          <ImageUpload
            label="Video Thumbnail"
            images={formData.thumbnail}
            onImagesChange={(images) =>
              setFormData((prev) => ({ ...prev, thumbnail: images.slice(0, 1) }))
            }
          />
          <small className="text-muted">Upload a thumbnail image for your video</small>
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

export default CreateVideo;
