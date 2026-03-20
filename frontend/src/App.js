import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = 'http://localhost:5000/api/notes';

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString();
}

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [folder, setFolder] = useState('General');
  const [imageFile, setImageFile] = useState(null);
  const [attachment, setAttachment] = useState(null);
  const [filterFolder, setFilterFolder] = useState('All');
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState('');

  const folders = useMemo(() => {
    const set = new Set(notes.map(n => n.folder || 'General'));
    return ['All', ...Array.from(set).sort()];
  }, [notes]);

  const loadNotes = () => {
    const params = filterFolder !== 'All' ? { folder: filterFolder } : {};
    axios.get(API_BASE, { params })
      .then(res => setNotes(res.data))
      .catch(() => setStatus('Failed to load notes.'));
  };

  useEffect(() => {
    loadNotes();
  }, [filterFolder]);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setFolder('General');
    setImageFile(null);
    setAttachment(null);
    setEditingId(null);
    setStatus('');
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setStatus('Title is required');
      return;
    }

    setStatus('Saving...');

    const isMultipart = imageFile || attachment;
    const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;
    const method = editingId ? 'put' : 'post';

    try {
      let res;
      if (isMultipart) {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('folder', folder);
        if (imageFile) formData.append('images', imageFile);
        if (attachment) formData.append('files', attachment);

        res = await axios({
          method,
          url,
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await axios[method](url, { title, content, folder });
      }

      if (editingId) {
        setNotes(notes.map(n => (n._id === editingId ? res.data : n)));
      } else {
        setNotes([res.data, ...notes]);
      }

      resetForm();
      setStatus('Saved successfully!');
    } catch (err) {
      console.error(err);
      setStatus('Save failed.');
    }
  };

  const startEdit = (note) => {
    setEditingId(note._id);
    setTitle(note.title || '');
    setContent(note.content || '');
    setFolder(note.folder || 'General');
    setImageFile(null);
    setAttachment(null);
    setStatus('Editing note. Choose any new file to replace attachments.');
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API_BASE}/${id}`);
      setNotes(notes.filter(n => n._id !== id));
      setStatus('Deleted.');
    } catch {
      setStatus('Delete failed.');
    }
  };

  const displayedNotes = useMemo(() => {
    if (filterFolder === 'All') return notes;
    return notes.filter(n => (n.folder || 'General') === filterFolder);
  }, [notes, filterFolder]);

  return (
    <div className="app">
      <header className="toolbar">
        <h1>Notes &amp; Files</h1>
        <div className="folder-filter">
          <label>
            Folder:
            <select value={filterFolder} onChange={e => setFilterFolder(e.target.value)}>
              {folders.map(folderName => (
                <option key={folderName} value={folderName}>{folderName}</option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <section className="layout">
        <aside className="panel">
          <h2>{editingId ? 'Edit note' : 'New note'}</h2>

          <label>
            Title
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="A short title" />
          </label>

          <label>
            Folder
            <input value={folder} onChange={e => setFolder(e.target.value)} placeholder="e.g. Work, Personal" />
          </label>

          <label>
            Content
            <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write something..." />
          </label>

          <label>
            Image (optional)
            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0] || null)} />
          </label>

          <label>
            Attachment (optional)
            <input type="file" onChange={e => setAttachment(e.target.files[0] || null)} />
          </label>

          <div className="actions">
            <button onClick={handleSubmit} className="primary">
              {editingId ? 'Update note' : 'Add note'}
            </button>
            <button onClick={resetForm} className="secondary">
              Reset
            </button>
          </div>

          {status && <div className="status">{status}</div>}
        </aside>

        <main className="notes">
          {displayedNotes.length === 0 && <div className="empty">No notes yet. Start by adding one.</div>}

          {displayedNotes.map(note => (
            <article key={note._id} className="note-card">
              <header>
                <div>
                  <h3>{note.title}</h3>
                  <div className="meta">
                    <span className="badge">{note.folder || 'General'}</span>
                    <span title="Created">Created: {formatDate(note.createdAt)}</span>
                    <span title="Last updated">Updated: {formatDate(note.updatedAt)}</span>
                  </div>
                </div>
                <div className="card-actions">
                  <button onClick={() => startEdit(note)}></button>
                  <button onClick={() => deleteNote(note._id)}></button>
                </div>
              </header>
              <p className="content">{note.content}</p>

              {note.images && note.images.length > 0 && (
                <div className="attachments">
                  {note.images.map((img, idx) => (
                    <div key={idx} className="attachment">
                      <img src={img.url} alt={img.filename} />
                      <div className="attachment-label">{img.filename}</div>
                    </div>
                  ))}
                </div>
              )}

              {note.files && note.files.length > 0 && (
                <div className="files">
                  {note.files.map((file, idx) => (
                    <a key={idx} className="file-link" href={file.url} target="_blank" rel="noreferrer">
                       {file.filename}
                    </a>
                  ))}
                </div>
              )}
            </article>
          ))}
        </main>
      </section>

      <footer className="footer">
        <span>Powered by MEARNNotes</span>
      </footer>
    </div>
  );
}

export default App;
