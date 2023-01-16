import { Mase, generate_mase, generate_mase_text } from "./mase.js"
import { Robot } from "./robot.js"
import { VectorEase } from "./ease.js"
import * as C from "./const_value.js"

const T = THREE

var isWalking = false;
var animationPhase = 0;
var robo_direction = 0;
var hint_cam_phase = -1;
var cam_focus_pos;

class Game {
    /**
     * @param {Int} width 
     * @param {Int} height 
     */
    constructor(width, height) {
        this.width = width
        this.height = height
        this.setup();
    }

    setup() {
        this.renderer = new T.WebGLRenderer({
            canvas: document.querySelector("#myCanvas"),
        });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0x44bbff);
    
        this.scene = new T.Scene();

        this.camera = new T.PerspectiveCamera(45, C.WIDTH / C.HEIGHT);
        this.camera.position.set(0, 0, +100);
    }

    render() {
        this.renderer.render(this.scene, this.camera)
    }

    /**
     * 
     * @param {THREE.Vector3} obj_pos 
     */
    camera_focus_to(obj_pos, distance, angle, immediately) {
        const p = new T.Vector3(obj_pos.x, obj_pos.y + Math.sin(angle) * distance, obj_pos.z + Math.cos(angle) * distance)
        console.log(p.z)

        if ((immediately == undefined || immediately == false)
            && cam_state_toggle.checked
            && hint_cam_phase == -1) {
            this.camera.translateX((p.x - this.camera.position.x) / 10);
            this.camera.translateZ((p.z - this.camera.position.z) / 5);
        } else {
            this.camera.position.setX(p.x);
            this.camera.position.setZ(p.z);
        }
        this.camera.position.setY(p.y);

        if (this.camera.position.z < obj_pos.z + (Math.cos(angle) * distance) / 3) {
            this.camera.position.z = obj_pos.z + (Math.cos(angle) * distance) / 3
        }
    }

    camera_lookat(obj_pos) {
        this.camera.lookAt(obj_pos);
    }
}

/**
 * 
 * @param {THREE.Scene} scene 
 */
function addLight(scene) {
    const directionalLight = new THREE.DirectionalLight(0xfff4e6, 1);
    directionalLight.position.set(1, 1, -1);

    const directionalLight2 = new THREE.DirectionalLight(0x007bff, 1);
    directionalLight2.position.set(-1, 1, -1);
    

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);

    scene.add(ambientLight);
    scene.add(directionalLight);
    scene.add(directionalLight2);
}

/**
 * 
 * @param {int[][]} map (0:floor 1:wall 2:start 3:goal)
 * @param {THREE.Vector3} pos 
 */
function collisionCheck(map, pos) {
    for (var z = 0; z < map.length; z++) {
        for (var x = 0; x < map[z].length; x++) {
            if (map[z][x] == 1) {
                if (x * C.BOX_SIZE - C.BOX_SIZE / 2 <= pos.x && pos.x <= x * C.BOX_SIZE + C.BOX_SIZE / 2 &&
                    z * C.BOX_SIZE - C.BOX_SIZE / 2 <= pos.z && pos.z <= z * C.BOX_SIZE + C.BOX_SIZE / 2) {
                    return true
                }
            }
        }
    }
    return false
}

var map, floors, walls
var diff = 1

/**
 * 
 * @param {Game} game 
 * @param {Robot} robot 
 * @param {Mase} mase 
 * @returns {Promise<[THREE.Vector3, THREE.Vector3]>} [start_pos, goal_pos]
 */
function nextStage(game, robot, mase) {
    /** @type {THREE.Vector3} */
    var rob_start_pos;
    /** @type {THREE.Vector3} */
    var rob_goal_pos;

    function loadMap() {
        enableFloor = true;
        robot.stand();
        diff += 1;
        div_mapsize.textContent = diff + ' x ' + diff;
        [map, walls, floors] = mase.loadMapFromText(generate_mase_text(diff, diff, 3));
        for (var z = 0; z < map.length; z++) {
            for (var x = 0; x < map[z].length; x++) {
                if (map[z][x] == 2) {
                    rob_start_pos = new T.Vector3(x * C.BOX_SIZE, 0, z * C.BOX_SIZE);
                }
                if (map[z][x] == 3) {
                    rob_goal_pos = new T.Vector3(x * C.BOX_SIZE, 0, z * C.BOX_SIZE);
                }
            }
        }
        
        robot.model.o.position.set(rob_start_pos.x, rob_start_pos.y, rob_start_pos.z);
        robot.model.o.position.setY(5000)
        next_loading = false
    }

    return new Promise(resolve => {
        if (floors != undefined) {
            robot.fall();
            enableFloor = false
            game.scene.remove(floors)
            setTimeout(() => {
                game.scene.remove(walls)
                loadMap()
                resolve([rob_start_pos, rob_goal_pos])
            }, 1000)
        } else {
            loadMap()
            resolve([rob_start_pos, rob_goal_pos])
        }
    })
}

var enableFloor = true
var next_loading = false

var div_goal_distance = document.getElementById('goal-distance');
var div_mapsize = document.getElementById('mapsize');
var cam_state_toggle = document.getElementById('cam-state-toggle');

async function init() {
    const game = new Game(C.WIDTH, C.HEIGHT);
    const robot = new Robot();
    const mase = new Mase(game.scene);
    const camera_offset = new T.Vector3(0, 30, 0);

    div_goal_distance = document.getElementById('goal-distance');
    div_mapsize = document.getElementById('mapsize');
    cam_state_toggle = document.getElementById('cam-state-toggle');

    await robot.loadBody('robot.json'); // fix

    var [rob_start_pos, rob_goal_pos] = await nextStage(game, robot, mase)

    game.scene.add(robot.PARENT);
    addLight(game.scene);
    game.render();

    // camera_offset.add(robot.model.o.position)

    var jump_phase;
    function jump() {
        robot.jump(jump_phase - Math.floor(jump_phase));
        jump_phase = jump_phase + 0.01;
        if (jump_phase < 1) requestAnimationFrame(jump);
        else robot.stand();
    }


    const speedLimit = 5
    const dashSpeedLimit = 10
    var robo_verocity = new T.Vector3(0, 0, 0);

    var is_move_front = false
    function move_front(v) {
        if (isDash) robo_verocity.setZ(-dashSpeedLimit);
        else robo_verocity.z = -speedLimit;
        if (is_move_front) requestAnimationFrame(() => move_front(v));
    }
    var is_move_back = false
    function move_back(v) {
        if (isDash) robo_verocity.z = dashSpeedLimit;
        else robo_verocity.z = speedLimit;
        if (is_move_back) requestAnimationFrame(() => move_back(v));
    }
    var is_move_left = false
    function move_left(v) {
        if (isDash) robo_verocity.x = -dashSpeedLimit;
        else robo_verocity.x = -speedLimit;
        if (is_move_left) requestAnimationFrame(() => move_left(v));
    }
    var is_move_right = false
    function move_right(v) {
        if (isDash) robo_verocity.x = dashSpeedLimit;
        else robo_verocity.x = speedLimit;
        if (is_move_right) requestAnimationFrame(() => move_right(v));
    }

    function warp_to_start() {
        robot.model.o.position.set(rob_start_pos.x, 0, rob_start_pos.z)
    }

    function hint() {
        console.log('hint')
        hint_cam_phase = 0;
    }
    
    var isDash = false
    document.addEventListener("keydown", event => {
        switch (event.which) {
            case 32:
                jump_phase = 0;
                jump();
                break;
            case 87: // w
                if (!is_move_front) {
                    is_move_front = true;
                    move_front(1);
                }
                break;
            case 65: // a
                if (!is_move_left) {
                    is_move_left = true;
                    move_left(1);
                }
                break;
            case 83: // s
                if (!is_move_back) {
                    is_move_back = true;
                    move_back(1);
                }
                break;
            case 68: // d
                if (!is_move_right) {
                    is_move_right = true;
                    move_right(1);
                }
                break;
            case 13: // Enter
                warp_to_start()
                break;
            case 72: // h
                hint()
                break;
        }
            
        isDash = event.shiftKey
    })

    document.addEventListener("keyup", event => {
        switch (event.which) {
            case 87: // w
                is_move_front = false;
                break;
            case 65: // a
                is_move_left = false;
                break;
            case 83: // s
                is_move_back = false;
                break;
            case 68: // d
                is_move_right = false;
                break;
        }
            
        isDash = event.shiftKey
    })

    async function Update() {
        if (robot.model.o.position.y == -0.1) {
            div_goal_distance.textContent = Math.floor(rob_goal_pos.distanceTo(robot.model.o.position)).toString();
        } else {
            div_goal_distance.textContent = '---'
        }

        // robot.model.o.rotateY(0.01);
        cam_focus_pos = camera_offset.clone().add(robot.model.o.position)
        game.camera_focus_to(camera_offset.clone().add(robot.model.o.position), 300, Math.PI / 3);
        if (hint_cam_phase != -1) {
            if (hint_cam_phase < 0.2) {
                cam_focus_pos = VectorEase.InOutSine(hint_cam_phase / 0.2, cam_focus_pos, rob_goal_pos)
            } else if (hint_cam_phase < 0.8) {
                cam_focus_pos = rob_goal_pos.clone()
            } else if (hint_cam_phase < 1) {
                cam_focus_pos = VectorEase.InOutSine((hint_cam_phase - 0.8) / 0.2, rob_goal_pos, cam_focus_pos)
            }
            
            if (hint_cam_phase > 1) {
                console.log('hint_end')
                hint_cam_phase = -1
            } else {
                hint_cam_phase += 0.005
            }
        }
        game.camera_lookat(cam_focus_pos)
        game.render();

        requestAnimationFrame(Update);

        if (robo_verocity.x < -1) robo_verocity.x += 1
        else if (robo_verocity.x > 1) robo_verocity.x -= 1
        else robo_verocity.x = 0

        if (robo_verocity.z < -1) robo_verocity.z += 1
        else if (robo_verocity.z > 1) robo_verocity.z -= 1
        else robo_verocity.z = 0

        if (enableFloor && robot.model.o.position.y < 0) {
            robo_verocity.y = 0
            robot.model.o.position.setY(-0.1)
        } else {
            robo_verocity.y -= 0.9
        }

        if (Math.abs(robo_verocity.x) > 2)
            if (!collisionCheck(map, robot.model.o.position.clone().add(new T.Vector3(robo_verocity.x, 0, 0))))
                robot.model.o.position.x += robo_verocity.x
            else robo_verocity.x = 0
        if (Math.abs(robo_verocity.z) > 2)
            if (!collisionCheck(map, robot.model.o.position.clone().add(new T.Vector3(0, 0, robo_verocity.z))))
                robot.model.o.position.z += robo_verocity.z
            else robo_verocity.z = 0
        
            if (!isWalking && (Math.abs(robo_verocity.x) > 2 || Math.abs(robo_verocity.z) > 2)) {
                isWalking = true
            } else if (isWalking && (Math.abs(robo_verocity.x) < 2 && Math.abs(robo_verocity.z) < 2)) {
                isWalking = false
                animationPhase = 0
                robot.stand()
            }

            if (isWalking) {
                robot.wark(animationPhase)
                animationPhase = animationPhase + 0.02 - (Math.floor(animationPhase))
            }

        robot.model.o.translateY(robo_verocity.y)
        
        if (robo_verocity.length() > 1) {
            var robo_direction_verocity = ((Math.atan2(robo_verocity.x, robo_verocity.z) + Math.PI) - robo_direction);
            if (robo_direction_verocity > Math.PI) robo_direction_verocity -= 2 * Math.PI;
            else if (robo_direction_verocity < -Math.PI) robo_direction_verocity += 2 * Math.PI;

            robo_direction += robo_direction_verocity / 5

            if (robo_direction > Math.PI) robo_direction -= 2 * Math.PI;
            else if (robo_direction < -Math.PI) robo_direction += 2 * Math.PI;

            robot.model.o.rotation.y = robo_direction
        }

        if (enableFloor && rob_goal_pos.distanceTo(robot.model.o.position) < 15) {
            [rob_start_pos, rob_goal_pos] = await nextStage(game, robot, mase)
            game.camera_focus_to(camera_offset.clone().add(robot.model.o.position), 300, Math.PI / 3, true);
        }
    }

    Update();
}

window.addEventListener("DOMContentLoaded", init);


if (!collisionCheck(map, robot.model.o.position.clone().add(new T.Vector3(0, 0, -v)))) {
    robot.model.o.translateZ(-v);
}