import { Ease } from "./ease.js"
import { loadModel_obj } from "./model_loader.js"
const T = THREE

export class Robot {
    constructor() {
        this.provideMaterials();
    }

    provideMaterials() {
    }

    loadBody(path) {
        // this.head = this.create_base(new T.Mesh(new T.BoxGeometry(20, 16, 16), this.bodyMat),
        //                              new T.Vector3(0, -8, 0));
        
        this.PARENT = new T.Group();
        return new Promise(resolve => {
            fetch(path)
                .then(res => res.json())
                .then(data => {
                    this.model = loadModel_obj(data);
                    this.model = loadModel_obj(data);
                    this.PARENT.add(this.model.o);
                    // console.log(data)
                    resolve();
                });
        })
    }

    /**
     * 
     * @param {THREE.Mesh} mesh 
     * @param {THREE.Vector3} anchor 
     */
    create_base(mesh, anchor) {
        const group = new T.Group();
        mesh.position.set(
            -anchor.x,
            -anchor.y,
            -anchor.z
        );
        group.add(mesh);

        return group;
    }

    wark(phase) {
        this.stand_phase = 1;
        this.model.body.spine.arm_l.o.rotation.x = Math.sin(phase * 2 * Math.PI);
        this.model.body.spine.arm_r.o.rotation.x = -Math.sin(phase * 2 * Math.PI);
        this.model.thigh_l.o.rotation.x = -Math.sin(phase * 2 * Math.PI);
        this.model.thigh_r.o.rotation.x = Math.sin(phase * 2 * Math.PI);
    }

    jump(phase) {
        this.stand_phase = 1;
        if (phase < 0.5) {
            this.model.body.spine.arm_l.o.rotation.x = Ease.OutQuint(phase / 0.5, -1, Math.PI)
            this.model.body.spine.arm_r.o.rotation.x = Ease.OutQuint(phase / 0.5, -1, Math.PI)
            this.model.body.o.rotation.x = Ease.OutCubic(phase / 0.5, -0.5, 0);
        } else {
            this.model.body.spine.arm_l.o.rotation.x = Ease.InQuint((phase - 0.5) / 0.5, Math.PI, Math.PI / 2)
            this.model.body.spine.arm_r.o.rotation.x = Ease.InQuint((phase - 0.5) / 0.5, Math.PI, Math.PI / 2)
            this.model.body.o.rotation.x = Ease.InCubic((phase - 0.5) / 0.5, 0, -0.5);
        }
    }

    stand() {
        this.start_arm_l_rotation_x = this.model.body.spine.arm_l.o.rotation.x;
        this.start_arm_r_rotation_x = this.model.body.spine.arm_r.o.rotation.x;
        this.start_thigh_l_rotation_x = this.model.thigh_l.o.rotation.x;
        this.start_thigh_r_rotation_x = this.model.thigh_r.o.rotation.x;
        // this.start_body_rotation_x = this.model.body.o.rotation.x;
        this.stand_phase = 0;
        this.stand_animation();
    }

    stand_animation() {
        this.model.body.spine.arm_l.o.rotation.x = Ease.InOutSine(this.stand_phase, this.start_arm_l_rotation_x, 0);
        this.model.body.spine.arm_r.o.rotation.x = Ease.InOutSine(this.stand_phase, this.start_arm_r_rotation_x, 0);
        this.model.thigh_l.o.rotation.x = Ease.InOutSine(this.stand_phase, this.start_thigh_l_rotation_x, 0);
        this.model.thigh_r.o.rotation.x = Ease.InOutSine(this.stand_phase, this.start_thigh_r_rotation_x, 0);
        // this.model.body.o.rotation.x = Ease.InOutSine(this.stand_phase, this.start_body_rotation_x, 0);
        this.stand_phase += 0.05;
        if (this.stand_phase < 1) requestAnimationFrame(this.stand_animation.bind(this));
    }

    fall() {
        this.start_arm_l_rotation_x = this.model.body.spine.arm_l.o.rotation.x;
        this.start_arm_r_rotation_x = this.model.body.spine.arm_r.o.rotation.x;
        this.start_thigh_l_rotation_x = this.model.thigh_l.o.rotation.x;
        this.start_thigh_r_rotation_x = this.model.thigh_r.o.rotation.x;
        // this.start_body_rotation_x = this.model.body.o.rotation.x;
        this.stand_phase = 0;
        this.fall_animation();
    }

    fall_animation() {
        this.model.body.spine.arm_l.o.rotation.x = Ease.InOutSine(this.stand_phase, this.start_arm_l_rotation_x, Math.PI);
        this.model.body.spine.arm_r.o.rotation.x = Ease.InOutSine(this.stand_phase, this.start_arm_r_rotation_x, Math.PI);
        this.model.thigh_l.o.rotation.x = Ease.InOutSine(this.stand_phase, this.start_thigh_l_rotation_x, 0);
        this.model.thigh_r.o.rotation.x = Ease.InOutSine(this.stand_phase, this.start_thigh_r_rotation_x, 0);
        // this.model.body.o.rotation.x = Ease.InOutSine(this.stand_phase, this.start_body_rotation_x, 0);
        this.stand_phase += 0.05;
        if (this.stand_phase < 1) requestAnimationFrame(this.fall_animation.bind(this));
    }
}