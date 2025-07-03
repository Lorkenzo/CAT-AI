import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Card,
  Avatar
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import API from '../API/API.mjs';
import { useFormData } from "../contexts/FormContext"

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + sizes[i];
};

function FileUploader({file,setFile}) {
  const [isDragOver, setIsDragOver] = useState(false);
  
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(false)
  const fileInputRef = useRef(null);

  const { formData, setFormData } = useFormData();

  const handleFileUpload = async (selectedFile) => {
    if (!selectedFile) return;
    const data = new FormData();
    data.append('file', selectedFile);

    try {
      setUploading(true);
      const file = await API.handleUploadFile(data); // chiamata fetch
      setFormData(prev => ({
            ...prev,
            fileURL: file.url
        }));
      setFile(selectedFile);
      setUploadError(false)
    } catch (err) {
        setUploadError(true)
        console.log(err);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = async (event) => {
    const selected = event.target.files[0];
    handleFileUpload(selected)
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    handleFileUpload(droppedFile)
    setIsDragOver(false); 
  };

  const handleDelete = async () => {
    try{
      const relativePath = new URL(formData.fileURL).pathname.replace(/^\/+/, '');
      await API.handleDeleteFile(relativePath)
      setFile(null)
      setFormData(prev => ({
            ...prev,
            fileURL: null
        }));
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
    catch(err){
      console.log(err)
    }
  };

  const handleDragOver = (event) => event.preventDefault();
  const handleDragEnter = () => setIsDragOver(true);
  const handleDragLeave = () => setIsDragOver(false);

  useEffect(()=>{
    const tid = setTimeout(() => {
            setUploadError(false)
        }, 4000);
        return () => clearTimeout(tid);
  },[uploadError])

  useEffect(()=>{
    const handleExtraction = async () => {
      try{
        const relativePath = new URL(formData.fileURL).pathname.replace(/^\/+/, '');
        const text = await API.handleTextExtraction(relativePath);
        console.log(text)
      }
      catch(err){
        console.log(err)
      }
    }
    if (file && formData.fileURL) handleExtraction(formData.fileURL)
    
  },[file,formData.fileURL])

  return (
    <>
    {file ? 
    
    <Card variant="outlined" className="drop-shadow-sm rounded-md" sx={{ p: 1, px:2, display: 'flex', alignItems: 'center' }}>
        <Avatar sx={{ bgcolor: '#fff', color: 'primary.main', mr: 2 }}>
        {
            file.type === 'application/pdf' ? (
            <InsertDriveFileIcon />  // Mostra icona PDF
            ) : (
            <img src={formData.fileURL} alt="preview" width={40} height={40} style={{ objectFit: 'contain' }} />
            )
        }
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body1">{file.name}</Typography>
        <Typography variant="caption" color="text.secondary">
            {formatFileSize(file.size)} • Upload complete
        </Typography>
        </Box>
        <IconButton onClick={handleDelete} size="medium">
        <DeleteIcon />
        </IconButton>
        <CheckCircleIcon sx={{ color: 'green', ml: 1 }} />
    </Card>
    
    :
    <Box
      onClick={() => fileInputRef.current.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "70%",
        border: `2px dashed `,
        borderColor: uploadError? 'error.main': 'primary.main',
        borderRadius: 2,
        p: 4,
        mt: 2,
        bgcolor: isDragOver ? 'rgba(25, 118, 210, 0.08)' : uploadError ? 'rgba(211, 47, 47, 0.04)' : "",
        justifyContent: "center",
        alignItems: "center",
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: uploadError? "": 'rgba(25, 118, 210, 0.08)',
        },
      }}
    >
      <UploadFileIcon sx={{
        fontSize: 40,
        color: uploadError? 'error.main': 'primary.main',
      }} />
      <Box
        className={`flex flex-col items-center`}
        sx={{
          textAlign: 'center',
        }}
      >
        <Typography variant="body1" mt={2}>
          Drag and Drop or Click to upload your exercise file
        </Typography>
        <Typography variant="body2" mt={1} color={uploadError? "error" : "textSecondary"}>
          {uploadError? "Unsupported file or size exceded":"SVG, PNG, JPG, PDF (max. 3MB)"}
        </Typography>
      </Box>
      <input
        type="file"
        accept="*"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileSelect}
      />
    </Box>
    }
    </>
  );
};

export { FileUploader };
