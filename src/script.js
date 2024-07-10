import * as Three from "three";
import gsap from "gsap";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const renderer = new Three.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const scene = new Three.Scene();
let cameraMoving = false;

const camera = new Three.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
const controls = new OrbitControls( camera, renderer.domElement );
const positions = {
    collision: { x: -1.2, y: 1.2, z: 2 },
    home: { x: 0.4, y: 50, z: 100 },
    aboutUs: { x: -3, y: 1.8, z: 0 },
    signUp: { x: 1, y: 1.4, z: 0.4 },
    coba: { x: 0.29, y: 1.2, z: 0.2 },
};
const rotations = {
    collision: { x: 0, y: 0, z: 0 },
    home: { x: 0, y: 0, z: 0 },
    aboutUs: { x: 0, y: -1.6, z: 0 },
    signUp: { x: 0, y: 0, z: 0 },
    coba: { x: 0, y: 1.57, z: 0 },
};

// const helper = new Three.CameraHelper(camera);
// scene.add(helper);
// const axesHelper = new Three.AxesHelper(100);
// scene.add(axesHelper);


camera.position.set(positions.home.x, positions.home.y, positions.home.z);
camera.rotation.set(rotations.home.x, rotations.home.y, rotations.home.z);

const light = new Three.DirectionalLight(0xffffff, 1);
light.position.set(2, 10, 7.5);
scene.add(light);

let mod;
const gltfLoader = new GLTFLoader();
const excludedObjectNames = ['Plane019_Material010_0', 'Plane005__0'];
const boundingBoxes = [];

gltfLoader.load("./cobaobject/untitled.gltf", (gltf) => {
    const model = gltf.scene;
    scene.add(model);
    mod = model;
    model.traverse((object) => {
        if (object.isMesh) {
            if (excludedObjectNames.includes(object.name)) {
                object.excludeFromCollision = true;
            }

            const box = new Three.Box3().setFromObject(object);
            boundingBoxes.push({ box: box, exclude: object.excludeFromCollision || false });
            // const color = object.excludeFromCollision ? 0xff0000 : 0xffff00;
            // const helper = new Three.Box3Helper(box, color);
            // scene.add(helper);

            console.log('Object name:', object.name);
        }
    });

    document.getElementById('beranda-link').addEventListener('click', (event) => {
        event.preventDefault();
        if (!cameraMoving) {
            moveCameraAndCheckCollision(positions.coba, rotations.coba);
        }
    });
    document.getElementById('about-us-link').addEventListener('click', (event) => {
        event.preventDefault();
        if (!cameraMoving) {
            moveCameraAndCheckCollision(positions.aboutUs, rotations.aboutUs);
        }
    });
    document.getElementById('sign-up-link').addEventListener('click', (event) => {
        event.preventDefault();
        if (!cameraMoving) {
            moveCameraAndCheckCollision(positions.signUp, rotations.signUp);
        }
    });

    function moveCameraAndCheckCollision(targetPosition, targetRotation) {
        const newCameraPosition = new Three.Vector3(targetPosition.x, targetPosition.y, targetPosition.z);
        const cameraBox = new Three.Box3().setFromCenterAndSize(newCameraPosition, new Three.Vector3(1, 1, 1));

        let collision = false;
        for (const { box, exclude } of boundingBoxes) {
            if (!exclude && cameraBox.intersectsBox(box)) {
                collision = true;
                break;
            }
        }
        console.log('Collision detected:', collision);

        if (!collision) {
            movecamera(targetPosition.x, targetPosition.y, targetPosition.z);
            rotatecamera(targetRotation.x, targetRotation.y, targetRotation.z);
        }
    }
    // function moveCameraAndCheckCollision(targetPosition, targetRotation) {
    //     cameraMoving = true;

    //     gsap.to(camera.position, {
    //         duration: 5,
    //         x: targetPosition.x,
    //         y: targetPosition.y,
    //         z: targetPosition.z,
    //         onUpdate: function () {
    //             const cameraBox = new Three.Box3().setFromCenterAndSize(camera.position, new Three.Vector3(1, 1, 1));
    //             let collision = false;

    //             for (const { box, exclude } of boundingBoxes) {
    //                 if (!exclude && cameraBox.intersectsBox(box)) {
    //                     collision = true;
    //                     break;
    //                 }
    //             }

    //             if (collision) {
    //                 gsap.killTweensOf(camera.position);
    //                 gsap.killTweensOf(camera.rotation);
    //                 moveCameraAndCheckCollision(positions.collision, rotations.collision);
    //             }
    //         },
    //         onComplete: function () {
    //             cameraMoving = false;
    //         }
    //     });

    //     gsap.to(camera.rotation, {
    //         duration: 7,
    //         x: targetRotation.x,
    //         y: targetRotation.y,
    //         z: targetRotation.z,
    //     });
    // }

    function movecamera(x, y, z) {
        cameraMoving = true;
        gsap.to(camera.position, {
            duration: 5,
            x: x,
            y: y,
            z: z,
            onComplete: function () {
                cameraMoving = false;
            }
        });
    }

    function rotatecamera(x, y, z) {
        gsap.to(camera.rotation, {
            duration: 7,
            x: x,
            y: y,
            z: z
        });
    }
});

function animate(time) {
    // requestAnimationFrame( animate );
    controls.update();
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const listener = new Three.AudioListener();
camera.add(listener);
const sound = new Three.Audio(listener);

const audioLoader = new Three.AudioLoader();
audioLoader.load('./src/assets/keempat.mp3', function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.2);
});

function startAudio() {
    if (Three.AudioContext.state === 'suspended') {
        Three.AudioContext.resume();
    }
    sound.play();
    document.removeEventListener('click', startAudio);
    document.removeEventListener('touchstart', startAudio);
}

document.addEventListener('click', startAudio);
document.addEventListener('touchstart', startAudio);

document.body.style.margin = 0;
document.body.style.overflow = "hidden";
renderer.domElement.style.display = "block";
