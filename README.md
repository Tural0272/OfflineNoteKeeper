
# Offline Note Keeper PWA

**Offline Note Keeper** is a feature-rich Progressive Web Application designed for creating and managing notes with offline support. The app makes use of native device features such as the camera and voice recognition for an enhanced user experience.

## How to Run the Project

### 1. Clone the Repository
Clone the project repository to your local machine:

```bash
git clone https://github.com/Tural0272/OfflineNoteKeeper.git
```

### 2. Open the Project
Open the project in your preferred development environment (e.g., VS Code).

### 3. Run the Project
Use a local HTTP server to run the project. You can use `npx serve` or any other local hosting tool:

```bash
npx serve
```

### 4. Access the Application
Once the project is running, open it in your browser via the provided URL (usually `http://localhost:5000`).

## Key Features

### 1. **Create and Edit Notes**
- **Note Title**: Give your notes descriptive titles to stay organized.
- **Note Content**: Write, edit, and manage your notes.
- **Pin Notes**: Pin important notes to keep them at the top of the list.
- **Reminders**: Set date and time reminders for your notes.
  - Format: `DD.MM.YYYY HH:MM`
  - Notifications will alert you when the reminder time arrives.

### 2. **Multimedia Integration**
- **Photo Capture**: Take photos directly within the app and attach them to notes.
- **Voice Notes**: Record voice notes and convert them to text in real-time.

### 3. **Data Management**
- Create, edit, and delete notes.
- Pin/unpin notes.
- Export and import notes.
- Auto-save feature.
- Offline access to your notes.
- Dark mode for better night-time readability.
- Responsive design for various screen sizes.

### 4. **Additional Features**
- 📸 **Camera Integration** for photo attachments.
- 🎤 **Voice-to-text** for creating notes.
- 🔔 **Note Reminders** with push notifications.
- 📱 **Offline functionality** for use without an internet connection.
- 💾 **Installable as a PWA** for quick access.

## Views

The app consists of multiple views, each serving a specific purpose:

### 1. **Home View** (`index.html`)
- Displays a list of all notes.
- Quick actions for each note (edit, delete, pin/unpin).
- Search and filter options for notes.

### 2. **Editor View** (`editor.html`)
- Allows you to create or edit notes.
- Attach photos or voice notes.
- Set reminders for notes.

### 3. **Settings View** (`settings.html`)
- **Theme Control**: Toggle between light and dark mode.
- **Data Management**:
  - Export notes as a JSON backup file.
  - Import notes from backup.
  - Clear all data.
- **Storage Management**:
  - View storage usage and clear data when needed.

## Technical Implementation

### Note Editor Features
- **Text Editor**: Auto-save while editing, with support for rich text formatting.
- **Camera Integration**: Uses the `CameraManager` class to interact with the device's camera, manage permissions, and process images.
- **Voice Recognition**: Uses the `SpeechManager` class for continuous speech-to-text conversion, supporting multiple languages.

### Reminder System
- **Date/Time Picker**: Set reminders with a specific date and time.
- **Push Notifications**: Receive notifications when the reminder time arrives.
- **Background Scheduling**: Reminders are scheduled to notify the user even if the app is closed.

### Pin System
- **Pin/Unpin**: Notes can be pinned to keep them at the top of the list.
- **Persistent Pin State**: The state of pinned notes is saved across app sessions.

### Service Worker
The app uses a **Service Worker** (`sw.js`) to:
- Cache application resources.
- Enable offline functionality.
- Handle push notifications and reminders.

### Caching Strategy
The app uses a **Network-first** strategy with fallback to the cache, ensuring that resources are cached efficiently and are available offline.

### Native Device Features
1. **Camera API**: Allows taking photos and attaching them to notes.
2. **Speech Recognition**: Converts spoken words into text, enabling the creation of voice notes.

## Technologies Used
- **HTML5**
- **CSS3**
- **JavaScript (ES6+)**
- **Bootstrap 5**
- **Service Workers**
- **Cache API**
- **Web Share API**
- **Notification API**

## Code Structure
```
├── css/               
│   └── style.css      # Global styles
├── js/                
│   ├── app.js         # Core application logic
│   ├── camera.js      # Camera functionality
│   ├── editor.js      # Note editor
│   ├── notes.js       # Notes management
│   ├── settings.js    # App settings
│   ├── speech.js      # Speech recognition
│   └── storage.js     # Data persistence
├── icons/             # App icons
└── screenshots/       # App screenshots
```

## Code Quality
- Modular JavaScript architecture.
- Consistent coding style.
- Comprehensive error handling.
- Well-documented functions.
- Responsive design patterns.

## Conclusion
This project fully meets the requirements and is feature-complete. It uses modern web technologies, supports offline functionality, and interacts with native device features for an enhanced experience. The application is installable as a Progressive Web App and ready for use.
