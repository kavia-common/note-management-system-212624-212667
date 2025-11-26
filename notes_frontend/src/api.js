import { API_BASE_URL } from './config';

/**
 * Lightweight fetch wrapper to handle JSON and errors.
 */
async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const resp = await fetch(url, { ...options, headers });
  let data = null;
  const contentType = resp.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await resp.json();
  } else {
    data = await resp.text().catch(() => null);
  }

  if (!resp.ok) {
    const message = data && data.detail ? data.detail : (typeof data === 'string' && data) || 'Request failed';
    const error = new Error(message);
    error.status = resp.status;
    error.data = data;
    throw error;
  }
  return data;
}

// PUBLIC_INTERFACE
export async function listNotes(search = '') {
  /** List notes optionally filtered by a search query on title/content. */
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  return request(`/notes${query}`, { method: 'GET' });
}

// PUBLIC_INTERFACE
export async function getNote(id) {
  /** Get a single note by id. */
  return request(`/notes/${encodeURIComponent(id)}`, { method: 'GET' });
}

// PUBLIC_INTERFACE
export async function createNote(note) {
  /** Create a new note. note: { title, content, pinned } */
  return request('/notes', {
    method: 'POST',
    body: JSON.stringify(note),
  });
}

// PUBLIC_INTERFACE
export async function updateNote(id, note) {
  /** Update an existing note by id. note: { title, content, pinned } */
  return request(`/notes/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(note),
  });
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  /** Delete a note by id. */
  return request(`/notes/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
