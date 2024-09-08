import { userLocationObject } from "../interface/userLocationObject";

const defaultLocation:userLocationObject={
    timestamp:Date.now(),
    coords:{ 
        //mount everest co-ordinates
        latitude: 27.9881,
        longitude: 86.9250,
    },
    isDefault:'default'
}

const smallMapHeight = '400px';
const bigMapHeight ='80vh';


export{defaultLocation,smallMapHeight,bigMapHeight}