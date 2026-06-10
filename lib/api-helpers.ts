export function createResponse(data: any, statusCode: number = 200) {
  return new Response(JSON.stringify(data), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function createErrorResponse(message: string, statusCode: number = 400) {
  return createResponse({ error: message }, statusCode);
}

export function validateRequestBody(requiredFields: string[], body: any) {
  for (const field of requiredFields) {
    if (!body[field]) {
      return { valid: false, error: `${field} is required` };
    }
  }
  return { valid: true };
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
    .replace(/\-\-+/g, '-');    // Replace multiple - with single -
}