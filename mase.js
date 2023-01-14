import * as C from "./const_value.js"
const T = THREE

function make_hole(array, x, y, path_width) {
    const floor_half_path_width = Math.floor(path_width / 2)
    for (var i = x - floor_half_path_width; i < x + floor_half_path_width + 1; i++) {
        for (var j = y - floor_half_path_width; j < y + floor_half_path_width + 1; j++) {
            array[j][i] = 0
        }
    }
}

function remove_wall(array, x, y, direction, path_width) {
    const floor_half_path_width = Math.floor(path_width / 2)
    if (direction == 0) {
        for (var i = 0; i < path_width; i++) {
            array[y - floor_half_path_width + i][x + floor_half_path_width + 1] = 0
        }
    } else if (direction == 1) {
        for (var i = 0; i < path_width; i++) {
            array[y - floor_half_path_width + i][x - floor_half_path_width - 1] = 0
        }
    } else if (direction == 2) {
        for (var i = 0; i < path_width; i++) {
            array[y + floor_half_path_width + 1][x - floor_half_path_width + i] = 0
        }
    } else {
        for (var i = 0; i < path_width; i++) {
            array[y - floor_half_path_width - 1][x - floor_half_path_width + i] = 0
        }
    }
}

function getdigabbleDirection(array, x, y, path_width) {
    var digabbleDirection = []
    if (array[y][x + path_width + 1] == 1) {
        digabbleDirection.push(0)
    }
    if (array[y][x - path_width - 1] == 1) {
        digabbleDirection.push(1)
    }
    if (array[y + path_width + 1][x] == 1) {
        digabbleDirection.push(2)
    }digabbleDirection
    if (array[y - path_width - 1][x] == 1) {
        digabbleDirection.push(3)
    }

    return digabbleDirection
}

function dig(array, x, y, path_width, isMakeGoal) {
    if (isMakeGoal == undefined) {
        isMakeGoal = true
    }
    while (true) {
        const digabbleDirection = getdigabbleDirection(array, x, y, path_width)
        if (digabbleDirection.length == 0) {
            if (isMakeGoal) {
                array[y][x] = 3
            }
            break
        }

        const direction = digabbleDirection[Math.floor(Math.random() * digabbleDirection.length)]
        var next_x, next_y
        if (direction == 0) {
            [next_x, next_y] = [x + path_width + 1, y]
        } else if (direction == 1) {
            [next_x, next_y] = [x - path_width - 1, y]
        } else if (direction == 2) {
            [next_x, next_y] = [x, y + path_width + 1]
        } else {
            [next_x, next_y] = [x, y - path_width - 1]
        }

        remove_wall(array, x, y, direction, path_width)
        make_hole(array, next_x, next_y, path_width)
        dig(array, next_x, next_y, path_width, isMakeGoal)

        isMakeGoal = false
    }
}

/**
 * 
 * @param {Int} width 
 * @param {Int} height 
 * @param {Int} path_width 
 * @returns {Array<Array<Int>>}
 */
export function generate_mase(width, height, path_width) {
    const width2 = width * (path_width + 1) + path_width + 2
    const height2 = height * (path_width + 1) + path_width + 2

    var array = new Array(height2)
    for (var i = 0; i < height2; i++) {
        var row = new Array(width2)
        for (var j = 0; j < width2; j++) {
            row[j] = 1
        }
        array[i] = row
    }

    for (var i = 0; i < width2; i++) {
        array[0][i] = 0
        array[height2 - 1][i] = 0
    }
    for (var i = 0; i < height2; i++) {
        array[i][0] = 0
        array[i][width2 - 1] = 0
    }

    const start_x = (Math.floor(Math.random() * width) + 1) * (path_width + 1)
    const start_y = (Math.floor(Math.random() * height) + 1) * (path_width + 1)
    make_hole(array, start_x, start_y, path_width)
    array[start_y][start_x] = 2

    dig(array, start_x, start_y, path_width)

    return array
}

export function generate_mase_text(width, height, path_width) {
    var mase_text = ''
    generate_mase(width, height, path_width).forEach(row => {
        row.forEach(c => {
            if (c == 1) {
                mase_text += ('@')
            }
            else if (c == 2) {
                mase_text += ('s')
            }
            else if (c == 3) {
                mase_text += ('g')
            } else {
                mase_text += (' ')
            }
        })
        mase_text += ('\n')
    })

    return mase_text
}

export class Mase {
    /**
     * 
     * @param {THREE.Scene} scene 
     */
    constructor(scene) {
        this.scene = scene;
    }

    /**
     * 
     * @param {String} text 
     * @returns {int[][]} map
     */
    loadMapFromText(text) {
        var x = 0;
        var z = 0;
        var x_max = 0;
        var z_max = 0;
        var map = [[]];
        const walls = new T.Group()
        const floors = new T.Group()
        console.log(text.length)
        for (var i = 0; i < text.length; i++) {
            const c = text[i]
            if (c == "@") {
                map[z].push(1);
                const geometry = new T.BoxGeometry(C.BOX_SIZE, 80, C.BOX_SIZE);
                const mesh = new T.Mesh(geometry, C.WALL_MATERIAL);
                mesh.position.set(x * C.BOX_SIZE, 40, z * C.BOX_SIZE);
                walls.add(mesh);
            } else if (c == "s") {
                const geometry = new T.PlaneGeometry(C.BOX_SIZE, C.BOX_SIZE);
                const mesh = new T.Mesh(geometry, C.FLOOR_START_MATERIAL);
                mesh.rotateX(- Math.PI / 2);
                mesh.position.set(x * C.BOX_SIZE, 0.2, z * C.BOX_SIZE)
                floors.add(mesh);
                map[z].push(2);
            } else if (c == "g") {
                const geometry = new T.PlaneGeometry(C.BOX_SIZE, C.BOX_SIZE);
                const mesh = new T.Mesh(geometry, C.FLOOR_GOAL_MATERIAL);
                mesh.rotateX(- Math.PI / 2);
                mesh.position.set(x * C.BOX_SIZE, 0.2, z * C.BOX_SIZE)
                floors.add(mesh);
                map[z].push(3);
            } else if (c != "\n"){
                map[z].push(0);
            }

            if (x > x_max) {
                x_max = x;
            }
            x += 1;
            if (c == "\n") {
                x = 0;
                z += 1;
                if (z > z_max) {
                    z_max = z;
                }
                map.push([]);
            }
        }
        const geometry = new T.PlaneGeometry(x_max * C.BOX_SIZE, z_max * C.BOX_SIZE);
        const mesh = new T.Mesh(geometry, C.FLOOR_MATERIAL);
        mesh.rotateX(- Math.PI / 2);
        mesh.position.set((x_max - 1) * C.BOX_SIZE / 2, 0, (z_max - 1) * C.BOX_SIZE / 2)
        floors.add(mesh);

        this.scene.add(walls)
        this.scene.add(floors)

        return [map, walls, floors]
    }

    /**
     * @returns {Promise<int[][]>} robot_start_pos
     */
    async loadMap(path) {
        
        return new Promise(resolve => {
            fetch(path)
                .then(res => res.text())
                .then(text => {
                    resolve(this.loadMapFromText(text));
                });
        })
    }

    /**
     * @returns {int[][]} robot_start_pos
     */
    loadMapText(text) {
        return this.loadMapFromText(text)
    }
}