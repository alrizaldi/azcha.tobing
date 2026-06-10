export const VALID_PHOTO_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
export const VALID_PHOTO_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp'
];

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes
export const MAX_UPLOAD_BATCH_SIZE = 20; // Max files per batch upload

export const PROJECT_STATUSES = [
  'planning',
  'in-progress',
  'completed',
  'on-hold'
] as const;

export const PHOTO_CATEGORIES = [
  'landscape',
  'portrait',
  'wedding',
  'street',
  'nature',
  'fashion',
  'commercial',
  'event',
  'product',
  'other'
] as const;

export const DEFAULT_PAGINATION_LIMIT = 20;
export const MAX_PAGINATION_LIMIT = 100;