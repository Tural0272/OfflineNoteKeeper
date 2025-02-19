class CameraManager {
    constructor() {
        this.stream = null;
        this.videoElement = document.getElementById('camera');
        this.photoCanvas = document.getElementById('photoCanvas');
    }

    async initialize() {
        try {
            const constraints = {
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            };

            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            
            if (this.videoElement) {
                this.videoElement.srcObject = this.stream;
                this.videoElement.classList.remove('d-none');
            }
            
            return true;
        } catch (error) {
            console.error('Camera initialization error:', error);
            throw new Error('Failed to initialize camera');
        }
    }

    async takePhoto() {
        try {
            await this.initialize();

            // Wait for video to be ready
            await new Promise(resolve => {
                this.videoElement.onloadedmetadata = () => {
                    this.videoElement.play();
                    resolve();
                };
            });

            // Wait for 1 second to let camera adjust
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Take the photo
            const context = this.photoCanvas.getContext('2d');
            this.photoCanvas.width = this.videoElement.videoWidth;
            this.photoCanvas.height = this.videoElement.videoHeight;
            context.drawImage(this.videoElement, 0, 0);

            // Convert to base64
            const imageData = this.photoCanvas.toDataURL('image/jpeg', 0.8);

            // Cleanup
            this.stopCamera();

            return imageData;
        } catch (error) {
            console.error('Photo capture error:', error);
            throw new Error('Failed to capture photo');
        }
    }

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        
        if (this.videoElement) {
            this.videoElement.srcObject = null;
            this.videoElement.classList.add('d-none');
        }
    }
}
