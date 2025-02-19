class SettingsManager {
    constructor() {
        this.storage = new StorageManager();
        this.bindElements();
        this.bindEvents();
        this.loadSettings();
    }

    bindElements() {
        this.darkModeToggle = document.getElementById('darkModeToggle');
        this.exportBtn = document.getElementById('exportBtn');
        this.importBtn = document.getElementById('importBtn');
        this.importFile = document.getElementById('importFile');
        this.clearDataBtn = document.getElementById('clearDataBtn');
    }

    bindEvents() {
        this.darkModeToggle.addEventListener('change', () => this.toggleDarkMode());
        this.exportBtn.addEventListener('click', () => this.exportData());
        this.importBtn.addEventListener('click', () => this.importFile.click());
        this.importFile.addEventListener('change', (e) => this.importData(e));
        this.clearDataBtn.addEventListener('click', () => this.clearData());
    }

    loadSettings() {
        // Load dark mode setting
        const darkMode = localStorage.getItem('darkMode') === 'true';
        this.darkModeToggle.checked = darkMode;
        if (darkMode) {
            document.body.classList.add('dark-mode');
        }
    }

    toggleDarkMode() {
        const isDarkMode = this.darkModeToggle.checked;
        localStorage.setItem('darkMode', isDarkMode);
        document.body.classList.toggle('dark-mode', isDarkMode);
    }

    exportData() {
        const notes = this.storage.getNotes();
        const settings = {
            darkMode: localStorage.getItem('darkMode') === 'true'
        };

        const exportData = {
            notes: notes,
            settings: settings,
            version: '1.0.0',
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileName = `notes_backup_${new Date().toISOString().slice(0,10)}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileName);
        linkElement.click();
    }

    async importData(event) {
        try {
            const file = event.target.files[0];
            if (!file) return;

            const text = await file.text();
            const data = JSON.parse(text);

            // Validate import data
            if (!data.notes || !Array.isArray(data.notes)) {
                throw new Error('Invalid import file format');
            }

            // Confirm import
            if (confirm(`Import ${data.notes.length} notes? This will override existing notes.`)) {
                // Import notes
                this.storage.clearNotes();
                data.notes.forEach(note => this.storage.saveNote(note));

                // Import settings
                if (data.settings) {
                    localStorage.setItem('darkMode', data.settings.darkMode);
                    this.loadSettings();
                }

                alert('Data imported successfully!');
                window.location.reload();
            }
        } catch (error) {
            console.error('Import error:', error);
            alert('Error importing data. Please check the file format.');
        }
        
        // Clear the input
        event.target.value = '';
    }

    clearData() {
        if (confirm('Are you sure you want to clear all data? This cannot be undone!')) {
            // Clear notes
            this.storage.clearNotes();

            // Clear settings
            localStorage.clear();

            // Reset dark mode
            document.body.classList.remove('dark-mode');
            this.darkModeToggle.checked = false;

            alert('All data has been cleared.');
            window.location.reload();
        }
    }
}

// Initialize Settings
document.addEventListener('DOMContentLoaded', () => {
    const settings = new SettingsManager();
    feather.replace();
});
