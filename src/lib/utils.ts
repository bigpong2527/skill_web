
export const safeParseJsonArray = (jsonStr: string | null | undefined): string[] => {
  if (!jsonStr) return [];
  const trimmed = jsonStr.trim();
  if (trimmed === '[]') return [];

  try {
    // Attempt 1: Direct Parse
    const parsed = JSON.parse(trimmed);

    if (Array.isArray(parsed)) {
      return parsed;
    }

    // Attempt 2: If parsed is a string (double encoded or string representation)
    if (typeof parsed === 'string') {
        const innerTrimmed = parsed.trim();
        
        // Try to parse the inner string
        try {
            const innerParsed = JSON.parse(innerTrimmed);
            if (Array.isArray(innerParsed)) return innerParsed;
        } catch (e) {
            // If inner parse failed, check for escaped quotes pattern inside the string
            // e.g. parsed string is: [\"a\", \"b\"]
            try {
                const unescaped = innerTrimmed.replace(/\\"/g, '"');
                const innerParsedFixed = JSON.parse(unescaped);
                if (Array.isArray(innerParsedFixed)) return innerParsedFixed;
            } catch (e2) {
                // ignore
            }
        }
    }
    
    return [];
  } catch (e) {
    // Attempt 3: If initial parse failed, handle raw escaped string: [\"a\", \"b\"]
    try {
        const unescaped = trimmed.replace(/\\"/g, '"');
        const parsed = JSON.parse(unescaped);
        if (Array.isArray(parsed)) return parsed;
    } catch (e2) {
        // ignore
    }
    
    return [];
  }
};
