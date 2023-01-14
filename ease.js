export class Ease {
    /** @param {Number} x @param {Number} from @param {Number} to @returns {Number} */
    static Linear     = (x, from, to) => x                                          * (to - from) + from;

    /** @param {Number} x @param {Number} from @param {Number} to @returns {Number} */
    static InSine     = (x, from, to) => (1 - Math.cos((x * Math.PI) / 2))          * (to - from) + from;
    /** @param {Number} x @param {Number} from @param {Number} to @returns {Number} */
    static OutSine    = (x, from, to) => (Math.sin((x * Math.PI) / 2))              * (to - from) + from;
    /** @param {Number} x @param {Number} from @param {Number} to @returns {Number} */
    static InOutSine  = (x, from, to) => (-(Math.cos(Math.PI * x) - 1) / 2)         * (to - from) + from;

    /** @param {Number} x @param {Number} from @param {Number} to @returns {Number} */
    static InQuad     = (x, from, to) => (x*x)                                      * (to - from) + from;
    /** @param {Number} x @param {Number} from @param {Number} to @returns {Number} */
    static OutQuad    = (x, from, to) => (x*(2-x))                                  * (to - from) + from;
    /** @param {Number} x @param {Number} from @param {Number} to @returns {Number} */
    static InOutQuad  = (x, from, to) => (x<.5 ? 2*x*x : -1+(4-2*x)*x)              * (to - from) + from;

    /** @param {Number} x @param {Number} from @param {Number} to @returns {Number} */
    static InCubic    = (x, from, to) => (x*x*x)                                    * (to - from) + from;
    /** @param {Number} x @param {Number} from @param {Number} to @returns {Number} */
    static OutCubic   = (x, from, to) => ((--x)*x*x+1)                              * (to - from) + from;
    /** @param {Number} x @param {Number} from @param {Number} to @returns {Number} */
    static InOutCubic = (x, from, to) => (x<.5 ? 4*x*x*x : (x-1)*(2*x-2)*(2*x-2)+1) * (to - from) + from;

    /** @param {Number} x @param {Number} from @param {Number} to @returns {Number} */
    static InQuart    = (x, from, to) => (x*x*x*x)                                  * (to - from) + from;
    /** @param {Number} x @param {Number} from @param {Number} to @returns {Number} */
    static OutQuart   = (x, from, to) => (1-(--x)*x*x*x)                            * (to - from) + from;
    /** @param {Number} x @param {Number} from @param {Number} to @returns {Number} */
    static InOutQuart = (x, from, to) => (x<.5 ? 8*x*x*x*x : 1-8*(--x)*x*x*x)       * (to - from) + from;

    /** @param {Number} x @param {Number} from @param {Number} to @returns {Number} */
    static InQuint    = (x, from, to) => (x*x*x*x*x)                                * (to - from) + from;
    /** @param {Number} x @param {Number} from @param {Number} to @returns {Number} */
    static OutQuint   = (x, from, to) => (1+(--x)*x*x*x*x)                          * (to - from) + from;
    /** @param {Number} x @param {Number} from @param {Number} to @returns {Number} */
    static InOutQuint = (x, from, to) => (x<.5 ? 16*x*x*x*x*x : 1+16*(--x)*x*x*x*x) * (to - from) + from;
}

export class VectorEase {
    /** @param {Number} x @param {Number} from @param {THREE.Vector3} to @returns {THREE.Vector3} */
    static Linear     = (x, from, to) => to.clone().sub(from).multiplyScalar(x).add(from);

    /** @param {Number} x @param {Number} from @param {Number} to @returns {Number} */
    static InSine     = (x, from, to) => to.clone().sub(from).multiplyScalar((1 - Math.cos((x * Math.PI) / 2))          ).add(from);
    /** @param {Number} x @param {Number} from @param {Number} to @returns {Number} */
    static OutSine    = (x, from, to) => to.clone().sub(from).multiplyScalar((Math.sin((x * Math.PI) / 2))              ).add(from);
    /** @param {Number} x @param {Number} from @param {Number} to @returns {Number} */
    static InOutSine  = (x, from, to) => to.clone().sub(from).multiplyScalar((-(Math.cos(Math.PI * x) - 1) / 2)         ).add(from);

    /** @param {Number} x @param {Number} from @param {Number} to @returns {Number} */
    static InQuad     = (x, from, to) => to.clone().sub(from).multiplyScalar((x*x)                                      ).add(from);
    /** @param {Number} x @param {Number} from @param {Number} to @returns {Number} */
    static OutQuad    = (x, from, to) => to.clone().sub(from).multiplyScalar((x*(2-x))                                  ).add(from);
    /** @param {Number} x @param {Number} from @param {Number} to @returns {Number} */
    static InOutQuad  = (x, from, to) => to.clone().sub(from).multiplyScalar((x<.5 ? 2*x*x : -1+(4-2*x)*x)              ).add(from);

    /** @param {Number} x @param {Number} from @param {Number} to @returns {Number} */
    static InCubic    = (x, from, to) => to.clone().sub(from).multiplyScalar((x*x*x)                                    ).add(from);
    /** @param {Number} x @param {Number} from @param {Number} to @returns {Number} */
    static OutCubic   = (x, from, to) => to.clone().sub(from).multiplyScalar(((--x)*x*x+1)                              ).add(from);
    /** @param {Number} x @param {Number} from @param {Number} to @returns {Number} */
    static InOutCubic = (x, from, to) => to.clone().sub(from).multiplyScalar((x<.5 ? 4*x*x*x : (x-1)*(2*x-2)*(2*x-2)+1) ).add(from);

    /** @param {Number} x @param {Number} from @param {Number} to @returns {Number} */
    static InQuart    = (x, from, to) => to.clone().sub(from).multiplyScalar((x*x*x*x)                                  ).add(from);
    /** @param {Number} x @param {Number} from @param {Number} to @returns {Number} */
    static OutQuart   = (x, from, to) => to.clone().sub(from).multiplyScalar((1-(--x)*x*x*x)                            ).add(from);
    /** @param {Number} x @param {Number} from @param {Number} to @returns {Number} */
    static InOutQuart = (x, from, to) => to.clone().sub(from).multiplyScalar((x<.5 ? 8*x*x*x*x : 1-8*(--x)*x*x*x)       ).add(from);

    /** @param {Number} x @param {Number} from @param {Number} to @returns {Number} */
    static InQuint    = (x, from, to) => to.clone().sub(from).multiplyScalar((x*x*x*x*x)                                ).add(from);
    /** @param {Number} x @param {Number} from @param {Number} to @returns {Number} */
    static OutQuint   = (x, from, to) => to.clone().sub(from).multiplyScalar((1+(--x)*x*x*x*x)                          ).add(from);
    /** @param {Number} x @param {Number} from @param {Number} to @returns {Number} */
    static InOutQuint = (x, from, to) => to.clone().sub(from).multiplyScalar((x<.5 ? 16*x*x*x*x*x : 1+16*(--x)*x*x*x*x) ).add(from);
}