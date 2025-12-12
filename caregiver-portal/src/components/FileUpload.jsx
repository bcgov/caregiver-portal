import React, { useState, useRef } from 'react';
import { Upload, X, File, AlertCircle } from 'lucide-react';
import Button from './Button';

const FileUpload = ({ 
    attachmentType, 
    onUpload, 
    onDelete,
    uploadedFiles = [],
    acceptedTypes = ['pdf', 'jpg', 'jpeg', 'png'],
    maxSizeMB = 10,
    applicationPackageId,
    isLocked = false,
    householdMemberId = null,
    applicationFormId = null,
    description = ''
  }) => {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    const validateFile = (file) => {
      // Check file type
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      if (!acceptedTypes.includes(fileExtension)) {
        return `File type not supported. Accepted types: ${acceptedTypes.join(', ')}`;
      }

      // Check file size
      if (file.size > maxSizeBytes) {
        return `File size exceeds ${maxSizeMB}MB limit`;
      }

      return null;
    };

    const handleFile = async (selectedFile) => {
      setError('');

      const validationError = validateFile(selectedFile);
      if (validationError) {
        setError(validationError);
        return;
      }

      setFile(selectedFile);
        // Automatically upload
      await handleUpload(selectedFile);

    };

    const handleDragOver = (e) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDrop = (e) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        handleFile(droppedFile);
      }
    };

    const handleBrowseClick = () => {
      fileInputRef.current?.click();
    };

    const handleFileInputChange = (e) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        handleFile(selectedFile);
      }
    };

    const handleRemoveFile = () => {
      setFile(null);
      setError('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    const handleUpload = async (fileToUpload) => {
      if (!fileToUpload) return;

      setIsUploading(true);
      setError('');

      
        // Convert file to base64
        const reader = new FileReader();
        reader.onload = async () => {
          try {
          const base64String = reader.result.split(',')[1]; // Remove data:image/jpeg;base64, prefix

          const fileNameParts = fileToUpload.name.split('.');
          const fileExtension = fileNameParts.length > 1 ? fileNameParts.pop().toLowerCase() : '';
          const fileNameWithoutExt = fileNameParts.join('.');

          const uploadData = {
            applicationPackageId,
            applicationFormId,
            householdMemberId,
            attachmentType,
            fileName: fileNameWithoutExt,
            fileType: fileExtension,
            fileData: base64String,
            description,
          };

          await onUpload(uploadData);
          setIsUploading(false);

          // Clear the file after successful upload
          handleRemoveFile();
        } catch (err) {
          setError(err.message || 'Failed to upload file');
          setIsUploading(false);
        }
        };

        reader.onerror = () => {
          setError('Failed to read file');
          setIsUploading(false);
        };

        reader.readAsDataURL(fileToUpload);

    };

    const formatFileSize = (bytes) => {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
      <div className="upload-container">
        {!isLocked && (
          <>
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />

        {!file ? (
          <div
            className={`file-upload-dropzone ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleBrowseClick}
          >
            <Upload className="file-upload-icon" size={48} />
            <p className="file-upload-text">
              <strong>Click to browse</strong> or drag and drop
            </p>
            <p className="file-upload-hint">
              {acceptedTypes.join(', ')} (max {maxSizeMB}MB)
            </p>
          </div>
        ) : (
            <div className="file-upload-preview">
              <div className="file-upload-preview-content">
                <File size={24} />
                <div className="file-upload-preview-info">
                  <p className="file-upload-preview-name">{file.name}</p>
                  <p className="file-upload-preview-size">
                    {formatFileSize(file.size)}
                    {isUploading && ' - Uploading...'}
                  </p>
                </div>
                {!isUploading && (
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="file-upload-remove"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
              {isUploading && (
                <div className="upload-progress">
                  <div className="upload-progress-bar">
                    <div className="upload-progress-fill"></div>
                  </div>
                </div>
              )}
            </div>
          
        )}

        {error && (
          <div className="file-upload-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
      </>
      )}

      {uploadedFiles && uploadedFiles.length > 0 && (
        <div className="uploaded-files-section">
          <h3 className="uploaded-files-title">Uploaded Files</h3>
          <div className="uploaded-files-list">
            {uploadedFiles.map((uploadedFile) => (
              <div key={uploadedFile.attachmentId} className="uploaded-file-item">
              <File size={20} className="file-icon"/>
              <div className="uploaded-file-info">
                <span className="uploaded-file-name">{uploadedFile.fileName}</span>
                <span className="uploaded-file-size">{formatFileSize(uploadedFile.fileSize)}</span>
              </div>
              {!isLocked &&
                <button
                  type="button"
                  onClick={() => onDelete(uploadedFile.attachmentId)}
                  className="uploaded-file-remove"
                  aria-label="Delete file"
                >
                <X size={20} />
                </button>
              }
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    );
  };

export default FileUpload;