import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './App.css';
import './index.css';
import NavBar from './components/NavBar';
import NotesList from './components/NotesList';
import NoteEditor from './components/NoteEditor';
import { listNotes, getNote, createNote, updateNote, deleteNote } from './api';

// Data shape expectation:
// Note: { id, title, content, pinned, created_at?, updated_at? }

// PUBLIC_INTERFACE
function App() {
  /** Main Notes application component orchestrating list, selection, and editor. */
  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [activeNote, setActiveNote] = useState(null);

  const [search, setSearch] = useState('');
  const [loadingList, setLoadingList] = useState(false);
  const [loadingNote, setLoadingNote] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [listError, setListError] = useState(null);
  const [noteError, setNoteError] = useState(null);

  const fetchList = useCallback(async (q = '') => {
    setLoadingList(true);
    setListError(null);
    try {
      const data = await listNotes(q);
      setNotes(Array.isArray(data) ? data : []);
    } catch (e) {
      setListError(e?.message || 'Failed to load notes');
    } finally {
      setLoadingList(false);
    }
  }, []);

  const fetchNote = useCallback(async (id) => {
    if (!id) {
      setActiveNote(null);
      return;
    }
    setLoadingNote(true);
    setNoteError(null);
    try {
      const data = await getNote(id);
      setActiveNote(data);
    } catch (e) {
      setNoteError(e?.message || 'Failed to load note');
      setActiveNote(null);
    } finally {
      setLoadingNote(false);
    }
  }, []);

  useEffect(() => {
    fetchList(search);
  }, [fetchList, search]);

  useEffect(() => {
    if (selectedId) fetchNote(selectedId);
    else setActiveNote(null);
  }, [selectedId, fetchNote]);

  const handleSelect = (id) => {
    setSelectedId(id);
  };

  const handleCreate = async () => {
    // Optimistic placeholder
    setSaving(true);
    try {
      const draft = { title: 'Untitled note', content: '', pinned: false };
      const created = await createNote(draft);
      // refresh list and select created
      await fetchList(search);
      setSelectedId(created?.id);
    } catch (e) {
      alert(e?.message || 'Failed to create note');
    } finally {
      setSaving(false);
    }
  };

  const handleSearch = (q) => {
    setSearch(q);
    // selected might become invalid; keep selection if still present
  };

  const handleEditorChange = (updated) => {
    setActiveNote(prev => prev ? { ...prev, ...updated } : prev);
  };

  const handleSave = async (updated) => {
    if (!activeNote) return;
    setSaving(true);
    setNoteError(null);
    try {
      const payload = {
        title: updated.title ?? activeNote.title ?? '',
        content: updated.content ?? activeNote.content ?? '',
        pinned: !!updated.pinned,
      };
      await updateNote(activeNote.id, payload);
      await fetchList(search);
      await fetchNote(activeNote.id);
    } catch (e) {
      setNoteError(e?.message || 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!activeNote) return;
    const confirmMsg = `Delete note "${activeNote.title || 'Untitled'}"? This cannot be undone.`;
    if (!window.confirm(confirmMsg)) return;
    setDeleting(true);
    setNoteError(null);
    try {
      await deleteNote(activeNote.id);
      await fetchList(search);
      // adjust selection
      setSelectedId(null);
      setActiveNote(null);
    } catch (e) {
      setNoteError(e?.message || 'Failed to delete note');
    } finally {
      setDeleting(false);
    }
  };

  const selectedNote = useMemo(
    () => notes.find((n) => n.id === selectedId) || null,
    [notes, selectedId]
  );

  return (
    <div className="app-root">
      <NavBar />
      <main className="layout">
        <NotesList
          notes={notes}
          selectedId={selectedId}
          onSelect={handleSelect}
          onCreate={handleCreate}
          onSearchChange={handleSearch}
          loading={loadingList}
          error={listError}
          initialSearch={search}
        />
        <div className="content">
          {loadingNote && (
            <div className="status status--loading">Loading note...</div>
          )}
          {!loadingNote && (
            <NoteEditor
              note={activeNote}
              onChange={handleEditorChange}
              onSave={handleSave}
              onDelete={handleDelete}
              saving={saving}
              deleting={deleting}
              error={noteError}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
