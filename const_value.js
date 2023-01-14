const T = THREE

export const WIDTH = 1280;
export const HEIGHT = 720;
export const BOX_SIZE = 30;

export const BODY_MATERIAL = new T.MeshStandardMaterial({
    color: 0xd6a249,
});
export const FACE_MATERIAL = new T.MeshStandardMaterial({
    color: 0xff4444,
    emissive: 0x883333
});
export const EAR_MATERIAL = new T.MeshStandardMaterial({
    color: 0xffff44,
    emissive: 0x888833
});
export const WALL_MATERIAL = new T.MeshStandardMaterial({
    color: 0x444444
});
export const FLOOR_MATERIAL = new T.MeshStandardMaterial({
    color: 0x111111
});
export const FLOOR_START_MATERIAL = new T.MeshStandardMaterial({
    color: 0x191970
});
export const FLOOR_GOAL_MATERIAL = new T.MeshStandardMaterial({
    color: 0x8b0000
});