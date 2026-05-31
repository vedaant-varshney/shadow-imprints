/**
 * Stores shadow imprints and handles drawing and buffer coordination 
 */
class ShadowStore {

    constructor(maxShadows, room, worldParams, buffer) {
        this.maxShadows = maxShadows;
        this.room = room;
        this.worldParams = worldParams;
        this.buffer = buffer;

        // fifo shadow
        this.shadowSnapshots = [];
    }

    draw() {
        if (this.shadowSnapshots.length === 0) {
            return;
        }
        push();
        // Draw hand shadows on main canvas
        tint(0, 0, 0, 190)
        push()
        image(this.buffer, - width / 2, - height / 2, width, height);
        pop();
        pop();
    }

    addShadow(predictions) {
        this.shadowSnapshots.push(predictions);
        if (this.shadowSnapshots.length > this.maxShadows) {
            this.shadowSnapshots.shift();
        }
        this.refreshBuf();

    }

    /**
     * Redraw shadow buffer
     */
    refreshBuf() {
        console.log(this.shadowSnapshots)
        this.buffer.clear();
        for (let shadow of this.shadowSnapshots) {
            for (let handK of shadow) {
                drawHandToBuffer(handK.keypoints, this.room, this.worldParams, this.buffer, false);
            }
        }
    }

    /**
     * Clear shadow state for easy refresh mechanic
     */
    clear() {
        this.shadowSnapshots = [];
        this.buffer.clear();
    }
}

// Finger keypoints associated with certain elements to draw
const fingerConnections = [
    [0, 1, 2, 3, 4], // wrist + thumb points
    [0, 5, 6, 7, 8], // wrist + index finger
    [0, 9, 10, 11, 12], // wrist + middle finger
    [0, 13, 14, 15, 16], // wrist + ring finger
    [0, 17, 18, 19, 20], // wrist + pinky finger
    [0, 2, 5, 9, 13, 17] // palm enclosing points
];


/**
 * Draws hand given keypoints, room reference, and worldparams
 * @param {*} keypoints2D  2D Keypoints from model
 * @param {*} keypoints3D  3D Keypoints fro model
 * @param {*} room room object
 * @param {*} worldParams information on videoCenter and worldScale
 * @param {*} canv buffer to populate
 * @param {*} clearBuf boolean to determine if to clear the buffer before drawing
 */
function drawHandToBuffer(keypoints2D, room, worldParams, canv, clearBuf = true) {

    if (clearBuf) {
        canv.clear();
    }
    canv.fill("black")

    const worldKeypoints = [];
    for (let i = 0; i < keypoints2D.length; i++) {
        const p2d = keypoints2D[i];
        // Center and scale
        const worldX = (p2d.x - worldParams.videoCenterX) * worldParams.worldScaleX;
        const worldY = (p2d.y - worldParams.videoCenterY) * worldParams.worldScaleY;
        // Assume all hand segments are positioned at z = 0
        const worldZ = 0;
        worldKeypoints.push(createVector(worldX, worldY, worldZ));
    }

    const sphereSize = worldParams.sphereSize;


    // draw fingers
    fingerConnections.forEach(connection => {
        for (let i = 0; i < connection.length - 1; i++) {
            let v1 = worldKeypoints[connection[i]];
            let v2 = worldKeypoints[connection[i + 1]];

            const numSegments = 8;
            for (let j = 0; j < numSegments; j++) {
                // world coordinate base hand segment endpoints
                const segv1 = p5.Vector.lerp(v1, v2, j / numSegments);
                const segv2 = p5.Vector.lerp(v1, v2, (j + 1) / numSegments);

                // Shadow cast endpoints
                let s1 = room.roomShadowCast(segv1, lightPos);
                let s2 = room.roomShadowCast(segv2, lightPos);

                // Only draw if both points exist
                if (s1 && s2) {
                    canv.push()
                    canv.translate(s1.x, s1.y, s1.z)
                    canv.sphere(sphereSize, 5, 5);
                    canv.pop()
                }
            }
        }
    });

    // palm area
    canv.push();
    canv.beginShape();
    for (let i = 0; i < fingerConnections[5].length; i++) {
        let v1 = worldKeypoints[fingerConnections[5][i]];
        let s1 = room.roomShadowCast(v1, lightPos);
        canv.vertex(s1.x, s1.y, s1.z)
    }
    canv.endShape();

    canv.pop();


}

