import * as C from "./const_value.js"

const T = THREE

class Model {
    /**
     * 
     * @param {THREE.Mesh} mesh 
     * @param  {Array<[string, THREE.Mesh | THREE.Group]>} args
     */
    constructor(mesh, ...args) {
        /**
         * @type {THREE.Mesh}
         */
        this.o = mesh;
        args.forEach(c => {
            this[c[0]] = new Model(c[1]);
        })
    }

    /**
     * 
     * @param {string} name 
     * @param {Model} model
     */
    addChildren(name, model) {
        this.o.add(model.o);
        this[name] = model;
    }
}

function rec_loadModel(robot_data) {
    var mesh;
    switch (robot_data.type) {
        case "Mesh":
            var geometry;
            switch (robot_data.geometry) {
                case "Box":
                    geometry = new T.BoxGeometry(...robot_data.args);
                    break;
                case "Sphere":
                    geometry = new T.SphereGeometry(...robot_data.args);
                    break;
                case "Cylinder":
                    geometry = new T.CylinderGeometry(...robot_data.args);
                    break;
                default:
                    throw 'Geometry type "' + robot_data.geometry + '" is not defined!';
            }
            var material;
            switch (robot_data.material) {
                case "Body":
                    material = C.BODY_MATERIAL;
                    break;
                case "FaceParts":
                    material = C.FACE_MATERIAL;
                    break;
                case "Ear":
                    material = C.EAR_MATERIAL;
                    break;
                default:
                    throw 'Marerial type "' + robot_data.material + '" is not defined!';
            }

            mesh = new T.Mesh(geometry, material);
            break;
        case "Group":
            mesh = new T.Group();
            break;
    }
            
    if (robot_data.posision != undefined)
        mesh.position.set(...robot_data.posision);
    if (robot_data.rotation != undefined)
        mesh.rotation.set(...robot_data.rotation);
        
    const model = new Model(mesh);
    if (robot_data.children != undefined)
        Object.keys(robot_data.children).forEach(k => {
            if (k == "o") throw 'model key "o" is not allow!';
            const child_model = rec_loadModel(robot_data.children[k]);
            model.addChildren(k, child_model);
        });

    return model
}

export function loadModel_str(json_str) {
    const robot_data = JSON.parse(json_str);
    return rec_loadModel(robot_data);
}

export function loadModel_obj(obj) {
    return rec_loadModel(obj);
}