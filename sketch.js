const CWIDTH = 800;
const CHEIGHT = 800;

let model;
let predictions = [];
let video;

let configParams = {
    reset: false,

    sphereSize: 85,
    sphereSizeMin: 10,
    sphereSizeMax: 200,
    sphereSizeStep: 1,

    worldScaleFactor: 3,
    worldScaleFactorMin: 0.1,
    worldScaleFactorMax: 10,
    worldScaleFactorStep: 0.1,

}


MAX_HANDS = 10;
// curr time in seconds
let time = 0;
PREP_WINDOW = 10;
let coordinator;

let clockRotation = 0;

// Light settings
let lightPos;
let spotLightPos;
let lightDir;

// Textures
let carpetTexture;
let rugTexture;
let ceilingTexture;
let nighttimeviewTexture;
let clockTexture;
let clockHandTexture;

// sounds
let clockTickSound;
let shutterSound;
let dreamscapeSound;

let room;
let shadowStore;

const posterAspect = 0.71;
const textureMap = new Map();

// Room Sizing (MANUAL, will be overwritten)
let ROOM_WIDTH = 1250; // Half the width of the room
let ROOM_HEIGHT = 850; // Half the height of the room
let ROOM_DEPTH = 1500; // Actual depth of the room

// Video and world scaling
let worldParams;
// Live hand buffer
let liveHandBuffer;
// Imprint buffer for old hand shadows
let imprintBuffer;



function preload() {
    wallpaperImage = loadImage("data/images/starwallpaper.jpg");
    carpetTexture = loadImage("data/images/carpettexture.png");
    rugTexture = loadImage("data/images/rugtexture.png");
    ceilingTexture = loadImage("data/images/ceilingtexture.png");
    nighttimeviewTexture = loadImage("data/images/nighttexture.png");
    clockTexture = loadImage("data/images/clock.png");
    clockHandTexture = loadImage("data/images/clockhand.png");

    textureMap.set("wallpaper", wallpaperImage);
    textureMap.set("carpet", carpetTexture);
    textureMap.set("rug", rugTexture);
    textureMap.set("ceiling", ceilingTexture);
    textureMap.set("night", nighttimeviewTexture);
    textureMap.set("clock", clockTexture);
    textureMap.set("clockhand", clockHandTexture);


    clockTickSound = loadSound("data/sound/clockticktrimmed.mp3");
    shutterSound = loadSound("data/sound/shutter.mp3");
    dreamscapeSound = loadSound("data/sound/dreamscape.mp3");

    model = ml5.handPose({ flipped: true, maxHands: 2, modelType: "full" });

}

function setup() {
    ROOM_WIDTH = windowWidth * 0.95;
    ROOM_HEIGHT = windowWidth * 0.70;
    ROOM_DEPTH = windowWidth * 1.85;

    shutterSound.setVolume(0.2);
    clockTickSound.setVolume(0.4);
    dreamscapeSound.setVolume(0.05);
    dreamscapeSound.loop();


    const videoWidth = 640;
    const videoHeight = 480;
    const videoCenterX = videoWidth / 2;
    const videoCenterY = videoHeight / 2;
    const worldScaleX = (ROOM_WIDTH / configParams.worldScaleFactor) / videoWidth;
    const worldScaleY = (ROOM_HEIGHT / configParams.worldScaleFactor) / videoHeight;
    worldParams = {
        videoWidth: videoWidth,
        videoHeight: videoHeight,
        videoCenterX: videoCenterX,
        videoCenterY: videoCenterY,
        worldScaleX: worldScaleX,
        worldScaleY: worldScaleY,
        sphereSize: configParams.sphereSize
    }


    room = new Room(ROOM_WIDTH, ROOM_HEIGHT, ROOM_DEPTH, textureMap);
    coordinator = new Coordinator(PREP_WINDOW, 3, prepTrigger, warnTrigger)


    createSettingsGui(configParams, { callback: paramChanged, load: false });

    createCanvas(windowWidth, windowHeight, WEBGL);
    frameRate(24)
    liveHandBuffer= createGraphics(width, height, WEBGL);
    imprintBuffer = createGraphics(width, height, WEBGL);

    shadowStore = new ShadowStore(10, room, worldParams, imprintBuffer);

    video = createCapture(VIDEO, { flipped: true });
    video.size(videoWidth, videoHeight);
    video.hide();
    model.detectStart(video, (results) => { predictions = results; });

    // Behind viewer and in roughly middle height. Used for shadow casting.
    lightPos = createVector(0, 0, 350);
    spotLightPos = createVector(0, ROOM_HEIGHT - 10, 200);
    lightDir = createVector(0, -1, -0.3);

    // Load pixels for bump mapping
    carpetTexture.loadPixels();
    rugTexture.loadPixels();
    ceilingTexture.loadPixels();
}

// Runs every frame before draw
function update() {
    coordinator.update(deltaTime);
    // Update clock rotation
    clockRotation = coordinator.getProgress() * 2 * PI;
    room.clockPosition = clockRotation;

}

function draw() {
    update();

    noStroke();
    noCursor();
    background(10);

    // camera setup
    camera(0, 0, 600, 0, 0, 0, 0, 1, 0);
    perspective(PI / 3, windowWidth / windowHeight, 0.1, 10000);
    // base lighting + shadow light source
    ambientLight(60);
    // spotlight for added ambiance
    spotLight(255, 180, 110, spotLightPos, lightDir, PI / 2, 1);

    // Draw room
    room.draw();
    shadowStore.draw();

    // hand drawing
    if (predictions.length > 0) {
        for (prediction of predictions) {
            drawHandToBuffer(prediction.keypoints, room, worldParams, liveHandBuffer, false);
        }

        // Draw to canvas after hands have been drawn to buffer
        push();
        blendMode(MULTIPLY);
        tint(0, 0, 0, 190)
        image(liveHandBuffer, - width / 2, - height / 2, width, height);
        blendMode(BLEND);
        liveHandBuffer.clear();
        pop();
    }


}



function paramChanged(name) {
    if (name === "worldScaleFactor") {
        worldParams.worldScaleX = (ROOM_WIDTH / configParams.worldScaleFactor) / worldParams.videoWidth;
        worldParams.worldScaleY = (ROOM_HEIGHT / configParams.worldScaleFactor) / worldParams.videoHeight;
    }
    if (name === "sphereSize") {
        worldParams.sphereSize = configParams.sphereSize;
    }
}



function prepTrigger() {
    console.log("Prep window started, last prep window ended")
    shutterSound.play();
    shadowStore.addShadow(predictions);
}


function warnTrigger() {
    console.log("Warn function triggered")
    clockTickSound.play();
}


function mousePressed() {
    console.log("Shadows cleared")
    if (mouseButton === LEFT) {
        shadowStore.clear();
    }
}
