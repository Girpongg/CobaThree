import * as Three from 'three';
import gsap from 'gsap'; // Make sure you import GSAP
import { LoadingManager } from 'three';

class PreLoader {
    constructor(onLoadCallback) {
        this.overlay = document.querySelector('.overlay');
        this.cooking = document.querySelector('#cooking');
        this.startButton = document.querySelector('.start');
        this.onLoadCallback = onLoadCallback;

        this.manager = new LoadingManager();
        this.manager.onProgress = this.onProgress.bind(this);
        this.manager.onLoad = this.onLoad.bind(this);

        this.progressElement = document.getElementById("progressPercentage");
    }

    onProgress(item, loaded, total) {
        const progressRatio = loaded / total;
        this.progressElement.innerHTML = Math.trunc(progressRatio * 100);
    }

    onLoad() {
        setTimeout(() => {
            this.cooking.classList.add('fade');
        }, 1500);
        setTimeout(() => {
            this.readyScreen();
        }, 2500);
    }

    readyScreen() {
        this.cooking.remove();
        this.startButton.style.display = "inline";
        gsap.fromTo(this.startButton, 
            { opacity: 0 }, 
            { opacity: 1, duration: 1, ease: "power1.inOut" }
        );
        gsap.set(this.overlay, { opacity: 0 });
        this.startButton.addEventListener("click", async () => {
            gsap.to(this.startButton, {
                opacity: 0,
                duration: 1,
                ease: "power1.inOut",
                onComplete: () => {
                    this.startButton.remove();
                }
            });
            gsap.to(this.overlay, {
                opacity: 1,
                duration: 1,
                ease: "power1.inOut",
                onComplete: () => {
                    this.overlay.remove();
                }
            });
            setTimeout(() => {
                this.onLoadCallback();
            }, 1000);
        }, { once: true });
    }
}

export default PreLoader;
