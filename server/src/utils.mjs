// utils/generatePrompt.js
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
  } = formData;

  const palette = style[selectedStyle]?.palette.filter(Boolean) || ["#000000"];
  const dislexia = dislexiaInclusive
    ? "Use font size between 18-24, increase spacing, and keep layout simple and accessible."
    : "";
  
  const formattedGoals = goals.join(", ") || "Not specified";
  const formattedPre = prerequisites.join(", ") || "Not specified";

  return `
    You are an expert educational content creator for ${school} school, grade ${grade}.
    Create a ${exercise_level} level exercise based on the following goals and prerequisites:

    Goals: ${formattedGoals}
    Prerequisites: ${formattedPre}
    Vocabulary style: ${vocabulary}
    Number of questions: ${n_questions}

    Original text to take inspiration from:
    """${exercisetext || "N/A"}"""

    Be aware:
    - The exercise must be inspired by the original text, but it must NOT copy its content. 
    - You can use the same terminology or typology of the given exercise text

    Style guide:
    - Use the following color palette for text color selection: ${palette.join(", ")}.
    - The language of the output must always match the language of the input text. For example, if the input is in Italian, the entire output (title, instructions, questions, etc.) must also be in Italian.
    ${reminder ? "- Include a useful reminder or note at the end of the exercise concerning the pre-prequisites." : ""}
    ${example ? "- Include a worked-out example before the actual questions." : ""}
    ${dislexia}

    Structure requirement:
    1. The first TextBox object must always be a title of the exercise.
    2. The second TextBox must always be a clear instruction of what the student has to do.
    3. Then continue with the content blocks of the exercise.
    4. The solution will be displayed in another page, so the position for solution text boxes have to be resetted.
    5. The solution text boxes has to contain all the procedures.

    Return your result ONLY as a JSON array of objects, each object must have this structure:

    {
      "id": unique number (timestamp),
      "page": 1 (exercise) or 2 (solution), //1 text box belogs to the exercise, 2 belongs to the solution
      "position": { "x": <number>, "y": <number> }, // css position relative to the container, takes as a reference a container 794x1123 px
      "w": <width>, 
      "h": <height>,
      "content": "<text content>", 
      "textSize": <font size between 12 and 24>,
      "textColor": "<color from palette or #000000>",
      "bold": true|false,
      "italic": true|false,
      "underlined": true|false
    }

    Respond ONLY with the JSON array, no commentary, no formatting.
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
    3. A user instruction describing what should be changed

    Your task:
    - Return the full updated JSON with the changes according to the instructions, mantaining the same ID for each object
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

export {generatePrompt, generateImagePrompt, regenerateElementPrompt, regenerateAllPrompt, cleanJSON}