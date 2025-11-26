import React, { useEffect, useState } from 'react';

/**
 * Editor for a single note: title, content, pinned toggle.
 * PUBLIC_INTERFACE
 */
export default function NoteEditor({
  note,
  onChange,
  onSave,
  onDelete,
  saving,
  deleting,
  error,
}) {
  /** Renders the main editor/viewer area. */
  const [local, setLocal] = useState({
    title: '',
    content: '',
    pinned: false,
  });

  useEffect(() => {
    setLocal({
      title: note?.title || '',
      content: note?.content || '',
      pinned: !!note?.pinned,
    });
  }, [note]);

  const handleChange = (field, value) => {
    const updated = { ...local, [field]: value };
    setLocal(updated);
    onChange && onChange(updated);
  };

  const isDirty =
    (note?.title || '') !== local.title ||
    (note?.content || '') !== local.content ||
    !!note?.pinned !== !!local.pinned;

  const canSave = local.title.trim().length > 0 || local.content.trim().length > 0;

  return (
    <section className="editor">
      {!note && (
        <div className="empty-state">
          <h2>Welcome to Ocean Notes</h2>
          <p>Select a note from the left, or create a new one to get started.</p>
        </div>
      )}

      {note && (
        <>
          <div className="editor__toolbar">
            <div className="editor__controls">
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={local.pinned}
                  onChange={(e) => handleChange('pinned', e.target.checked)}
                />
                <span>Pin</span>
              </label>
            </div>
            <div className="editor__actions">
              <button
                className="btn btn-danger btn-ghost"
                onClick={onDelete}
                disabled={deleting}
                aria-label="Delete note"
                title="Delete note"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                className="btn btn-primary"
                onClick={() => onSave(local)}
                disabled={saving || !canSave || !isDirty}
                aria-label="Save note"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>

          {error && (
            <div className="status status--error" role="alert">
              {String(error)}
            </div>
          )}

          <div className="editor__form">
            <input
              className="input input--title"
              placeholder="Title"
              value={local.title}
              onChange={(e) => handleChange('title', e.target.value)}
            />
            <textarea
              className="textarea"
              placeholder="Write your note..."
              value={local.content}
              onChange={(e) => handleChange('content', e.target.value)}
              rows={16}
            />
          </div>
        </>
      )}
    </section>
  );
}
