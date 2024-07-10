import * as Three from "three";
import gsap from "gsap";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

class CameraController{
	constructor(camera, target){
		this._camera = camera;
		this._target = target;
		this._xmove = 0;
		this._ymove = 0;

		this._prevX = 0;
		this._prevY = 0;
		this._isHold = false;

		this._Initialize();
	}

	_Initialize(){
		// WASD
		window.addEventListener('keydown', (e)=>{
			let v = new Three.Vector3();
			v.copy(this._target).sub(this._camera.position);
			
			let u = new Three.Vector3(0, 1, 0);
			let w = new Three.Vector3();
			w.copy(v).cross(u)
		
			v.multiplyScalar(0.01);
			w.multiplyScalar(0.01);
		
			if(e.key == 'w'){
				this._camera.position.add(v);
				this._target.add(v);
			}
			if(e.key == 's'){
				this._camera.position.sub(v);
				this._target.sub(v);
			}
			if(e.key == 'a'){
				this._camera.position.sub(w);
				this._target.sub(w);
			}
			if(e.key == 'd'){
				this._camera.position.add(w);
				this._target.add(w);
			}
		});

		// Left & Right View
		window.addEventListener('mousedown', (e)=>{
			this._isHold = true;
		})
		window.addEventListener('mouseup', (e)=>{
			this._isHold = false;
		})
		window.addEventListener('mousemove', (e)=>{
			if(this._isHold){
				this._xmove += (e.clientX - this._prevX);
				this._ymove += (e.clientY - this._prevY);
		
				this._ymove = Math.max(-1000, Math.min(1000, this._ymove));
			}
			this._prevX = e.clientX;
			this._prevY = e.clientY;
		})
	}

	_Update(){
		let u = new Three.Vector3();
		u.copy(this._target).sub(this._camera.position);
		let v = new Three.Vector3(0, 1, 0);
		let w = new Three.Vector3();
		let initLength = u.length();
		w.copy(u).cross(v);

		let add1 = new Three.Vector3();
		add1.copy(w).multiplyScalar(0.01 * this._xmove);
		this._xmove = 0;
		this._target.add(add1)

		let w2 = new Three.Vector3();
		w2.copy(u).cross(w);

		let add2 = new Three.Vector3();
		add2.copy(w2).multiplyScalar(0.00005 * this._ymove);
		this._ymove = 0;
		this._target.add(add2);

		let u2 = new Three.Vector3();
		u2.copy(this._target).sub(this._camera.position);
		let mul = initLength / u2.length();
		let add3 = new Three.Vector3();
		add3.copy(u2).multiplyScalar(mul);

		this._target.copy(this._camera.position).add(add3);

		this._camera.lookAt(this._target);

		console.log(`Camera position = x:${this._camera.position.x} y:${this._camera.position.y} z:${this._camera.position.z}`);
		console.log(`Camera look at = x:${this._target.x} y:${this._target.y} z:${this._target.z}`);
	}
}

const renderer = new Three.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const scene = new Three.Scene();
let cameraMoving = false;
let cameraTarget = new Three.Vector3(0, 0, 0);

const camera = new Three.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
// const controls = new OrbitControls( camera, renderer.domElement );
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
// camera.rotation.set(rotations.home.x, rotations.home.y, rotations.home.z);
camera.lookAt(0, 0, 0);
let cameraController = new CameraController(camera, cameraTarget);

const light = new Three.DirectionalLight(0xffffff, 1);
light.position.set(2, 10, 7.5);
scene.add(light);

const ambientLight = new Three.AmbientLight(0xffffff, 0.15);
scene.add(ambientLight);

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

            // console.log('Object name:', object.name);
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
    renderer.render(scene, camera);
    cameraController._Update();
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
    sound.setVolume(0);
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