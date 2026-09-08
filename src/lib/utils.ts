export const safeParseJsonArray = <T = string>(jsonStr: string | null | undefined): T[] => {
  if (!jsonStr) return [];
  const trimmed = jsonStr.trim();
  if (!trimmed || trimmed === '[]') return [];

  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return parsed as T[];

    if (typeof parsed === 'string') {
      const inner = JSON.parse(parsed.trim());
      if (Array.isArray(inner)) return inner as T[];
    }
  } catch {
    try {
      const unescaped = trimmed.replace(/\\"/g, '"');
      const parsed: unknown = JSON.parse(unescaped);
      if (Array.isArray(parsed)) return parsed as T[];
    } catch {
      // 容错返回空数组
    }
  }

  return [];
};
