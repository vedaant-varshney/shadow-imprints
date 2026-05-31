
class Room {

    // 0 to 360 deg
    clockPosition = 0;

    constructor(width, height, depth, textureLibrary) {
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.textureLibrary = textureLibrary;
    }

    draw() {
        push();
        noStroke();
        this.drawWalls();
        this.drawSiding();
        this.drawFloor();
        this.drawCeiling();
        this.drawWindow();
        this.drawClock();
        pop();
    }

    drawWalls() {

        const wallpaperTexture = this.textureLibrary.get("wallpaper");

        // Back wall
        push();
        textureWrap(REPEAT)
        textureMode(NORMAL)
        texture(wallpaperTexture);
        translate(0, 0, -this.depth);
        texturedPlane(this.width * 2, this.height * 2, 3, 3);
        pop();

        // Left Wall
        push();
        textureWrap(REPEAT)
        textureMode(NORMAL)
        texture(wallpaperTexture);
        translate(-this.width, 0, -this.depth / 2);
        rotateY(PI / 2);
        texturedPlane(this.depth, this.height * 2, 3, 3);
        pop();

        // Right Wall
        push();
        textureWrap(REPEAT)
        textureMode(NORMAL)
        texture(wallpaperTexture);
        translate(this.width, 0, -this.depth / 2);
        rotateY(-PI / 2);
        texturedPlane(this.depth, this.height * 2, 3, 3);
        pop();


    }

    drawSiding() {
        const sidingHeight = 150;
        const sidingDepth = 50;
        push();

        specularMaterial(255);
        shininess(50);

        // Back wall siding
        push()
        translate(0, this.height - sidingHeight / 2, -this.depth + sidingDepth / 2);
        box(this.width * 2, sidingHeight, sidingDepth)
        pop()

        // Left wall siding
        push()
        translate(-this.width + sidingDepth / 2, this.height - sidingHeight / 2, -this.depth / 2);
        box(sidingDepth, sidingHeight, this.depth)
        pop();

        // Right wall siding
        push()
        translate(this.width - sidingDepth / 2, this.height - sidingHeight / 2, -this.depth / 2);
        box(sidingDepth, sidingHeight, this.depth)
        pop();

        pop();
    }

    drawFloor() {
        const carpetTexture = this.textureLibrary.get("carpet");
        const rugTexture = this.textureLibrary.get("rug");
        push();

        specularMaterial(255);
        shininess(50);
        textureWrap(REPEAT)
        textureMode(NORMAL)

        push();
        texture(carpetTexture);
        translate(0, this.height, -this.depth / 2);
        rotateX(PI / 2);
        texturedPlane(this.width * 2, this.depth, 4, 4);
        pop();

        // Floor Rug
        push();
        texture(rugTexture);
        translate(0, this.height - 45, -this.depth / 2);
        rotateX(PI / 2);
        texturedPlane(this.width, this.width);
        pop();

        pop();


    }

    drawCeiling() {
        this.ceilingTexture = this.textureLibrary.get("ceiling");
        push();
        textureWrap(REPEAT)
        textureMode(NORMAL)
        texture(ceilingTexture)
        translate(0, -this.height, -this.depth / 2);
        rotateX(PI / 2);
        texturedPlane(this.width * 2, this.depth, 4,4 );
        pop();
    }

    drawWindow() {
        // Window on right wall
        const winWidth = this.width * 0.35;
        const winHeight = this.width * 0.4;
        const frameThickness = 20;
        const frameDepth = 40;
        const nighttimeviewTexture = this.textureLibrary.get("night");


        push();
        // Go to right side of wall and reframe rotation
        translate(this.width, 0, -this.depth / 2);
        rotateY(-PI / 2);

        specularMaterial(150);
        shininess(10);

        // Top frame
        push();
        translate(0, -winHeight / 2 - frameThickness / 2, 0);
        box(winWidth, frameThickness, frameDepth);
        pop();

        // Bottom frame (jut out for windowsil)
        push();
        translate(0, winHeight / 2 + frameThickness / 2, 0);
        box(winWidth + frameThickness * 3, frameThickness, frameDepth * 2);
        pop();

        // Left frame
        push();
        translate(-winWidth / 2 - frameThickness / 2, 0, 0);
        box(frameThickness, winHeight + frameThickness * 2, frameDepth);
        pop();

        // Right frame
        push();
        translate(winWidth / 2 + frameThickness / 2, 0, 0);
        box(frameThickness, winHeight + frameThickness * 2, frameDepth);
        pop();

        // Night sky
        push();
        translate(0, 0, 10);
        noStroke();
        texture(nighttimeviewTexture)

        plane(winWidth, winHeight);
        pop();

        pop();

    }

    drawClock() {
        const clockTexture = this.textureLibrary.get("clock");
        const clockHandTexture = this.textureLibrary.get("clockhand");
        const clockSize = this.width * 0.35;

        push();
        // Clock position
        translate(-this.width, 0, -this.depth / 2);
        // Change frame of reference so left wall works like back wall
        rotateY(PI / 2);
        translate(-this.depth * 0.05, -this.height * 0.45, 20);

        // Clock face
        push();
        texture(clockTexture);
        plane(clockSize, clockSize);
        pop();

        // Clock hand
        push();
        const handWidth = clockSize * 0.08;
        const handHeight = clockSize * 0.4;
        // Offset due to "bulb"
        const pivotOffset = 15;

        // bring hand forward to prevent z-fighting
        translate(0, 0, 25);
        rotateZ(this.clockPosition);

        // rotate about bottom edge
        translate(0, -handHeight / 2 + pivotOffset, 0);

        texture(clockHandTexture);
        plane(handWidth, handHeight);
        pop();

        pop();


    }

    roomShadowCast(point, lightPos) {
        let dir = p5.Vector.sub(point, lightPos);
        let closestT = Infinity;
        let options = [];

        // obtain smallest clipping t value across all walls
        // back wall
        if (dir.z < 0) {
            options.push((-this.depth - lightPos.z) / dir.z)
        }
        // floor
        if (dir.y > 0) {
            options.push((this.height - lightPos.y) / dir.y)
        }
        // ceiling
        if (dir.y < 0) {
            options.push((-this.height - lightPos.y) / dir.y)
        }
        // right wall
        if (dir.x > 0) {
            options.push((this.width - lightPos.x) / dir.x)
        }
        // left wall
        if (dir.x < 0) {
            options.push((-this.width - lightPos.x) / dir.x)
        }

        for (let t of options) {
            // t must be positive
            if (t > 0 && t < closestT) {
                closestT = t;
            }
        }

        // Intersection should always be found since hand is in front of light
        if (closestT === Infinity) {
            throw Error("No intersection found");
        }

        let intersectionPoint = p5.Vector.add(lightPos, p5.Vector.mult(dir, closestT));
        return intersectionPoint;

    }


}
