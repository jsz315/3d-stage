import * as THREE from 'three'
import DisposeTooler from '../tool/DisposeTooler';

export default class SelectLine extends THREE.Object3D {

	lines: Array<Object>;
	multiple: boolean = false;
	scene: THREE.Scene;
	selectedColor: string = "#ff0000";

	constructor(scene: THREE.Scene) {
		super();
		this.lines = [];
		this.scene = scene;
	}

	clear():void{
		this.lines.forEach((item: any) => {
			DisposeTooler.clear(item.line);
		})
		this.lines = [];
	}

	addNewLine(obj:THREE.Object3D):void{
		let has = this.lines.find((item: any) => {
			return item.obj == obj;
		})
		if(!has){
			let line = new THREE.BoxHelper(obj, new THREE.Color(this.selectedColor));
			this.add(line);
			this.lines.push({
				obj: obj,
				line: line
			})
		}
	}

	removeObject(objs: THREE.Object3D[]): void {
		this.lines = this.lines.filter((item: any) => {
			if (objs.indexOf(item.obj) != -1) {
				DisposeTooler.clear(item.line);
				return false;
			}
			return true;
		})
	}

	deleteSelected():void{
		this.lines.forEach((item: any) => {
			DisposeTooler.clear(item.obj);
			DisposeTooler.clear(item.line);
			if(item.obj.name == "custom drag"){
				DisposeTooler.clear(item.obj.parent);
			}
		})
		this.lines = [];
	}

	select(obj: THREE.Object3D): void {
		if (!this.multiple) {
			this.clear();
		}
		this.addNewLine(obj);
	}

	update(): void {
		this.lines.forEach((item: any) => {
			item.line.position.copy(item.obj.position);
			item.line.update();
		})
	}

	getBSPObjects():Array<any>|null{
		let list = this.lines.map((item: any) => {
			return item.obj;
		})
		if(list && list.length == 2){
			return list;
		}
		return null;
	}

	getSelectItems():Array<THREE.Object3D>{
		return this.lines.map((item: any) => {
			return item.obj;
		})
	}
}