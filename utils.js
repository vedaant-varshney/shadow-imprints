
/**
 * Custom Plane with tile repeat through new uv mapping
 * 
 * @param {*} w  Width of Plane
 * @param {*} h  Height of Plane
 * @param {*} uvx Texture repeats x
 * @param {*} uvy Texture repeats y
 */
function texturedPlane(w, h, uvx = 1, uvy = 1) {
    beginShape(QUADS);
    vertex(-w / 2, -h / 2, 0, 0, 0);
    vertex(w / 2, -h / 2, 0, uvx, 0);
    vertex(w / 2, h / 2, 0, uvx, uvy);
    vertex(-w / 2, h / 2, 0, 0, uvy);
    endShape();
}


/** Coordinates time-based events for the shadow puppets */
class Coordinator {

    /**
     * 
     * @param {*} prepWindow Time in s for prep cycle
     * @param {*} warningOffset Time in s before end of prep window to trigger warning
     * @param {*} prepTrigger Function to call when prep window ends
     * @param {*} warnTrigger Function to call when warning time is reached
     */
    constructor(prepWindow, warningOffset, prepTrigger, warnTrigger) {
        // time in seconds
        this.time = 0;
        this.prepWindow = prepWindow;
        this.warningOffset = warningOffset;
        this.prepTrigger = prepTrigger;
        this.warnTrigger = warnTrigger;
        this.warned = false;
    }

    update(deltaTime) {
        this.time += deltaTime / 1000;

        // Trigger warning prepWindow seconds before end of prep window
        if (this.time > this.prepWindow - this.warningOffset && !this.warned) {
            this.warnTrigger();
            this.warned = true;
        }
        // Trigger rest function at end of prep window
        if (this.time > this.prepWindow) {
            this.prepTrigger();
            this.warned = false;
            this.time = 0;
        }
    }

    getProgress() {
        return this.time / this.prepWindow;
    }


}
