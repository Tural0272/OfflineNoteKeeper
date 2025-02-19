Offline Note Keeper PWA
A feature-rich Progressive Web Application for creating and managing notes with offline support.

Running the Project
Clone the project repository to your local machine.
Open the project in your preferred development environment (e.g., VS Code).
Run the project using a local HTTP server (e.g., using npx serve).
Access the application through the provided URL (typically http://localhost:5000).
Features
Core Functionality
Note Creation and Editing
Note Title: Create descriptive titles for easy organization.
Rich Text Content: Write and format your notes.
Pin Notes: Pin important notes to keep them at the top of the list.
Reminders: Set date and time reminders for notes.
Format: DD.MM.YYYY HH:MM
Notification when reminder time is reached.
Manage multiple reminders.
Media Integration
Photo Capture
Take photos directly within the app.
Access device camera.
Preview before saving.
Automatic image optimization.
Voice Notes
Voice-to-text conversion.
Real-time transcription.
Supports multiple languages.
Append to existing text.
Data Management
Create, edit, and delete notes.
Pin/unpin functionality.
Export and import notes.
Automatic saving.
Offline access.
Dark mode support.
Responsive design for all devices.
Note Organization
Search functionality.
Sort by date or title.
Filter pinned notes.
Category tagging.
Advanced Features
📸 Camera integration for photo attachments.
🎤 Voice-to-text note creation.
🔔 Note reminders.
📱 Offline functionality.
💾 Installable as a PWA.
Views
Home View (index.html)

List of all notes.
Quick actions for notes.
Search and filter functionality.
Editor View (editor.html)

Rich text editor.
Camera and voice input.
Reminder settings.
Settings View (settings.html)

Theme settings.
Dark mode toggle.
UI theme customization.
Data Management.
Export notes as JSON.
Import notes from backup.
Clear all data function.
Storage Management.
View storage usage.
Data cleanup options.
Complete data reset.
Additional Views

Help documentation.
About page.
Technical Implementation
Note Editor Features
Text Editor

Real-time saving.
Rich text formatting.
Character count.
Undo/redo functionality.
Media Handling

Camera Integration:
Uses CameraManager class.
Handles device permissions.
Image preview and editing.
Automatic compression.
Voice Recognition:
Uses SpeechManager class.
Continuous recording.
Multiple language support.
Error handling.
Reminder System

Date-time picker.
Push notification support.
Background scheduling.
Persistent storage.
Pin System

Toggle pin status.
Automatic reordering.
Persistent pin state.
Visual pin indicators.
Settings Management
The application includes comprehensive settings management:

Theme Control: Toggle between light and dark modes.
Data Operations:
Export: Save notes as JSON backup file.
Import: Restore notes from backup.
Reset: Clear all data with confirmation.
Storage: Local storage management with data persistence.
Service Worker
The application uses a Service Worker (sw.js) to:

Cache application resources.
Enable offline functionality.
Handle push notifications.
Manage reminders.
Cache API
Implements a sophisticated caching strategy:

Network-first with cache fallback.
Automatic resource caching.
Offline content availability.
Native Device Features
Camera API

Photo capture for note attachments.
Image preview and processing.
Speech Recognition

Voice-to-text conversion.
Real-time transcription.
Technologies Used
HTML5
CSS3
JavaScript (ES6+)
Bootstrap 5
Service Workers
Cache API
Web Share API
Notification API
Code Structure
bash
Копировать
Редактировать
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
Code Quality
Modular JavaScript architecture.
Consistent coding style.
Comprehensive error handling.
Well-documented functions.
Responsive design patterns.
Progressive enhancement.
