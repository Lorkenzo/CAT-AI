import React, { createContext, useContext, useState, useEffect } from "react";

const DocumentContext = createContext();

const getInitialTextBoxes = () => {
  const saved = localStorage.getItem("textBoxes");
  try {
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const getInitialImages = () => {
  const saved = localStorage.getItem("images");
  try {
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const DocumentProvider = ({ children }) => {
  const [textBoxes, setTextBoxes] = useState(getInitialTextBoxes);
  const [images, setImages] = useState(getInitialImages);

  // Salva ogni volta che cambia
  useEffect(() => {
    localStorage.setItem("textBoxes", JSON.stringify(textBoxes));
  }, [textBoxes]);

  useEffect(() => {
    localStorage.setItem("images", JSON.stringify(images));
  }, [images]);

  // ───────────── TEXT BOX ─────────────

  let newY = 16
  const addTextBox = () => {
    if (textBoxes.length >=1 ){
        console.log(textBoxes)
        const prevTextBox = textBoxes.sort((a,b) => b.position.y - a.position.y)[0]
        newY = prevTextBox.position.y + prevTextBox.h + 16
    }

    const newTextBox = {
      id: Date.now(),
      position: {x: 16, y: newY},
      w: 200,
      h: 50,
      content: "",
      textSize: 16,
      textColor: "#000000",
      bold: false,
      italic: false,
      underlined: false,
    };
    setTextBoxes((prev) => [...prev, newTextBox]);
  };

  const updateTextBox = (id, updates) => {
    setTextBoxes((prev) =>
      prev.map((box) => (box.id === id ? { ...box, ...updates } : box))
    );
  };

  const deleteTextBox = (id) => {
    setTextBoxes((prev) => prev.filter((box) => box.id !== id));
  };

  // ───────────── IMAGES ─────────────
  const addImage = (url) => {
    const newImage = {
      id: Date.now(),
      url,
      x: 16,
      y: 16,
      w: 200,
      h: 200,
    };
    setImages((prev) => [...prev, newImage]);
  };

  const updateImage = (id, updates) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, ...updates } : img))
    );
  };

  const deleteImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  return (
    <DocumentContext.Provider
      value={{
        textBoxes,
        images,
        addTextBox,
        updateTextBox,
        deleteTextBox,
        addImage,
        updateImage,
        deleteImage,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocument = () => useContext(DocumentContext);