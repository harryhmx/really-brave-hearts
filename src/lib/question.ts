export interface Choice {
  value: string;
  label: string;
}

export interface ParsedQuestion {
  question: string;
  choices: Choice[];
}

export function parseQuestion(content: string | null | undefined): ParsedQuestion | null {
  if (!content) return null;

  let questionText: string;
  let choicesText: string;

  if (content.includes("\n\n...\n\n")) {
    const parts = content.split("\n\n...\n\n");
    questionText = parts[0].trim();
    choicesText = parts.slice(1).join("\n");
  } else {
    return null;
  }

  const choices: Choice[] = choicesText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.includes("|"))
    .map((line) => {
      const [value, ...rest] = line.split("|");
      return {
        value: value.trim(),
        label: rest.join("|").trim(),
      };
    });

  if (choices.length === 0) return null;

  return { question: questionText, choices };
}
