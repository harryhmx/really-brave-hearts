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

  // Normalize line endings: \r\n → \n
  const normalized = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  const separator = "\n\n...\n\n";
  if (!normalized.includes(separator)) {
    return null;
  }

  const parts = normalized.split(separator);
  const questionText = parts[0].trim();
  const choicesText = parts.slice(1).join("\n");

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
