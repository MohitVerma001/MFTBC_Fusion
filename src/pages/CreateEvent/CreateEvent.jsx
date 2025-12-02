import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import FormWrapper from "../../components/FormComponents/FormWrapper";
import FormSection from "../../components/FormComponents/FormSection";
import TextField from "../../components/FormComponents/TextField";
import TextArea from "../../components/FormComponents/TextArea";
import SelectField from "../../components/FormComponents/SelectField";
import DateTimeField from "../../components/FormComponents/DateTimeField";
import TagInput from "../../components/FormComponents/TagInput";

const CreateEvent = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    publishTo: "",
    subject: "",
    contentText: "",
    location: "",
    phone: "",
    startDate: "",
    endDate: "",
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
    if (!formData.subject.trim()) newErrors.subject = "Event title is required";
    if (!formData.contentText.trim()) newErrors.contentText = "Description is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createEvent = async (data) => {
    const event = {
      publishTo: data.publishTo,
      subject: data.subject,
      content: { text: data.contentText },
      location: data.location,
      phone: data.phone,
      startDate: data.startDate,
      endDate: data.endDate,
      tags: data.tags,
      published: new Date().toISOString(),
      author: { id: "current-user-id", name: "John Doe", avatar: "JD" },
      parentPlace: data.publishTo,
      type: "event",
    };

    console.log("Creating event:", event);
    return event;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await createEvent(formData);
      alert("Event Published Successfully!");
      navigate(formData.publishTo === "news" ? "/news" : "/");
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to publish event. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <FormWrapper
        title="Create Event"
        subtitle="Organize and share upcoming events with your team"
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
        submitLabel="Publish Event"
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

        <FormSection title="Event Details" icon="📅">
          <TextField
            label="Event Title"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            placeholder="Enter event title"
            required
            error={errors.subject}
            icon="🎯"
          />
          <TextArea
            label="Description"
            name="contentText"
            value={formData.contentText}
            onChange={handleInputChange}
            placeholder="Describe the event..."
            rows={6}
            required
            error={errors.contentText}
          />
          <div className="row">
            <div className="col-md-6">
              <TextField
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Event location"
                icon="📍"
              />
            </div>
            <div className="col-md-6">
              <TextField
                label="Contact Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 000-0000"
                type="tel"
                icon="📞"
              />
            </div>
          </div>
        </FormSection>

        <FormSection title="Schedule" icon="⏰">
          <div className="row">
            <div className="col-md-6">
              <DateTimeField
                label="Start Date & Time"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                error={errors.startDate}
              />
            </div>
            <div className="col-md-6">
              <DateTimeField
                label="End Date & Time"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
                error={errors.endDate}
              />
            </div>
          </div>
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

export default CreateEvent;
