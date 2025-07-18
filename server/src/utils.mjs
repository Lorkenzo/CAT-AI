// utils/generatePrompt.js
function generatePrompt(formData, text) {
  
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
  
  const additionalWarning = text? `The generated exercise must follow this specification: ${text}` : ""

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
    - You can use the same terminology or exercise type of the exercise text
    ${additionalWarning}

    Style guide:
    - Use the following color palette for text color selection: ${palette.join(", ")}.
    - The language of the output must always match the language of the input text. For example, if the input is in Italian, the entire output (title, instructions, questions, etc.) must also be in Italian.
    ${reminder ? "- Include a useful reminder or note at the end of the exercise." : ""}
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

function cleanJSON(rawText){
  return rawText
    .replace(/^```json\s*/i, '')  // rimuove ```json all'inizio
    .replace(/^```/, '')          // rimuove ``` semplice
    .replace(/```$/, '')          // rimuove ``` finale
    .trim();
};

export {generatePrompt, cleanJSON}