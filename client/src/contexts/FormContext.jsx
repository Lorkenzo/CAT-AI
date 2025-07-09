import React, { createContext, useState, useContext } from 'react';

const FormContext = createContext();

const myStyle = {
    name: "MyStyle",
    font: { label: "Roboto", value: "roboto" },
    c1: "",
    c2: "",
    c3: "",
    c4: "",
    c5: ""
  }

const FormalStyle = {
    name: "Formal",
    font: { label: "Playfair Display", value: "playfair" },
    c1: "",
    c2: "",
    c3: "",
    c4: "",
    c5: ""
  }

const PlayfulStyle = {
    name: "Playful",
    font: { label: "Poppins", value: "poppins" },
    c1: "",
    c2: "",
    c3: "",
    c4: "",
    c5: ""
  }

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    fileURL: null,
    exercisetext:"",
    goals:[],
    prerequisites:[],
    reminder: false,
    example: false,
    exercise_level: "Easy",
    n_questions: "3",
    vocabulary: "Colloquial",
    style: { 
      "MyStyle":myStyle,
      "Formal": FormalStyle,
      "Playful":PlayfulStyle
    },
    selectedStyle: "MyStyle",
    confidence: "95",
    dislexiaInclusive: false,
  });

  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormData = () => useContext(FormContext);