/**
 * Recursively sanitizes an object to prevent NoSQL injection
 * Replaces $ and . characters with _
 */
export function sanitizeObject(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return obj.replace(/\$/g, '_');
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item));
  }

  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const key of Object.keys(obj)) {
      const sanitizedKey = key.replace(/\$/g, '_').replace(/\./g, '_');
      sanitized[sanitizedKey] = sanitizeObject(obj[key]);
    }
    return sanitized;
  }

  return obj;
}

export default sanitizeObject;
