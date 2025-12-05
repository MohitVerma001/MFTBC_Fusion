# Create Form Pattern Guide

This guide explains how to reuse the CreateBlog form pattern for other content types.

## Overview

The CreateBlog component serves as a template for all create forms in the application. It follows a consistent structure that can be easily adapted for different content types.

## File Structure

```
src/pages/
  └── Create[ContentType]/
      ├── Create[ContentType].jsx
      └── Create[ContentType].css
```

## Core Pattern

### 1. Component Structure

```jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import "./Create[ContentType].css";

const Create[ContentType] = () => {
  const navigate = useNavigate();

  // State management
  const [formData, setFormData] = useState({
    publishTo: "",
    // Add your specific fields here
  });

  const [errors, setErrors] = useState({});

  // Form handlers
  const handleInputChange = (e) => { /* ... */ };
  const validateForm = () => { /* ... */ };
  const handleSubmit = async (e) => { /* ... */ };
  const handleCancel = () => navigate(-1);

  return (
    <div className="create-[content-type]-page">
      <Header />
      <div className="container py-4">
        <div className="create-[content-type]-container">
          {/* Form sections */}
        </div>
      </div>
    </div>
  );
};

export default Create[ContentType];
```

### 2. Form Sections

Every create form should have these sections:

1. **Publish Type Section** (Required)
   - Dropdown with options: News, HR, IT

2. **Basic Information** (Content-specific)
   - Title/Subject
   - Main content field

3. **Metadata** (Optional but recommended)
   - Tags
   - Categories
   - Other classification fields

4. **Images** (If applicable)
   - Multiple image upload
   - Preview functionality

5. **Attachments** (If applicable)
   - Multiple file upload
   - File list with remove option

6. **Actions**
   - Cancel button
   - Submit button

### 3. CSS Pattern

The CreateBlog.css can be reused with minimal changes:

1. Copy the file
2. Replace "create-blog" with "create-[content-type]"
3. Adjust specific styling as needed

Key CSS classes pattern:
- `.create-[content-type]-page` - Page wrapper
- `.create-[content-type]-container` - Content container
- `.create-[content-type]-title` - Page title
- `.form-section` - Reusable section wrapper
- `.form-section-title` - Section headers

## Implementation Guide for Each Content Type

### Create Documents

**Fields:**
- publishTo (dropdown)
- title (text)
- documentType (select: Policy, Procedure, Template, Report)
- content (rich text)
- tags (multi-select)
- attachments (file upload)

**Route:** `/create/document`

**CreatePanel ID:** `documents`

### Create SubSpace

**Fields:**
- publishTo (dropdown)
- subSpaceName (text)
- description (textarea)
- icon (image upload)
- privacy (radio: Public, Private)
- members (multi-select users)

**Route:** `/create/subspace`

**CreatePanel ID:** `subspace`

### Create Events

**Fields:**
- publishTo (dropdown)
- eventTitle (text)
- description (textarea)
- startDate (datetime)
- endDate (datetime)
- location (text)
- coverImage (image upload)
- tags (multi-select)

**Route:** `/create/event`

**CreatePanel ID:** `events`

### Create Discussion

**Fields:**
- publishTo (dropdown)
- topic (text)
- content (rich text)
- category (select)
- tags (multi-select)
- attachments (file upload)

**Route:** `/create/discussion`

**CreatePanel ID:** `discussion`

### Create Polls

**Fields:**
- publishTo (dropdown)
- question (text)
- options (dynamic array of text inputs)
- duration (select: 1 day, 3 days, 1 week, 1 month)
- allowMultiple (checkbox)
- anonymous (checkbox)

**Route:** `/create/poll`

**CreatePanel ID:** `polls`

### Create Videos

**Fields:**
- publishTo (dropdown)
- title (text)
- description (textarea)
- videoUpload (video file or URL)
- thumbnail (image upload)
- tags (multi-select)
- category (select)

**Route:** `/create/video`

**CreatePanel ID:** `videos`

## Step-by-Step Implementation

### 1. Create the Component Files

```bash
mkdir -p src/pages/Create[ContentType]
touch src/pages/Create[ContentType]/Create[ContentType].jsx
touch src/pages/Create[ContentType]/Create[ContentType].css
```

### 2. Copy and Adapt CreateBlog.jsx

- Replace component name
- Update formData state with specific fields
- Modify form sections for content type
- Update validation rules
- Adjust submit logic

### 3. Copy and Adapt CreateBlog.css

- Find and replace "create-blog" → "create-[content-type]"
- Adjust colors/spacing if needed

### 4. Add Route to App.jsx

```jsx
import Create[ContentType] from "./pages/Create[ContentType]/Create[ContentType]";

// In Routes:
<Route path="/create/[content-type]" element={<Create[ContentType] />} />
```

### 5. Update CreatePanel.jsx

```jsx
const handleItemClick = (item) => {
  console.log(`Clicked: ${item.label}`);
  onClose();

  switch(item.id) {
    case "blogs":
      navigate("/create/blog");
      break;
    case "[content-type-id]":
      navigate("/create/[content-type]");
      break;
    // Add other cases
  }
};
```

## Validation Pattern

```jsx
const validateForm = () => {
  const newErrors = {};

  // Always validate publishTo
  if (!formData.publishTo) {
    newErrors.publishTo = "Please select where to publish";
  }

  // Add your required fields
  if (!formData.[field].trim()) {
    newErrors.[field] = "[Field] is required";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

## Submit Pattern

```jsx
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  try {
    await create[ContentType](formData);
    alert("[ContentType] Published Successfully!");

    // Redirect based on publishTo
    if (formData.publishTo === "news") {
      navigate("/news");
    } else {
      navigate("/");
    }
  } catch (error) {
    console.error("Error creating [content-type]:", error);
    alert("Failed to publish [content-type]. Please try again.");
  }
};
```

## API Integration Point

Replace the placeholder function with actual API calls:

```jsx
const create[ContentType] = async (data) => {
  // TODO: Replace with actual API call
  // Example with fetch:
  // const response = await fetch('/api/[content-type]', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // });
  // return response.json();

  console.log("Creating [content-type]:", data);
  return data;
};
```

## Bootstrap Components Used

- `form-control` - Input fields
- `form-select` - Dropdown selects
- `form-label` - Labels
- `btn` - Buttons
- `card` - Section wrappers
- `container` - Layout container
- `input-group` - Combined inputs
- `badge` - Tags display
- `is-invalid` / `invalid-feedback` - Validation messages

## Best Practices

1. **Consistent Naming**: Use the same naming pattern for all components
2. **Reuse CSS**: Copy the base CSS and only modify what's necessary
3. **Validation**: Always validate required fields before submit
4. **User Feedback**: Show success/error alerts
5. **Navigation**: Redirect appropriately after successful submission
6. **Accessibility**: Include proper labels and ARIA attributes
7. **Responsive**: Test all forms on mobile devices
8. **File Handling**: Preview uploaded files when applicable

## Testing Checklist

- [ ] Form loads correctly
- [ ] All fields accept input
- [ ] Validation shows errors appropriately
- [ ] Required fields are enforced
- [ ] File uploads work (if applicable)
- [ ] Submit button works
- [ ] Cancel button navigates back
- [ ] Success message appears
- [ ] Redirects to correct page
- [ ] Form works on mobile
- [ ] Accessible via CreatePanel

## Notes

- The pattern prioritizes consistency across all create forms
- Bootstrap 5 provides base styling, custom CSS adds polish
- Each form should feel familiar while supporting unique content types
- Always test the full flow: Open panel → Click item → Fill form → Submit → Redirect
