class NotesManager {
    constructor() {
        this.storage = new StorageManager();
        this.bindEvents();
        this.loadNotes();
    }

    bindEvents() {
        const searchInput = document.getElementById('searchInput');
        const sortSelect = document.getElementById('sortSelect');

        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterNotes());
        }

        if (sortSelect) {
            sortSelect.addEventListener('change', () => this.sortNotes());
        }
    }

    loadNotes() {
        const notes = this.storage.getNotes();
        const pinnedNotes = notes.filter(note => note.pinned);
        const unpinnedNotes = notes.filter(note => !note.pinned);

        this.renderNotes(pinnedNotes, 'pinnedNotes');
        this.renderNotes(unpinnedNotes, 'allNotes');
    }

    renderNotes(notes, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = notes.length ? '' : '<p class="text-muted">No notes found</p>';

        notes.forEach(note => {
            const noteCard = this.createNoteCard(note);
            container.appendChild(noteCard);
        });
    }

    createNoteCard(note) {
        const div = document.createElement('div');
        div.className = 'col-md-4 mb-3';
        div.innerHTML = `
            <div class="card h-100 ${note.pinned ? 'pinned' : ''}" data-note-id="${note.id}">
                <div class="card-body">
                    ${note.pinned ? '<span class="pin-badge badge bg-primary">📌</span>' : ''}
                    <h5 class="card-title">${this.escapeHtml(note.title)}</h5>
                    <p class="card-text text-truncate-2">${this.escapeHtml(note.content)}</p>
                    ${note.image ? `<img src="${note.image}" class="img-fluid mb-2 rounded" alt="Note image">` : ''}
                    ${note.reminder ? `<small class="text-muted">🔔 ${new Date(note.reminder).toLocaleString()}</small>` : ''}
                </div>
                <div class="card-footer bg-transparent">
                    <div class="btn-group w-100">
                        <button class="btn btn-outline-primary btn-sm edit-note">
                            <i data-feather="edit-2"></i>
                        </button>
                        <button class="btn btn-outline-primary btn-sm toggle-pin">
                            <i data-feather="map-pin"></i>
                        </button>
                        <button class="btn btn-outline-danger btn-sm delete-note">
                            <i data-feather="trash-2"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners
        const card = div.querySelector('.card');
        card.addEventListener('click', (e) => this.handleNoteClick(e, note));

        return div;
    }

    handleNoteClick(e, note) {
        const target = e.target.closest('button');
        if (!target) return;

        e.stopPropagation();

        if (target.classList.contains('edit-note')) {
            window.location.href = `editor.html?id=${note.id}`;
        } else if (target.classList.contains('toggle-pin')) {
            this.togglePin(note);
        } else if (target.classList.contains('delete-note')) {
            this.deleteNote(note);
        }
    }

    togglePin(note) {
        note.pinned = !note.pinned;
        this.storage.updateNote(note);
        this.loadNotes();
    }

    deleteNote(note) {
        if (confirm('Are you sure you want to delete this note?')) {
            this.storage.deleteNote(note.id);
            this.loadNotes();
        }
    }

    filterNotes() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const notes = this.storage.getNotes();

        const filteredNotes = notes.filter(note =>
            note.title.toLowerCase().includes(searchTerm) ||
            note.content.toLowerCase().includes(searchTerm)
        );

        const pinnedNotes = filteredNotes.filter(note => note.pinned);
        const unpinnedNotes = filteredNotes.filter(note => !note.pinned);

        this.renderNotes(pinnedNotes, 'pinnedNotes');
        this.renderNotes(unpinnedNotes, 'allNotes');
    }

    sortNotes() {
        const sortBy = document.getElementById('sortSelect').value;
        const notes = this.storage.getNotes();

        notes.sort((a, b) => {
            switch (sortBy) {
                case 'date-desc':
                    return new Date(b.updatedAt) - new Date(a.updatedAt);
                case 'date-asc':
                    return new Date(a.updatedAt) - new Date(b.updatedAt);
                case 'title':
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });

        const pinnedNotes = notes.filter(note => note.pinned);
        const unpinnedNotes = notes.filter(note => !note.pinned);

        this.renderNotes(pinnedNotes, 'pinnedNotes');
        this.renderNotes(unpinnedNotes, 'allNotes');
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Initialize Notes Manager
document.addEventListener('DOMContentLoaded', () => {
    const notesManager = new NotesManager();
    // Re-render Feather icons after dynamic content
    feather.replace();
});