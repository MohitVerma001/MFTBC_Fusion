export const validateBlog = (req, res, next) => {
  const { title, content, publish_to } = req.body;

  const errors = [];

  if (!title || title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (!content || content.trim().length === 0) {
    errors.push('Content is required');
  }

  if (!publish_to) {
    errors.push('Publish To is required');
  } else if (!['News', 'HR', 'IT'].includes(publish_to)) {
    errors.push('Publish To must be one of: News, HR, IT');
  }

  if (publish_to === 'HR' && !req.body.category_id) {
    errors.push('Category is required when publishing to HR');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }

  next();
};

export const validateCategory = (req, res, next) => {
  const { type, name } = req.body;

  const errors = [];

  if (!type) {
    errors.push('Type is required');
  } else if (!['Category', 'Link'].includes(type)) {
    errors.push('Type must be either Category or Link');
  }

  if (!name || name.trim().length === 0) {
    errors.push('Name is required');
  }

  if (type === 'Category' && !req.body.description) {
    errors.push('Description is required for Category type');
  }

  if (type === 'Link' && !req.body.link_url) {
    errors.push('Link URL is required for Link type');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }

  next();
};

export const validateSubspace = (req, res, next) => {
  const { name } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Subspace name is required'
    });
  }

  next();
};

export const validateTag = (req, res, next) => {
  const { name } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Tag name is required'
    });
  }

  next();
};

export default {
  validateBlog,
  validateCategory,
  validateSubspace,
  validateTag
};
