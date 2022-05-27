// ********************************
// BACKGROUND SUBTRACTION EXAMPLE *
// ********************************
var video;
var prevImg;
var diffImg;
var currImg;
var thresholdSlider;
var threshold;
var grid;

function setup() {
    createCanvas(640 * 2, 480);
    pixelDensity(1);
    video = createCapture(VIDEO);
    video.hide();

    thresholdSlider = createSlider(0, 255, 50);
    thresholdSlider.position(20, 20);
    grid = new Grid(640, 480);
}

function draw() {
    background(0);
    image(invertFilter(video), 0, 0);

    currImg = createImage(video.width, video.height);
    currImg.copy(video, 0, 0, video.width, video.height, 0, 0, video.width, video.height);
    currImg.resize(currImg.width / 4, currImg.height / 4);
    currImg.filter(BLUR, 3);

    diffImg = createImage(video.width, video.height);
    diffImg.resize(diffImg.width / 4, diffImg.height / 4);
    diffImg.loadPixels();

    threshold = thresholdSlider.value();

    if (typeof prevImg !== 'undefined') {
        prevImg.loadPixels();
        currImg.loadPixels();
        for (var x = 0; x < currImg.width; x += 1) {
            for (var y = 0; y < currImg.height; y += 1) {
                var index = (x + (y * currImg.width)) * 4;
                var redSource = currImg.pixels[index + 0];
                var greenSource = currImg.pixels[index + 1];
                var blueSource = currImg.pixels[index + 2];

                var redBack = prevImg.pixels[index + 0];
                var greenBack = prevImg.pixels[index + 1];
                var blueBack = prevImg.pixels[index + 2];

                var d = dist(redSource, greenSource, blueSource, redBack, greenBack, blueBack);

                if (d > threshold) {
                    diffImg.pixels[index + 0] = 0;
                    diffImg.pixels[index + 1] = 0;
                    diffImg.pixels[index + 2] = 0;
                    diffImg.pixels[index + 3] = 255;
                } else {
                    diffImg.pixels[index + 0] = 255;
                    diffImg.pixels[index + 1] = 255;
                    diffImg.pixels[index + 2] = 255;
                    diffImg.pixels[index + 3] = 255;
                }
            }
        }
    }
    diffImg.updatePixels();
    image(diffImg, 640, 0);

    noFill();
    stroke(255);
    text(threshold, 160, 35);

    prevImg = createImage(currImg.width, currImg.height);
    prevImg.copy(currImg, 0, 0, currImg.width, currImg.height, 0, 0, currImg.width, currImg.height);
    console.log("saved new background");

    grid.run(diffImg);
}

function keyPressed() {

}

// faster method for calculating color similarity which does not calculate root.
// Only needed if dist() runs slow
function distSquared(x1, y1, z1, x2, y2, z2) {
    var d = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1) + (z2 - z1) * (z2 - z1);
    return d;
}


function invertFilter(img) {
    imgOut = createImage(img.width, img.height);

    imgOut.loadPixels();
    img.loadPixels();

    for (var x = 0; x < imgOut.width; x++) {
        for (var y = 0; y < imgOut.height; y++) {

            var index = (x + y * imgOut.width) * 4;

            var r = 255 - img.pixels[index + 0];
            var g = 255 - img.pixels[index + 1];
            var b = 255 - img.pixels[index + 2];

            imgOut.pixels[index + 0] = r;
            imgOut.pixels[index + 1] = g;
            imgOut.pixels[index + 2] = b;
            imgOut.pixels[index + 3] = 255;
        }
    }
    imgOut.updatePixels();
    return imgOut;
}
