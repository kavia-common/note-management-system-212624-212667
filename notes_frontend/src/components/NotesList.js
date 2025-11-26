import React, { useState, useEffect, useMemo } from 'react';

/**
 * Sidebar list of notes with search capability.
 * PUBLIC_INTERFACE
 */
export default function NotesList({
  notes,
  selectedId,
  onSelect,
  onCreate,
  onSearchChange,
  loading,
  error,
  initialSearch = '',
}) {
  /** Renders the list of notes, a search input, and create button. */
  const [query, setQuery] = useState(initialSearch);

  useEffect(() => {
    setQuery(initialSearch);
  }, [initialSearch]);

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);
    onSearchChange && onSearchChange(val);
  };

  const sortedNotes = useMemo(() => {
    // pinned first, then updated_at or title
    const copy = [...(notes || [])];
    copy.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      // fallback to updated_at desc if present
      if (a.updated_at && b.updated_at) {
        return new Date(b.updated_at) - new Date(a.updated_at);
      }
      return (a.title || '').localeCompare(b.title || '');
    });
    return copy;
  }, [notes]);

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <input
          value={query}
          onChange={handleSearch}
          placeholder="Search notes..."
          aria-label="Search notes"
          className="input input--search"
          disabled={loading}
        />
        <button
          className="btn btn-primary"
          onClick={onCreate}
          disabled={loading}
          aria-label="Create new note"
        >
          + New
        </button>
      </div>

      {loading && (
        <div className="status status--loading">Loading notes...</div>
      )}
      {error && !loading && (
        <div className="status status--error" role="alert">{String(error)}</div>
      )}

      <ul className="notes-list" role="list">
        {sortedNotes.map((n) => (
          <li key={n.id}>
            <button
              className={`notes-list__item ${selectedId === n.id ? 'is-active' : ''}`}
              onClick={() => onSelect(n.id)}
              title={n.title || 'Untitled'}
            >
              <div className="notes-list__title">
                {n.pinned && <span className="pin" aria-label="Pinned">📌</span>}
                {n.title || 'Untitled'}
              </div>
              {n.updated_at && (
                <div className="notes-list__meta">
                  {new Date(n.updated_at).toLocaleString()}
                </div>
              )}
            </button>
          </li>
        ))}
        {!loading && !error && sortedNotes.length === 0 && (
          <li className="notes-list__empty">No notes yet. Create one!</li>
        )}
      </ul>
    </aside>
  );
}
