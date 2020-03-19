var canvas = document.getElementById("breakout_canvas");
var context = canvas.getContext("2d");
var running = true;

const SECOND = 1000;
const TARGET_FPS = 60.0;
const FRAME_TIME = SECOND / TARGET_FPS;
const UPDATE_TIME = SECOND / 60.0;
var before_time = (new Date).getTime();
var before_sec = before_time;
var frames = 0;
var fps = 0;

setInterval(run, 0);
setInterval(render, FRAME_TIME);

var ball_x = 20;

function run(){

    var current_time = (new Date).getTime();
    var delta = (current_time - before_time) / UPDATE_TIME;
    before_time = (new Date).getTime();

    update(delta);

    if(current_time - before_sec >= SECOND){

        before_sec += SECOND;
        fps = frames;
        frames = 0;
        console.log("FPS: " + fps);
    }
}

function render(){

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.rect(ball_x, 40, 50, 50);
    context.fillStyle = "#ff0000";
    context.fill();
    context.closePath();

    frames++;
}

function update(delta){

    ball_x += 1 * delta;
}
