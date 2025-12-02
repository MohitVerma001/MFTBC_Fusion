# WOW UI Forms Integration Guide

This guide explains the complete form system architecture and how to integrate it with backend APIs.

## 📁 Project Structure

```
src/
├── components/
│   ├── FormComponents/
│   │   ├── FormWrapper.jsx          # Main form container with animations
│   │   ├── FormWrapper.css
│   │   ├── FormSection.jsx          # Card-based sections
│   │   ├── FormSection.css
│   │   ├── TextField.jsx            # Text input with icons
│   │   ├── TextArea.jsx             # Multi-line text input
│   │   ├── SelectField.jsx          # Dropdown select
│   │   ├── DateTimeField.jsx        # Date/time picker
│   │   ├── TagInput.jsx             # Multi-tag input
│   │   ├── ImageUpload.jsx          # Image upload with preview
│   │   ├── FileUpload.jsx           # File upload with list
│   │   ├── DynamicList.jsx          # Dynamic options list
│   │   └── FormFields.css           # Shared field styles
│   ├── Header/
│   └── CreatePanel/
└── pages/
    ├── CreateBlog/
    ├── CreateDocument/
    ├── CreateEvent/
    ├── CreatePoll/
    ├── CreateDiscussion/
    ├── CreateSubSpace/
    └── CreateVideo/
```

## 🎨 Design System Features

### Animations
- **Fade In**: Main container appears smoothly
- **Slide Up**: Form sections animate sequentially with staggered delays
- **Hover Effects**: Cards lift on hover with shadow transitions
- **Button Ripples**: Submit button has wave effect on hover
- **Transform Animations**: Smooth scale and translate on interactions

### Visual Elements
- **Gradient Backgrounds**: Subtle gradient from #f5f7fa to #e9ecef
- **Card Shadows**: Multi-layer shadows for depth
- **Rounded Corners**: Consistent 16px border radius on cards
- **Icon Integration**: Colorful emoji icons for visual hierarchy
- **Focus States**: Red border (#dc2626) with glow effect

### Color Palette
- **Primary**: #dc2626 (Red gradient)
- **Secondary**: #2563eb (Blue)
- **Success**: #22C55E (Green)
- **Warning**: #F59E0B (Orange)
- **Neutral**: Grayscale from #f9fafb to #111827

## 🔧 Reusable Components

### FormWrapper
Main container that provides:
- Title with gradient text effect
- Subtitle for descriptions
- Animated container
- Submit and Cancel buttons
- Form submission handling

**Props:**
```jsx
<FormWrapper
  title="Create Blog"
  subtitle="Optional description"
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  submitLabel="Publish"
>
  {children}
</FormWrapper>
```

### FormSection
Card-based section wrapper with:
- Title with icon
- Hover animation
- Shadow effects

**Props:**
```jsx
<FormSection title="Section Title" icon="📝">
  {children}
</FormSection>
```

### TextField
Text input with:
- Label (with required indicator)
- Icon support
- Error validation display
- Focus animations

**Props:**
```jsx
<TextField
  label="Title"
  name="title"
  value={value}
  onChange={handleChange}
  placeholder="Enter title"
  required
  error={errors.title}
  icon="📝"
  type="text"
/>
```

### TextArea
Multi-line text input with same features as TextField.

**Props:**
```jsx
<TextArea
  label="Content"
  name="content"
  value={value}
  onChange={handleChange}
  placeholder="Write content..."
  rows={10}
  required
  error={errors.content}
/>
```

### SelectField
Dropdown select with validation.

**Props:**
```jsx
<SelectField
  label="Publish To"
  name="publishTo"
  value={value}
  onChange={handleChange}
  options={[
    { value: "news", label: "News" },
    { value: "hr", label: "HR" }
  ]}
  required
  error={errors.publishTo}
  placeholder="Select..."
/>
```

### DateTimeField
Date and time picker.

**Props:**
```jsx
<DateTimeField
  label="Start Date"
  name="startDate"
  value={value}
  onChange={handleChange}
  required
  error={errors.startDate}
  type="datetime-local"
/>
```

### TagInput
Multi-tag input with add/remove functionality.

**Props:**
```jsx
<TagInput
  label="Tags"
  tags={tags}
  onTagsChange={(newTags) => setTags(newTags)}
/>
```

### ImageUpload
Image upload with preview grid.

**Props:**
```jsx
<ImageUpload
  label="Images"
  images={images}
  onImagesChange={(newImages) => setImages(newImages)}
/>
```

### FileUpload
File upload with file list.

**Props:**
```jsx
<FileUpload
  label="Attachments"
  files={files}
  onFilesChange={(newFiles) => setFiles(newFiles)}
  accept=".pdf,.doc,.docx"
/>
```

### DynamicList
Dynamic list for poll options, etc.

**Props:**
```jsx
<DynamicList
  label="Options"
  items={items}
  onItemsChange={(newItems) => setItems(newItems)}
  placeholder="Enter option"
/>
```

## 📋 Form Implementations

### 1. Create Blog
**Route:** `/create/blog`

**Fields:**
- Publish To (select)
- Subject (text)
- Content (textarea)
- Images (image upload)
- Attachments (file upload)
- Tags (tag input)

**JSON Output:**
```json
{
  "publishTo": "news",
  "subject": "Blog Title",
  "content": { "text": "Content..." },
  "tags": ["tag1", "tag2"],
  "contentImages": [{ "url": "...", "name": "..." }],
  "attachments": [{ "name": "...", "size": "..." }],
  "published": "2025-12-02T...",
  "author": { "id": "...", "name": "...", "avatar": "..." },
  "parentPlace": "news",
  "type": "post"
}
```

### 2. Create Document
**Route:** `/create/document`

**Fields:**
- Publish To (select)
- Document Title (text)
- Description (textarea)
- File Attachments (file upload - PDF, DOC, etc.)
- Tags (tag input)

### 3. Create Event
**Route:** `/create/event`

**Fields:**
- Publish To (select)
- Event Title (text)
- Description (textarea)
- Location (text)
- Contact Phone (tel)
- Start Date & Time (datetime)
- End Date & Time (datetime)
- Tags (tag input)

### 4. Create Poll
**Route:** `/create/poll`

**Fields:**
- Publish To (select)
- Question (text)
- Additional Context (textarea - optional)
- Poll Options (dynamic list - min 2)
- Tags (tag input)

### 5. Create Discussion
**Route:** `/create/discussion`

**Fields:**
- Publish To (select)
- Topic (text)
- Content (textarea)
- Tags (tag input)

### 6. Create SubSpace
**Route:** `/create/subspace`

**Fields:**
- Publish To (select)
- SubSpace Name (text)
- Description (textarea)
- Cover Image (image upload - single)

### 7. Create Video
**Route:** `/create/video`

**Fields:**
- Publish To (select)
- Video Title (text)
- Description (textarea)
- Video File (file upload - video formats)
- Thumbnail (image upload - single)
- Tags (tag input)

## 🔌 Backend Integration

### Current Implementation

Each form has a placeholder function that constructs the data object:

```javascript
const createBlogPost = async (data) => {
  const blogPost = {
    publishTo: data.publishTo,
    subject: data.subject,
    content: { text: data.contentText },
    tags: data.tags,
    // ... more fields
    published: new Date().toISOString(),
    author: { id: "current-user-id", name: "John Doe" },
  };

  console.log("Creating blog post:", blogPost);
  return blogPost;
};
```

### Integration Steps

#### Option 1: Direct API Calls with Fetch

Replace the placeholder function with actual API calls:

```javascript
const createBlogPost = async (data) => {
  const blogPost = {
    publishTo: data.publishTo,
    subject: data.subject,
    content: { text: data.contentText },
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
      id: "current-user-id", // Replace with actual user ID
      name: "John Doe", // Replace with actual user name
      avatar: "JD",
    },
    parentPlace: data.publishTo,
    type: "post",
  };

  try {
    const response = await fetch('/api/blog-posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`, // Your auth token
      },
      body: JSON.stringify(blogPost),
    });

    if (!response.ok) {
      throw new Error('Failed to create blog post');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
```

#### Option 2: Supabase Integration

Since Supabase is available, here's how to integrate:

**1. Create Database Tables**

First, create migrations for each content type:

```sql
-- Blog Posts
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  publish_to TEXT NOT NULL,
  subject TEXT NOT NULL,
  content JSONB NOT NULL,
  tags TEXT[],
  content_images JSONB[],
  attachments JSONB[],
  published TIMESTAMPTZ DEFAULT now(),
  author_id UUID NOT NULL,
  parent_place TEXT,
  type TEXT DEFAULT 'post',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all blog posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create blog posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);
```

**2. Update Form Functions**

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const createBlogPost = async (data) => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();

  const blogPost = {
    publish_to: data.publishTo,
    subject: data.subject,
    content: { text: data.contentText },
    tags: data.tags,
    content_images: data.contentImages.map((img) => ({
      url: img.url,
      name: img.name,
    })),
    attachments: data.attachments.map((att) => ({
      name: att.name,
      size: att.size,
    })),
    author_id: user.id,
    parent_place: data.publishTo,
    type: 'post',
  };

  const { data: result, error } = await supabase
    .from('blog_posts')
    .insert([blogPost])
    .select()
    .single();

  if (error) {
    console.error('Supabase Error:', error);
    throw error;
  }

  return result;
};
```

**3. File Upload Handling**

For images and attachments, use Supabase Storage:

```javascript
const uploadFile = async (file, bucket = 'attachments') => {
  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return publicUrl;
};

// In your form submit handler:
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  try {
    // Upload images first
    const uploadedImages = await Promise.all(
      formData.contentImages.map(async (img) => ({
        url: await uploadFile(img.file, 'images'),
        name: img.name,
      }))
    );

    // Upload attachments
    const uploadedAttachments = await Promise.all(
      formData.attachments.map(async (att) => ({
        url: await uploadFile(att.file, 'attachments'),
        name: att.name,
        size: att.size,
      }))
    );

    // Create blog post with uploaded file URLs
    await createBlogPost({
      ...formData,
      contentImages: uploadedImages,
      attachments: uploadedAttachments,
    });

    alert("Blog Post Published Successfully!");
    navigate("/news");
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to publish. Please try again.");
  }
};
```

#### Option 3: Centralized API Service

Create a centralized API service:

**File: `src/services/api.js`**

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const api = {
  // Blog Posts
  createBlogPost: async (data) => {
    const { data: result, error } = await supabase
      .from('blog_posts')
      .insert([data])
      .select()
      .single();
    if (error) throw error;
    return result;
  },

  // Documents
  createDocument: async (data) => {
    const { data: result, error } = await supabase
      .from('documents')
      .insert([data])
      .select()
      .single();
    if (error) throw error;
    return result;
  },

  // Events
  createEvent: async (data) => {
    const { data: result, error } = await supabase
      .from('events')
      .insert([data])
      .select()
      .single();
    if (error) throw error;
    return result;
  },

  // Polls
  createPoll: async (data) => {
    const { data: result, error } = await supabase
      .from('polls')
      .insert([data])
      .select()
      .single();
    if (error) throw error;
    return result;
  },

  // Discussions
  createDiscussion: async (data) => {
    const { data: result, error } = await supabase
      .from('discussions')
      .insert([data])
      .select()
      .single();
    if (error) throw error;
    return result;
  },

  // SubSpaces
  createSubSpace: async (data) => {
    const { data: result, error } = await supabase
      .from('subspaces')
      .insert([data])
      .select()
      .single();
    if (error) throw error;
    return result;
  },

  // Videos
  createVideo: async (data) => {
    const { data: result, error } = await supabase
      .from('videos')
      .insert([data])
      .select()
      .single();
    if (error) throw error;
    return result;
  },

  // File Upload
  uploadFile: async (file, bucket = 'attachments') => {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);
    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicUrl;
  },
};
```

**Usage in forms:**

```javascript
import { api } from '../../services/api';

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  try {
    await api.createBlogPost(formData);
    alert("Blog Post Published Successfully!");
    navigate("/news");
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to publish. Please try again.");
  }
};
```

## 🎯 Form Validation

Each form includes validation:

```javascript
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
```

## 🚀 User Flow

1. User clicks "+" icon in navbar
2. CreatePanel slides in from right
3. User clicks "Create Blog" (or other option)
4. Form page opens with animations
5. User fills out form fields
6. Form validates on submit
7. Success alert shows
8. User redirects to appropriate page

## 📱 Responsive Design

All forms are fully responsive:
- **Desktop**: Full-width cards with optimal spacing
- **Tablet**: Adjusted padding and grid layouts
- **Mobile**: Single column, full-width buttons, stacked layouts

## 🎨 Customization

To customize the design:
1. **Colors**: Update CSS variables in FormWrapper.css and FormFields.css
2. **Animations**: Adjust keyframes and transition durations
3. **Spacing**: Modify padding and margin values
4. **Shadows**: Change box-shadow values for depth

## ✅ Testing Checklist

- [ ] All forms load correctly
- [ ] Validation works for required fields
- [ ] File uploads preview correctly
- [ ] Images display thumbnails
- [ ] Tags can be added and removed
- [ ] Submit button triggers correctly
- [ ] Success alerts appear
- [ ] Navigation redirects work
- [ ] Mobile responsive layouts
- [ ] Animations play smoothly
- [ ] Keyboard navigation works
- [ ] Accessibility features enabled

## 🔐 Security Considerations

1. **Authentication**: Ensure user is authenticated before form access
2. **File Validation**: Validate file types and sizes on upload
3. **Input Sanitization**: Sanitize all user inputs before submission
4. **CSRF Protection**: Implement CSRF tokens if needed
5. **Rate Limiting**: Add rate limiting to prevent spam
6. **File Size Limits**: Enforce reasonable file size limits

## 📚 Additional Resources

- Bootstrap 5 Documentation
- React Router Documentation
- Supabase Documentation
- Accessibility Guidelines (WCAG)

---

**Created by:** WOW UI Form System
**Version:** 1.0.0
**Last Updated:** 2025-12-02
