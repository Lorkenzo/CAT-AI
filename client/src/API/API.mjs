const SERVER_URL = 'http://localhost:3001'

const handleUploadFile = async (formData) => {
    const response = await fetch(`${SERVER_URL}/api/file/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Upload failed');

    const data = await response.json();
    return data;
}

const handleDeleteFile = async (path) => {
   const response = await fetch(`${SERVER_URL}/api/file/delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path
      }),
    });

    if (!response.ok) throw new Error('Deletion failed');

    const res = await response.json();
    return res;
}

const handleTextExtraction = async (path) => {
   const response = await fetch(`${SERVER_URL}/api/file/extract-text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path
      }),
    });

    if (!response.ok) throw new Error('Text extraction failed');

    const res = await response.json();
    return res;
}



const API = {
  handleUploadFile,
  handleDeleteFile,
  handleTextExtraction
}

export default API