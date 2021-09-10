import {H5EventDispatcher} from 'jsz-event';

export default class EventCenter extends H5EventDispatcher{

    static _instance:EventCenter;
   
    constructor(key:Key){
        super();
    }

    static get instance():EventCenter{
        if(!this._instance){
            this._instance = new EventCenter(new Key);
        }
        return this._instance;
    }
}

class Key{

}