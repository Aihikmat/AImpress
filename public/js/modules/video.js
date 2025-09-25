// Video Module
class VideoHandler {
    constructor() {
        this.video = document.getElementById('bgVideo');
        this.videoBackground = document.querySelector('.video-background');
        this.init();
    }

    init() {
        if (this.video && this.videoBackground) {
            this.setupVideo();
        }
    }

    setupVideo() {
        this.video.muted = true;
        this.video.loop = true;
        this.video.playsInline = true;
        this.video.style.opacity = '1'; // Ensure visible

        const playVideo = () => {
            const playPromise = this.video.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    // Autoplay blocked → play on first user interaction
                    const playOnInteraction = () => this.video.play();
                    document.addEventListener('click', playOnInteraction, { once: true });
                    document.addEventListener('touchstart', playOnInteraction, { once: true });
                    document.addEventListener('keydown', playOnInteraction, { once: true });
                });
            }
        };

        this.video.addEventListener('loadedmetadata', playVideo);
        this.video.addEventListener('canplay', playVideo);

        this.video.addEventListener('ended', () => {
            this.video.currentTime = 0.001;
            this.video.play();
        });

        this.video.addEventListener('error', () => {
            console.log('Video failed to load. Applying fallback background.');
            this.videoBackground.style.background = 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)';
            this.videoBackground.innerHTML = `
                <div style="position: absolute; top:50%; left:50%; transform:translate(-50%, -50%); color:white; text-align:center; z-index:1;">
                    <h3>Loading background...</h3>
                </div>
            `;
        });

        this.video.load();
        if (document.readyState === 'complete') playVideo();
        else window.addEventListener('load', playVideo);
    }
}

// Make VideoHandler globally available
window.VideoHandler = VideoHandler;

// Initialize when DOM is ready
if (document.readyState !== 'loading') {
    new VideoHandler();
} else {
    document.addEventListener('DOMContentLoaded', function() {
        new VideoHandler();
    });
}