class StorageManager {
    constructor() {
        this.NOTES_KEY = 'notes_app_data';
        this.initializeStorage();
    }

    initializeStorage() {
        if (!localStorage.getItem(this.NOTES_KEY)) {
            localStorage.setItem(this.NOTES_KEY, JSON.stringify([]));
        }
    }

    getNotes() {
        try {
            return JSON.parse(localStorage.getItem(this.NOTES_KEY)) || [];
        } catch (error) {
            console.error('Error reading notes:', error);
            return [];
        }
    }

    getNote(id) {
        const notes = this.getNotes();
        return notes.find(note => note.id === id);
    }

    saveNote(note) {
        try {
            const notes = this.getNotes();
            const index = notes.findIndex(n => n.id === note.id);

            if (index === -1) {
                // New note
                notes.push({
                    ...note,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
            } else {
                // Update existing note
                notes[index] = {
                    ...notes[index],
                    ...note,
                    updatedAt: new Date().toISOString()
                };
            }

            localStorage.setItem(this.NOTES_KEY, JSON.stringify(notes));
            this.updateReminders();
            return true;
        } catch (error) {
            console.error('Error saving note:', error);
            return false;
        }
    }

    deleteNote(id) {
        try {
            const notes = this.getNotes();
            const filteredNotes = notes.filter(note => note.id !== id);
            localStorage.setItem(this.NOTES_KEY, JSON.stringify(filteredNotes));
            this.updateReminders();
            return true;
        } catch (error) {
            console.error('Error deleting note:', error);
            return false;
        }
    }

    clearNotes() {
        localStorage.setItem(this.NOTES_KEY, JSON.stringify([]));
        this.updateReminders();
    }

    updateReminders() {
        const notes = this.getNotes();
        
        // Clear all existing reminders
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                type: 'CLEAR_REMINDERS'
            });
        }

        // Set new reminders
        notes.forEach(note => {
            if (note.reminder) {
                const reminderTime = new Date(note.reminder).getTime();
                if (reminderTime > Date.now()) {
                    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                        navigator.serviceWorker.controller.postMessage({
                            type: 'SET_REMINDER',
                            reminder: {
                                id: note.id,
                                title: note.title,
                                time: reminderTime
                            }
                        });
                    }
                }
            }
        });
    }
}
