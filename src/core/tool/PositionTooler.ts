import * as THREE from "three";
export class PositionTooler {
	/**
	 * 获取3d物体在世界坐标系中的位置
	 * @param obj {THREE.Object3D} 3d物体
	 * @returns {THREE.Vector3} 坐标
	 */
	static getWorldPosition(obj: THREE.Object3D) {
		let p = new THREE.Vector3();
		obj.getWorldPosition(p);
		return p;
	}

	/**
	 * 世界坐标转到屏幕坐标
	 * @param obj 3d物体
	 * @param camera 摄像机
	 * @param renderer 渲染器
	 * @returns 屏幕坐标
	 */
	static worldToScreen(obj: THREE.Object3D, camera: THREE.PerspectiveCamera, renderer: THREE.Renderer) {
		var vector = new THREE.Vector3();

		var widthHalf = 0.5 * renderer.domElement.width;
		var heightHalf = 0.5 * renderer.domElement.height;

		obj.updateMatrixWorld();
		vector.setFromMatrixPosition(obj.matrixWorld);
		vector.project(camera);

		vector.x = vector.x * widthHalf + widthHalf;
		vector.y = -(vector.y * heightHalf) + heightHalf;

		return {
			x: vector.x,
			y: vector.y,
		};
	}

    /**
     * 屏幕坐标转到世界坐标y
     * @param x 屏幕x位置
     * @param y 屏幕y位置
     * @param camera 摄像机
     * @param renderer 渲染器
     * @returns 世界坐标点
     */
	static screenToWorld(x: number, y: number, camera: THREE.PerspectiveCamera, renderer: THREE.Renderer) {
		var pos = new THREE.Vector3(0, 0, 0);
		var vec = new THREE.Vector3();
		var pos = new THREE.Vector3();

		vec.set((x / renderer.domElement.width) * 2 - 1, -(y / renderer.domElement.height) * 2 + 1, 0.5);
		vec.unproject(camera);
		vec.sub(camera.position).normalize();
		var distance = -camera.position.z / vec.z;
		pos.copy(camera.position).add(vec.multiplyScalar(distance));
        return pos;
	}
}
