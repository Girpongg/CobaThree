import * as Three from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import CameraController from './CameraController.js';
import PreLoader from './preLoader.js';

class Experience {
    constructor() {
        this.initScene();
        this.initCamera();
        this.initRenderer();
        this.initLighting();
        this.initLoader();
        this.initAudio();
        this.initEventListeners();

        this.preloader = new PreLoader(this.onPreloadComplete.bind(this));
        this.gltfLoader = new GLTFLoader(this.preloader.manager);

        this.loadModel();
    }

    initScene() {
        this.scene = new Three.Scene();
        this.scene.fog = new Three.Fog(0x0C17EF, 0, 90);
    }

    initCamera() {
        this.camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.cameraTarget = new Three.Vector3(0, 0, 0);
        this.cameraController = new CameraController(this.camera, this.cameraTarget);

        const positions = {
            home: { x: 15.418356683989892, y: 3.8945164960725847, z: 12.494065629472662 },
        };
        const rotations = {
            home: { x: 0, y: 0, z: 0 },
        };

        this.camera.position.set(positions.home.x, positions.home.y, positions.home.z);
        this.camera.rotation.set(rotations.home.x, rotations.home.y, rotations.home.z);
        this.camera.lookAt(0, 0, 0);
    }

    initRenderer() {
        this.renderer = new Three.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(this.renderer.domElement);
    }

    initLighting() {
        const light = new Three.DirectionalLight(0xD3D3D3, 1.5);
        light.position.set(3, 13, 12);
        this.scene.add(light);

        var geometry = new Three.CylinderGeometry(0.22, 4, 10, 18, 1, true);
        var material = new Three.MeshStandardMaterial({ color: 0xDD6CFF, side: Three.DoubleSide, opacity: 0.15, transparent: true });
        var mesh = new Three.Mesh(geometry, material);
        mesh.position.set(-1.55, 5.7, 20.1);
        this.scene.add(mesh);

        var houseLight1 = new Three.PointLight(0xE900D6, 200);
        houseLight1.position.set(20, 5.7, 2.2);
        houseLight1.castShadow = true;
        this.scene.add(houseLight1);

        var lampukecil1 = new Three.PointLight(0xE900D6, 1);
        lampukecil1.position.set(17.8, 4, -17);
        lampukecil1.castShadow = true;
        this.scene.add(lampukecil1);

        var lampukecil3 = new Three.PointLight(0xDD6CFF, 140);
        lampukecil3.position.set(20.01017070369093, 10.256380149234019, -4.857129217538916);
        lampukecil3.castShadow = true;
        this.scene.add(lampukecil3);

        var lampukecil4 = new Three.PointLight(0xDD6CFF, 140);
        lampukecil4.position.set(20.01017070369093, 10.256380149234019, -10.857129217538916);
        lampukecil4.castShadow = true;
        this.scene.add(lampukecil4);

        var lampugarasi = new Three.PointLight(0x0C17EF, 20);
        lampugarasi.position.set(20, 1.5, -6);
        lampugarasi.castShadow = true;
        this.scene.add(lampugarasi);

        var lampucafe = new Three.PointLight(0x0C17EF, 140);
        lampucafe.position.set(10, 8, 11);
        this.scene.add(lampucafe);
    }

    initLoader() {
        this.loadingManager = new Three.LoadingManager();
        this.loadingManager.onProgress = (item, loaded, total) => {
            const progressRatio = loaded / total;
            document.getElementById("progressPercentage").innerHTML = Math.trunc(progressRatio * 100);
        };
    }

    initAudio() {
        this.listener = new Three.AudioListener();
        this.camera.add(this.listener);
        this.sound = new Three.Audio(this.listener);
        const audioLoader = new Three.AudioLoader();
        audioLoader.load('./src/assets/keempat.mp3', (buffer) => {
            this.sound.setBuffer(buffer);
            this.sound.setLoop(true);
            this.sound.setVolume(0.2);
        });

        document.addEventListener('click', this.startAudio.bind(this));
        document.addEventListener('touchstart', this.startAudio.bind(this));
    }

    startAudio() {
        if (Three.AudioContext.state === 'suspended') {
            Three.AudioContext.resume();
        }
        this.sound.play();
        document.removeEventListener('click', this.startAudio.bind(this));
        document.removeEventListener('touchstart', this.startAudio.bind(this));
    }

    initEventListeners() {
        window.addEventListener("resize", this.onWindowResize.bind(this));
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    loadModel() {
        this.gltfLoader.load("./coba2/untitled.gltf", (gltf) => {
            const model = gltf.scene;
            this.scene.add(model);
            this.mixer = new Three.AnimationMixer(model);
            gltf.animations.forEach((clip) => {
                this.mixer.clipAction(clip).play();
            });
        });
    }

    onPreloadComplete() {
        this.animate();
    }

    animate() {
        this.renderer.setAnimationLoop(() => {
            this.renderer.render(this.scene, this.camera);
            this.cameraController.update();
            if (this.mixer) this.mixer.update(0.01);
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new Experience();
});
