import * as Three from 'three';

class CameraController {
    constructor(camera, target) {
        this._camera = camera;
        this._target = target;
        this._xmove = 0;
        this._ymove = 0;
        this._prevX = 0;
        this._prevY = 0;
        this._isHold = false;
        this._Initialize();
    }

    _Initialize() {
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('mousedown', () => this._isHold = true);
        window.addEventListener('mouseup', () => this._isHold = false);
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }

    onKeyDown(e) {
        let v = new Three.Vector3();
        v.copy(this._target).sub(this._camera.position);
        let u = new Three.Vector3(0, 1, 0);
        let w = new Three.Vector3();
        w.copy(v).cross(u);
        v.multiplyScalar(0.01);
        w.multiplyScalar(0.01);

        if (e.key === 'w') {
            this._camera.position.add(v);
            this._target.add(v);
        }
        if (e.key === 's') {
            this._camera.position.sub(v);
            this._target.sub(v);
        }
        if (e.key === 'a') {
            this._camera.position.sub(w);
            this._target.sub(w);
        }
        if (e.key === 'd') {
            this._camera.position.add(w);
            this._target.add(w);
        }
    }

    onMouseMove(e) {
        if (this._isHold) {
            this._xmove += (e.clientX - this._prevX);
            this._ymove += (e.clientY - this._prevY);
            this._ymove = Math.max(-1000, Math.min(1000, this._ymove));
        }
        this._prevX = e.clientX;
        this._prevY = e.clientY;
    }

    update() {
        let u = new Three.Vector3();
        u.copy(this._target).sub(this._camera.position);
        let v = new Three.Vector3(0, 1, 0);
        let w = new Three.Vector3();
        let initLength = u.length();
        w.copy(u).cross(v);

        let add1 = new Three.Vector3();
        add1.copy(w).multiplyScalar(0.01 * this._xmove);
        this._xmove = 0;
        this._target.add(add1);

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

export default CameraController;
