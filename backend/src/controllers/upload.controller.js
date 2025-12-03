import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const UploadController = {
  async uploadFile(req, res) {
    try {
      if (!req.file && !req.files) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      if (req.file) {
        const fileUrl = `/uploads/${req.file.filename}`;

        return res.status(200).json({
          success: true,
          message: 'File uploaded successfully',
          data: {
            url: fileUrl,
            filename: req.file.originalname,
            size: req.file.size,
            mimeType: req.file.mimetype
          }
        });
      }

      if (req.files) {
        const uploadedFiles = [];

        if (Array.isArray(req.files)) {
          uploadedFiles.push(...req.files.map(file => ({
            url: `/uploads/${file.filename}`,
            filename: file.originalname,
            size: file.size,
            mimeType: file.mimetype
          })));
        } else {
          Object.keys(req.files).forEach(fieldName => {
            const files = req.files[fieldName];
            files.forEach(file => {
              uploadedFiles.push({
                url: `/uploads/${file.filename}`,
                filename: file.originalname,
                size: file.size,
                mimeType: file.mimetype
              });
            });
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Files uploaded successfully',
          data: uploadedFiles
        });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload file',
        error: error.message
      });
    }
  },

  async uploadMultiple(req, res) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded'
        });
      }

      const uploadedFiles = req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        filename: file.originalname,
        size: file.size,
        mimeType: file.mimetype
      }));

      res.status(200).json({
        success: true,
        message: 'Files uploaded successfully',
        data: uploadedFiles
      });
    } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload files',
        error: error.message
      });
    }
  }
};

export default UploadController;
