class SpeechManager {
    constructor() {
        this.recognition = null;
        this.isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
        this.initialize();
    }

    initialize() {
        if (!this.isSupported) {
            console.warn('Speech recognition is not supported in this browser');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        // Configure recognition
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
    }

    startRecording() {
        if (!this.isSupported) {
            throw new Error('Speech recognition is not supported in this browser');
        }

        return new Promise((resolve, reject) => {
            let finalTranscript = '';
            let isRecording = true;

            this.recognition.onresult = (event) => {
                let interimTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript + ' ';
                    } else {
                        interimTranscript += transcript;
                    }
                }

                // Update UI with interim results if needed
                if (interimTranscript) {
                    console.log('Interim:', interimTranscript);
                }
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                reject(new Error('Speech recognition failed: ' + event.error));
                this.stopRecording();
            };

            this.recognition.onend = () => {
                if (isRecording) {
                    isRecording = false;
                    this.stopRecording();
                    resolve(finalTranscript.trim());
                }
            };

            // Start recording
            try {
                this.recognition.start();
                
                // Stop after 10 seconds maximum
                setTimeout(() => {
                    if (isRecording) {
                        isRecording = false;
                        this.stopRecording();
                        resolve(finalTranscript.trim());
                    }
                }, 10000);
            } catch (error) {
                reject(error);
            }
        });
    }

    stopRecording() {
        if (this.recognition) {
            try {
                this.recognition.stop();
            } catch (error) {
                console.warn('Error stopping recognition:', error);
            }
        }
    }
}
