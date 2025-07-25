// utils/generatePrompt.js
function extractionPrompt(text) {
  return `
      You are an expert in pedagogy and instructional design for primary and middle school education.
  
      You will be given a piece of text. If it clearly contains a valid school exercise (e.g., reading comprehension, math problem, grammar activity), analyze it and return **only** a JSON object with the following structure:
  
      {
      "text": "...",                         // the full original exercise text
      "prerequisites": [ "...", "..." ],     // list of pre-skills or prior knowledge needed to do the exercise (max 5 words for each)
      "learning_objectives": [ "...", "..." ], // what students are expected to learn, the step next to the prerequisites (max 5 words for each)
      "school_level": "elementary" | "middle",
      "grade": 1-5 (for elementary) or 1-3 (for middle school) //string
      }
  
      If the input text is not a valid school exercise (e.g., it's just random text, incomplete, unrelated to teaching, or nonsensical), return **only** this JSON object:
  
      {
      "error": "The provided text does not appear to be a valid school exercise."
      }
  
      Respond only with the JSON object, no commentary, no markdown formatting.
  
      Input:
      """${text}"""
      `;
}

function generatePrompt(formData) {
  
  const {
    exercisetext,
    goals,
    prerequisites,
    school,
    grade,
    reminder,
    example,
    exercise_level,
    n_questions,
    vocabulary,
    style,
    selectedStyle,
    dislexiaInclusive,
    language,
  } = formData;

  console.log(language)

  const palette = style[selectedStyle]?.palette.filter(Boolean) || ["#000000"];
  const dislexia = dislexiaInclusive
    ? "Use font size between 18-24, increase spacing, and keep layout simple and accessible."
    : "";
  
  const formattedGoals = goals.join(", ") || "Not specified";
  const formattedPre = prerequisites.join(", ") || "Not specified";

  return `
    You are an expert educational content creator for ${school} school, grade ${grade}.
    Create a ${exercise_level} level exercise based on the following features:

    Goals: ${formattedGoals}
    Prerequisites: ${formattedPre}
    Vocabulary style: ${vocabulary}
    Number of questions: ${n_questions}

    Original text to take inspiration from:
    """${exercisetext || "N/A"}"""

    Creation guide:
    - The exercise must be inspired by the original text, but it must NOT copy its content, be creative.
    - Use the following color palette for text color selection: ${palette.join(", ")}.
    - The language of the output must be in ${language.label}
    ${reminder ? "- Include a useful reminder or note at the end of the exercise concerning the pre-prequisites." : ""}
    ${example ? "- Include a worked-out example before the actual questions." : ""}
    ${dislexia}

    Structure requirement:
    1. The first TextBox object must always be a title of the exercise.
    2. The second TextBox must always be a clear instruction of what the student has to do.
    3. The following ${n_questions} TextBoxes will contain a exercise each, remember to be creative!
    4. The solution will be displayed in another page, so the position for solution text boxes have to be resetted.
    5. The solution text boxes has to contain all the procedures.

    Return your result ONLY as a JSON array of objects, each object must have the following structure, no commentary, no markdown formatting:

    {
      "id": unique number (timestamp),
      "page": 1 (exercise) or 2 (solution), //1 belogs to the exercise, 2 belongs to the solution
      "position": { "x": <number>, "y": <number> }, // css position relative to the container, takes as a reference a container 794x1123 px, mantain a padding of a A4 pdf format
      "w": <width>, 
      "h": <height>,
      "content": "<text content>", 
      "textSize": <font size between 12 and 24>,
      "textColor": "<color from palette or #000000>",
      "bold": true|false,
      "italic": true|false,
      "underlined": true|false
    }
    `;
}

function regenerateElementPrompt(allTextBoxes, targetId, userInstruction) {

  return `
    You are a pedagogical assistant. You are working with a JSON-based editable layout system for educational exercises.

    Each block of the exercise is represented as a TextBox object with this structure:

    {
      "id": unique number (timestamp),
      "page": 1 (exercise) or 2 (solution),
      "position": { "x": <number>, "y": <number> }, 
      "w": <width>, 
      "h": <height>,
      "content": "<text content>", 
      "textSize": <font size between 12 and 24>,
      "textColor": "<color from other boxes palette or #000000>",
      "bold": true|false,
      "italic": true|false,
      "underlined": true|false
    }

    You will receive:
    1. The full current list of TextBox blocks
    2. The ID of the block to regenerate
    3. A user instruction describing what should be changed

    Your task:
    - Return ONLY a new version of that specific TextBox, using the same ID and other formatting properties (unless the instruction says to change them)
    - Update the "content" field according to the instruction
    - You can consider the context (surrounding TextBoxes) to improve clarity or coherence
    - Preserve the language used in the other boxes

    Here is the list of current TextBoxes:

    ${JSON.stringify(allTextBoxes, null, 2)}

    Block ID to regenerate: ${targetId}

    User instruction: "${userInstruction}"

    Respond with only the updated TextBox as JSON, no markdown or extra text.
    `;
}

function regenerateAllPrompt(allTextBoxes, userInstruction) {

  return `
    You are a pedagogical assistant. You are working with a JSON-based editable layout system for educational exercises.

    Each block of the exercise is represented as a TextBox object with this structure:

    {
      "id": unique number (timestamp),
      "page": 1 (exercise) or 2 (solution),
      "position": { "x": <number>, "y": <number> }, 
      "w": <width>, 
      "h": <height>,
      "content": "<text content>", 
      "textSize": <font size between 12 and 24>,
      "textColor": "<color from other boxes palette or #000000>",
      "bold": true|false,
      "italic": true|false,
      "underlined": true|false
    }

    You will receive:
    1. The full current list of TextBox blocks
    2. A user instruction describing what should be changed

    Your task:
    - Return the full updated JSON with the changes according to the instructions, mantaining the same ID and other formatting properties (unless the instruction says to change them)
    - You can change every other object field in order to accomplish the instruction
    - Maintain clarity and coherence with respect to the original one
    - Preserve the language used in the text boxes
    - Change the solution text boxes content in order to fit and be coherent with the exercise changes, if any.

    Here is the list of current TextBoxes:

    ${JSON.stringify(allTextBoxes, null, 2)}

    User instruction: "${userInstruction}"

    Respond with only the updated TextBox as JSON, no markdown or extra text.
    `;
}

function regenerateSolutionPrompt(allTextBoxes) {

  return `
    You are a pedagogical assistant. You are working with a JSON-based editable layout system for educational exercises.

    Each block of the exercise is represented as a TextBox object with this structure:

    {
      "id": unique number (timestamp),
      "page": 1 (exercise) or 2 (solution),
      "position": { "x": <number>, "y": <number> }, //referenced to container 794x1123 px
      "w": <width>, 
      "h": <height>,
      "content": "<text content>", 
      "textSize": <font size between 12 and 24>,
      "textColor": "<color from other boxes palette or #000000>",
      "bold": true|false,
      "italic": true|false,
      "underlined": true|false
    }

    You will receive the full current list of TextBox blocks

    Your task:
    - Correct the content field of the solution textBoxes (page=2) in relation to the corresponding exercise textBoxes (page = 1), if any, mantaining the same ID and other formatting properties.
    - If a part of the solution is missing in relation to the exercise, create a new object with the solution mantaing the formatting of other solution text boxes and a new timestamp ID.
    - Correct, if needed, the position field of the solutions textBoxes in order to match the order of the exercises and to be placed at the start of the solution page.
    - Maintain clarity and coherence with the solution correction
    - Preserve the language used in the text boxes

    Here is the list of current TextBoxes:

    ${JSON.stringify(allTextBoxes, null, 2)}

    Respond with only the JSON array of updated TextBoxes and/or created ones, if there are not return only JSON empty array, no markdown or extra formatting.
    `;
}

function generateImagePrompt(instruction, palette){
  const formattedPalette = palette.filter(Boolean).join(", ");
  return `
  Create an educational illustration suitable for a primary or middle school exercise sheet.

  Instructional theme: ${instruction}.

  Design style: clean and simple, with visual clarity, friendly shapes, and no clutter.

  Use the following color palette as visual reference:
  Primary colors: ${formattedPalette}.

  Avoid photo-realism. Make the illustration child-friendly and visually coherent with the specified colors.
  Do not include text in the image. The layout should leave space around the subject so it can be embedded in an exercise layout.`;
}

function cleanJSON(rawText){
  return rawText
    .replace(/^```json\s*/i, '')  // rimuove ```json all'inizio
    .replace(/^```/, '')          // rimuove ``` semplice
    .replace(/```$/, '')          // rimuove ``` finale
    .trim();
};

export {extractionPrompt, generatePrompt, generateImagePrompt, regenerateElementPrompt, regenerateAllPrompt, regenerateSolutionPrompt, cleanJSON}