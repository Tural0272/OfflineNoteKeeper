class NoteEditor {
    constructor() {
        this.storage = new StorageManager();
        this.camera = new CameraManager();
        this.speech = new SpeechManager();
        
        this.noteId = new URLSearchParams(window.location.search).get('id');
        this.note = this.noteId ? this.storage.getNote(this.noteId) : null;
        
        this.bindElements();
        this.bindEvents();
        this.loadNote();
    }

    bindElements() {
        this.form = document.getElementById('noteForm');
        this.titleInput = document.getElementById('noteTitle');
        this.contentInput = document.getElementById('noteContent');
        this.pinCheckbox = document.getElementById('pinNote');
        this.reminderInput = document.getElementById('reminderTime');
        this.cameraBtn = document.getElementById('cameraBtn');
        this.voiceBtn = document.getElementById('voiceBtn');
        this.mediaPreview = document.getElementById('mediaPreview');
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.cameraBtn.addEventListener('click', () => this.handleCamera());
        this.voiceBtn.addEventListener('click', () => this.handleVoice());
        
        // Handle reminder notifications
        if ('Notification' in window) {
            Notification.requestPermission();
        }
    }

    loadNote() {
        if (this.note) {
            this.titleInput.value = this.note.title;
            this.contentInput.value = this.note.content;
            this.pinCheckbox.checked = this.note.pinned;
            
            if (this.note.reminder) {
                const reminderDate = new Date(this.note.reminder);
                this.reminderInput.value = reminderDate.toISOString().slice(0, 16);
            }

            if (this.note.image) {
                this.showImagePreview(this.note.image);
            }
        }
    }

    async handleCamera() {
        try {
            const image = await this.camera.takePhoto();
            this.showImagePreview(image);
        } catch (error) {
            console.error('Camera error:', error);
            alert('Failed to access camera. Please check permissions.');
        }
    }

    async handleVoice() {
        try {
            this.voiceBtn.innerHTML = '<i data-feather="mic"></i> Recording...';
            this.voiceBtn.classList.add('recording-indicator');
            
            const text = await this.speech.startRecording();
            this.contentInput.value += (this.contentInput.value ? '\n' : '') + text;
            
            this.voiceBtn.innerHTML = '<i data-feather="mic"></i> Voice Note';
            this.voiceBtn.classList.remove('recording-indicator');
            feather.replace();
        } catch (error) {
            console.error('Speech recognition error:', error);
            alert('Failed to start voice recording. Please check permissions.');
            this.voiceBtn.innerHTML = '<i data-feather="mic"></i> Voice Note';
            this.voiceBtn.classList.remove('recording-indicator');
            feather.replace();
        }
    }

    showImagePreview(imageData) {
        this.mediaPreview.classList.remove('d-none');
        this.mediaPreview.innerHTML = `
            <img src="${imageData}" class="img-fluid rounded" alt="Note image">
            <button type="button" class="btn btn-sm btn-danger mt-2" onclick="this.parentElement.innerHTML = ''">
                Remove Image
            </button>
        `;
    }

    handleSubmit(e) {
        e.preventDefault();

        const note = {
            id: this.noteId || Date.now().toString(),
            title: this.titleInput.value.trim(),
            content: this.contentInput.value.trim(),
            pinned: this.pinCheckbox.checked,
            updatedAt: new Date().toISOString(),
            reminder: this.reminderInput.value || null
        };

        // Get image if exists
        const previewImage = this.mediaPreview.querySelector('img');
        if (previewImage) {
            note.image = previewImage.src;
        }

        if (!note.title || !note.content) {
            alert('Please fill in both title and content');
            return;
        }

        this.storage.saveNote(note);

        // Set reminder if specified
        if (note.reminder) {
            this.setReminder(note);
        }

        window.location.href = '/';
    }

    setReminder(note) {
        const reminderTime = new Date(note.reminder).getTime();
        const now = new Date().getTime();
        
        if (reminderTime > now) {
            const delay = reminderTime - now;
            
            setTimeout(() => {
                if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification('Note Reminder', {
                        body: note.title,
                        icon: '/icon-192x192.png'
                    });
                }
            }, delay);
        }
    }
}

// Initialize Editor
document.addEventListener('DOMContentLoaded', () => {
    const editor = new NoteEditor();
    feather.replace();
});
