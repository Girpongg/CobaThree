import * as Three from "three";
import gsap from "gsap";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";


class CameraController {
    constructor(camera, target) {
        this._camera = camera;
        this._target = target;
        this._xmove = 0;
        this._ymove = 0;

        this._prevX = 0;
        this._prevY = 0;
        this._isHold = false;

        this._positionState = 0;
        this._isCameraMove = false;
        this._positions = 
        {
            home: {x:35.61729525863302, y:11.859589130052475, z:-5.118022422950115},
            about: {x:7.932559571249098, y:2.2810136110825003, z:19.81778795314402},
            about_out: {x:10.458472412218109, y:1.5681570051147102, z:29.318561018826923},
            timeline: {x:-5.028683072664165, y:2.0692772821455487, z:18.102144996367322},
            timeline_out: {x:-8.755370410598227, y:1.5513093949631322, z:28.87635538214861},
            login: {x:15.609794984978292, y:3.60666473891604, z:12.600139452444894},
            login_out: {x:28.688904378765656, y:1.6949788584605308, z:17.58892246844016},
        }
        this._lookPositions = 
        {
            home: {x:-5.9656840429284586, y:4.434269327793475, z:-1.1531191151660933},
            about: {x:7.564250758574618, y:5.826297156905862, z:-22.45862761390972},
            about_out: {x:-1.9743668083153043, y:5.610995188499668, z:-11.043301776878419},
            timeline: {x:-5.23249875491511, y:6.487939885618854, z:-24.093042880502516},
            timeline_out: {x:8.111738625898235, y:3.051636278037684, z:-10.024154280256546},
            login: {x:-26.10931310059165, y:-4.034070271605513, z:13.665591958901086},
            login_out: {x:-12.117434450661307, y:-0.24537785241798105, z:6.140004302405806},
        }

        this._Initialize();
    }

    _Initialize() {
        // WASD
        window.addEventListener('keydown', (e) => {
            let v = new Three.Vector3();
            v.copy(this._target).sub(this._camera.position);

            let u = new Three.Vector3(0, 1, 0);
            let w = new Three.Vector3();
            w.copy(v).cross(u)

            v.multiplyScalar(0.01);
            w.multiplyScalar(0.01);

            if (e.key == 'w') {
                this._camera.position.add(v);
                this._target.add(v);
            }
            if (e.key == 's') {
                this._camera.position.sub(v);
                this._target.sub(v);
            }
            if (e.key == 'a') {
                this._camera.position.sub(w);
                this._target.sub(w);
            }
            if (e.key == 'd') {
                this._camera.position.add(w);
                this._target.add(w);
            }
        });

        // Left & Right View
        window.addEventListener('mousedown', (e) => {
            this._isHold = true;
        })
        window.addEventListener('mouseup', (e) => {
            this._isHold = false;
        })
        window.addEventListener('mousemove', (e) => {
            if (this._isHold) {
                this._xmove += (e.clientX - this._prevX);
                this._ymove += (e.clientY - this._prevY);

                this._ymove = Math.max(-1000, Math.min(1000, this._ymove));
            }
            this._prevX = e.clientX;
            this._prevY = e.clientY;
        })

        // Navbar
        let homeEle = document.getElementById("home-link");
        let aboutEle = document.getElementById("about-link");
        let timelineEle = document.getElementById("timeline-link");
        let loginEle = document.getElementById("login-link");

        homeEle.addEventListener('click', ()=>{
            if(this._positionState === 0 || this._isCameraMove) return;
            this._isCameraMove = true;
            this.moveCameraTo(this._positions.home, this._lookPositions.home);
            setTimeout(() => { this._isCameraMove = false; }, 3000);
            this._positionState = 0;
        })
        aboutEle.addEventListener('click', ()=>{
            if(this._positionState === 1 || this._isCameraMove) return;
            this._isCameraMove = true;
            this.moveCameraTo(this._positions.about_out, this._lookPositions.about_out);
            setTimeout(() => this.moveCameraTo(this._positions.about, this._lookPositions.about), 3000);
            setTimeout(() => { this._isCameraMove = false; }, 6000);
            this._positionState = 1;
        });
        timelineEle.addEventListener('click', ()=>{
            if(this._positionState === 2 || this._isCameraMove) return;
            this._isCameraMove = true;
            this.moveCameraTo(this._positions.timeline_out, this._lookPositions.timeline_out);
            setTimeout(() => this.moveCameraTo(this._positions.timeline, this._lookPositions.timeline), 3000);
            setTimeout(() => { this._isCameraMove = false; }, 6000);
            this._positionState = 2;
        });
        loginEle.addEventListener('click', ()=>{
            if(this._positionState === 3 || this._isCameraMove) return;
            this._isCameraMove = true;
            this.moveCameraTo(this._positions.login_out, this._lookPositions.login_out);
            setTimeout(() => this.moveCameraTo(this._positions.login, this._lookPositions.login), 3000);
            setTimeout(() => { this._isCameraMove = false; }, 6000);
            this._positionState = 3;
        });

        // Set initial camera position
        this.setCameraTo(this._positions.home, this._lookPositions.home);
        this._positionState = 0;
    }

    _Update() {
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

        // console.log(this._target);
        // console.log(`Camera position = {x:${this._camera.position.x}, y:${this._camera.position.y}, z:${this._camera.position.z}},`);
        // console.log(`Camera look at = {x:${this._target.x}, y:${this._target.y}, z:${this._target.z}},`);
    }

    setCameraTo(pos, lookPos){
        this._camera.position.set(pos.x, pos.y, pos.z);
        this._target = new Three.Vector3(lookPos.x, lookPos.y, lookPos.z);
    }
    moveCameraTo(pos, lookPos, duration=3){
        gsap.to(this._camera.position, {
            x: pos.x, y:pos.y, z:pos.z, duration:duration,
        });
        gsap.to(this._target, {
            x: lookPos.x, y:lookPos.y , z:lookPos.z, duration:duration,
        });
    }
}

const renderer = new Three.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const scene = new Three.Scene();

const camera = new Three.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
let cameraTarget = new Three.Vector3(0, 0, 0);
let cameraController = new CameraController(camera, cameraTarget);

// const controls = new OrbitControls( camera, renderer.domElement );
// const positions = {
//     collision: { x: -1.2, y: 1.2, z: 2 },
//     home: {x:41.15930448397892, y:2.8992855672470395, z:5.868403930456852},
//     aboutUs: { x: -3, y: 1.8, z: 0 },
//     signUp: { x: 1, y: 1.4, z: 0.4 },
//     coba: { x: 0.29, y: 1.2, z: 0.2 },
// };
// const rotations = {
//     collision: { x: 0, y: 0, z: 0 },
//     home: { x: 0, y: 0, z: 0 },
//     aboutUs: { x: 0, y: -1.6, z: 0 },
//     signUp: { x: 0, y: 0, z: 0 },
//     coba: { x: 0, y: 1.57, z: 0 },
// };
//x:-9.633109293423729 y:5.206253333188245 z:30.20936432677548
//Camera position = x:32.137148559873054 y:10.934339507232652 z:-11.06945160231319
// camera.position.set(positions.home.x, positions.home.y, positions.home.z);
// camera.rotation.set(rotations.home.x, rotations.home.y, rotations.home.z);
// camera.lookAt(0, 0, 0);

const light = new Three.DirectionalLight(0xD3D3D3, 1.5);
light.position.set(3, 13, 12);
scene.add(light);

//lampu 1
var geometry = new Three.CylinderGeometry(0.22, 4, 10, 18, 1, true);
var material = new Three.MeshStandardMaterial({
    color: 0xDD6CFF, side: Three.DoubleSide, opacity: 0.15, transparent:
        true
});

var mesh = new Three.Mesh(geometry, material);
mesh.position.set(-1.55, 5.7, 20.1);
scene.add(mesh);

var houseLight1 = new Three.PointLight(0xE900D6, 200);
houseLight1.position.set(20, 5.7, 2.2);
houseLight1.castShadow = true;
scene.add(houseLight1);


var lampukecil1 = new Three.PointLight(0xE900D6, 1);
lampukecil1.position.set(17.8, 4, -17);
lampukecil1.castShadow = true;
scene.add(lampukecil1);
var lampukecil3 = new Three.PointLight(0xDD6CFF, 140);
lampukecil3.position.set(20.01017070369093, 10.256380149234019, -4.857129217538916);
lampukecil3.castShadow = true;
scene.add(lampukecil3);
var lampukecil4 = new Three.PointLight(0xDD6CFF, 140);
lampukecil4.position.set(20.01017070369093, 10.256380149234019, -10.857129217538916);
lampukecil4.castShadow = true;
scene.add(lampukecil4);
var lampugarasi = new Three.PointLight(0x0C17EF, 20);
lampugarasi.position.set(20, 1.5, -6);
lampugarasi.castShadow = true;
scene.add(lampugarasi);

var lampucafe = new Three.PointLight(0x0C17EF, 140);
lampucafe.position.set(10, 8, 11);
scene.add(lampucafe);

// const geometrya = new Three.BoxGeometry( 1, 1, 1 );
// const materiala = new Three.MeshBasicMaterial( { color: 0xffff00 } );
// const mesha = new Three.Mesh( geometrya, materiala );
// mesha.position.set(10, 8, 11);
// scene.add( mesha );

scene.fog = new Three.Fog(0x0C17EF, 0, 90);

let mod;
const gltfLoader = new GLTFLoader();
let mixer;
gltfLoader.load("./coba9/untitled.gltf", (gltf) => {
    const model = gltf.scene;
    scene.add(model);
    mod = model;
    mixer = new Three.AnimationMixer(model);
    gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
    });
    model.traverse((child) => {
        // console.log(child.material);
    });
});

function animate(time) {
    renderer.render(scene, camera);
    cameraController._Update();
    if (mixer) mixer.update(0.01);
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

//hitbox
const aboutMeBoxes = new Three.Group()
const hitBoxMaterial = new Three.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
const aboutMeHitBoxGeometry = new Three.PlaneGeometry(1, 0.35)

const day1 = new Three.Mesh(
    aboutMeHitBoxGeometry,
    hitBoxMaterial
)
day1.position.set(-7.3, 3.4, 14.1)
// day1.visible = false

const day2 = new Three.Mesh(
    aboutMeHitBoxGeometry,
    hitBoxMaterial
)
day2.position.set(-7.3, 2.9, 14.1)
// day2.visible = false

const day3 = new Three.Mesh(
    aboutMeHitBoxGeometry,
    hitBoxMaterial
)
day3.position.set(-7.3, 2.4, 14.1)
// day3.visible = false

const day4 = new Three.Mesh(
    aboutMeHitBoxGeometry,
    hitBoxMaterial
)
day4.position.set(-7.3, 1.9, 14.1)
// day4.visible = false

const day5 = new Three.Mesh(
    aboutMeHitBoxGeometry,
    hitBoxMaterial
)
day5.position.set(-7.3, 1.4, 14.1)
// day5.visible = false

aboutMeBoxes.add(day1, day2, day3, day4, day5)

scene.add(aboutMeBoxes)
const objectsToTest = [
    day1,
    day2,
    day3,
    day4,
    day5
]
objectsToTest.push(
    aboutMeBoxes
)
const touchedPoints = [];
let cursor = new Three.Vector2();
let cursorXMin, cursorXMax, cursorYMin, cursorYMax;
let absX, absY;

window.addEventListener('pointerdown', (event) => {
    touchedPoints.push(event.pointerId);

    cursorXMin = Math.abs((event.clientX / window.innerWidth * 2 - 1) * 0.9);
    cursorXMax = Math.abs((event.clientX / window.innerWidth * 2 - 1) * 1.1);

    cursorYMin = Math.abs((event.clientY / window.innerHeight * 2 - 1) * 0.9);
    cursorYMax = Math.abs((event.clientY / window.innerHeight * 2 - 1) * 1.1);
});

window.addEventListener('pointerup', (event) => {
    cursor.x = event.clientX / window.innerWidth * 2 - 1;
    cursor.y = - (event.clientY / window.innerHeight) * 2 + 1;

    absX = Math.abs(cursor.x);
    absY = Math.abs(cursor.y);

    if (touchedPoints.length === 1 &&
        absX > cursorXMin && absX < cursorXMax &&
        absY > cursorYMin && absY < cursorYMax) {

        click(cursor);

        touchedPoints.length = 0;
    } else {
        touchedPoints.length = 0;
    }
});
const raycaster = new Three.Raycaster();
const cameraInstance = camera;

function click(cursor) {
    raycaster.setFromCamera(cursor, cameraInstance);

    const intersectsObjects = raycaster.intersectObjects(objectsToTest);
    if (intersectsObjects.length) {
        const selectedModel = intersectsObjects[0].object;

        switch (selectedModel) {
            case day1:
                changeTexture('day1');
                break;
            case day2:
                changeTexture('day2');
                break;
            case day3:
                changeTexture('day3'); 
                break;
            case day4:
                console.log("day4")
                break;
            case day5:
                console.log("day5")
                break;
        }
    }
}
const loader = new Three.TextureLoader();
const textures = {
    day1: loader.load('coba9/ccc.png'),
    day2: loader.load('coba9/garasi.jpg'),
    day3: loader.load('coba9/duatiga.png'),
};

const geometrys = new Three.PlaneGeometry(5.2, 3);
const materials = new Three.MeshBasicMaterial({ map: textures.day1 });
const textureMesh = new Three.Mesh(geometrys, materials);
textureMesh.position.set(-5.3, 2.5, 14.1);
scene.add(textureMesh);


function changeTexture(day) {
    textureMesh.material.map = textures[day];
    textureMesh.material.needsUpdate = true;
}

// screenTransition(material, newTexture, duration,)
// {
//     material.uniforms.texture2.value = newTexture
//     gsap.to(material.uniforms.progress, {        
//         value: 1,
//         duration: duration,
//         ease: "power1.inOut",
//         onComplete: () => {
//             material.uniforms.texture1.value = newTexture
//             material.uniforms.progress.value = 0
//         }
//     })
// }

// bigScreenTransition(material, newTexture, duration, toDefault)
// {
//     material.uniforms.uTexture2IsDefault.value = toDefault ? 1 : 0

//     material.uniforms.uTexture2.value = newTexture
//     gsap.to(material.uniforms.uProgress, {
//         value: 1,
//         duration: duration,
//         ease: "power1.inOut",
//         onComplete: () => {
//             material.uniforms.uTexture1IsDefault.value = toDefault ? 1 : 0
//             material.uniforms.uTexture1.value = newTexture
//             material.uniforms.uProgress.value = 0

//         }
//     })
// }

// sleep(ms)
// {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

