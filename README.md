
# Offline Note Keeper PWA

A feature-rich Progressive Web Application for creating and managing notes with offline support.

## Running the Project

1. Open the project in Replit
2. Click the "Run" button to start the HTTP server
3. Access the application through the provided URL in the webview

## Features

### Core Functionality
- Create, edit, and delete notes
- Pin important notes to the top
- Dark mode support
- Export and import notes
- Responsive design for all device sizes

### Advanced Features
- 📸 Camera integration for photo attachments
- 🎤 Voice-to-text note creation
- 🔔 Note reminders
- 📱 Offline functionality
- 💾 Installable as a PWA

### Views
1. Home View (index.html)
   - List of all notes
   - Quick actions for notes
   - Search and filter functionality

2. Editor View (editor.html)
   - Rich text editor
   - Camera and voice input
   - Reminder settings

3. Settings View (settings.html)
   - Theme settings
     * Dark mode toggle
     * UI theme customization
   - Data Management
     * Export notes as JSON
     * Import notes from backup
     * Clear all data function
   - Storage Management
     * View storage usage
     * Data cleanup options
     * Complete data reset

4. Additional Views
   - Help documentation
   - About page

## Technical Implementation

### Settings Management
The application includes comprehensive settings management:
- Theme Control: Toggle between light and dark modes
- Data Operations:
  * Export: Save notes as JSON backup file
  * Import: Restore notes from backup
  * Reset: Clear all data with confirmation
- Storage: Local storage management with data persistence

### Service Worker
The application uses a Service Worker (sw.js) to:
- Cache application resources
- Enable offline functionality
- Handle push notifications
- Manage reminders

### Cache API
Implements a sophisticated caching strategy:
- Network-first with cache fallback
- Automatic resource caching
- Offline content availability

### Native Device Features
1. Camera API
   - Photo capture for note attachments
   - Image preview and processing

2. Speech Recognition
   - Voice-to-text conversion
   - Real-time transcription

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Bootstrap 5
- Service Workers
- Cache API
- Web Share API
- Notification API

## Code Structure

```
├── css/
│   └── style.css          # Global styles
├── js/
│   ├── app.js            # Core application logic
│   ├── camera.js         # Camera functionality
│   ├── editor.js         # Note editor
│   ├── notes.js          # Notes management
│   ├── settings.js       # App settings
│   ├── speech.js         # Voice recognition
│   └── storage.js        # Data persistence
├── icons/                # App icons
└── screenshots/          # App screenshots
```

## Code Quality

- Modular JavaScript architecture
- Consistent coding style
- Comprehensive error handling
- Well-documented functions
- Responsive design patterns
- Progressive enhancement
