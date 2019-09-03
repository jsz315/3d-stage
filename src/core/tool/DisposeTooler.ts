import * as THREE from 'three'

export default class DisposeTooler {

	constructor() {

	}

	public static clear(obj: any): void {
		obj.geometry && obj.geometry.dispose();
		obj.material && obj.material.dispose();
		obj.parent && obj.parent.remove(obj);
	}
}