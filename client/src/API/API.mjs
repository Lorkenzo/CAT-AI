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

const handleDownloadFile = async (fileUrl, fileName) => {
    try {
      const response = await fetch(fileUrl, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Download fallito");
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Errore durante il download:", error);
    }
  };

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

const handleTextAnalysis = async (text) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/generate/exercise-info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        text 
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Errore:', data.errore);
      return { errore: data.errore };
    }

    console.log('Risultato:', data);
    return data;

  } catch (error) {
    console.error('Errore di rete:', error);
    return { errore: 'Errore di rete o server non disponibile' };
  }
};

const handleExerciseGeneration = async (formdata) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/generate/exercise`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        data: formdata
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Errore:', data.errore);
      return { errore: data.errore };
    }

    console.log('Risultato:', data);
    return data;

  } catch (error) {
    console.error('Errore di rete:', error);
    return { errore: 'Errore di rete o server non disponibile' };
  }
};

const handleImageGeneration = async (text, palette) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/generate/image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        text,
        palette
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Errore:', data.errore);
      return { errore: data.errore };
    }

    return data;

  } catch (error) {
    console.error('Errore di rete:', error);
    return { errore: 'Errore di rete o server non disponibile' };
  }
};


const handleExerciseRegeneration = async (textBoxes, text) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/generate/exercise-again`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        textBoxes,
        text
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Errore:', data.errore);
      return { errore: data.errore };
    }

    console.log('Risultato:', data);
    return data;

  } catch (error) {
    console.error('Errore di rete:', error);
    return { errore: 'Errore di rete o server non disponibile' };
  }
};

const handleSolutionRegeneration = async (textBoxes) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/generate/solution-again`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        textBoxes
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Errore:', data.errore);
      return { errore: data.errore };
    }

    console.log('Risultato:', data);
    return data;

  } catch (error) {
    console.error('Errore di rete:', error);
    return { errore: 'Errore di rete o server non disponibile' };
  }
};

const handleElementRegeneration = async (textBoxes, selectedId, text) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/generate/element-again`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        textBoxes,
        selectedId,
        text
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Errore:', data.errore);
      return { errore: data.errore };
    }

    console.log('Risultato:', data);
    return data;

  } catch (error) {
    console.error('Errore di rete:', error);
    return { errore: 'Errore di rete o server non disponibile' };
  }
};

const API = {
  handleUploadFile,
  handleDownloadFile,
  handleDeleteFile,
  handleTextExtraction,
  handleTextAnalysis,
  handleExerciseGeneration,
  handleExerciseRegeneration,
  handleSolutionRegeneration,
  handleElementRegeneration,
  handleImageGeneration,
}

export default API