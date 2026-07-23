export interface ParsedTitle {
  title: string;
  blinded_pdf_url?: string;
  full_pdf_url?: string;
}

/**
 * Safely parses the submission title column. 
 * If it's a JSON string, extracts title and URLs. 
 * If it's a raw string, returns it as the title.
 */
export function parseTitle(rawTitle: string | undefined | null): ParsedTitle {
  if (!rawTitle) {
    return { title: 'Untitled' };
  }
  
  try {
    const parsed = JSON.parse(rawTitle);
    if (parsed && typeof parsed === 'object') {
      return {
        title: parsed.title || 'Untitled',
        blinded_pdf_url: parsed.blinded_pdf_url,
        full_pdf_url: parsed.full_pdf_url,
      };
    }
  } catch (e) {
    // Not a JSON string, fallback to treating the whole string as the title
  }
  
  return { title: rawTitle };
}
