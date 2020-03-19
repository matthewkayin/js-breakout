var canvas = document.getElementById("breakout_canvas");
var context = canvas.getContext("2d");
var running = false;

const SECOND = 1000;
const TARGET_FPS = 60.0;
const FRAME_TIME = SECOND / TARGET_FPS;
const UPDATE_TIME = SECOND / 60.0;
var before_time = (new Date).getTime();
var before_sec = before_time;
var frames = 0;
var fps = 0;

const player_width = 120;
const player_height = 10;
var player_x = (canvas.width / 2) - (player_width / 2);
var player_y = canvas.height - (1.5 * player_height);

var left_down = false;
var right_down = false;
var player_direction = 0;
const PLAYER_SPEED = 3;

const ball_radius = 12;
const BALL_SPEED = 4;
var ball_x = (canvas.width / 2) - ball_radius;
var ball_y = (canvas.height * 0.75) - ball_radius;

var targets = [];
const target_width = 40;
const target_height = 10;
populate_targets();

setInterval(run, 0);
setInterval(render, FRAME_TIME);

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

window.addEventListener('keydown', function(event){

    switch(event.keyCode){

        case 32:
            if(!running){

                start_game();
            }
            break;

        case 37:
            left_down = true;
            player_direction = -1;
            break;

        case 39:
            right_down = true;
            player_direction = 1;
            break;
    }
}, false);

window.addEventListener('keyup', function(event){

    switch(event.keyCode){

        case 37:
            left_down = false;
            if(right_down){

                player_direction = 1;

            }else{

                player_direction = 0;
            }
            break;

        case 39:
            right_down = false;
            if(left_down){

                player_direction = -1;

            }else{

                player_direction = 0;
            }
            break;
    }
});

function populate_targets(){

    targets = [];
    for(var j = 0; j < 7; j++){

        for(var i = 0; i < 9 + (j % 2); i++){

            targets.push([1, 35 - (25 * (j % 2)) + (i * (target_width + 5)), 20 + (j * (5 + target_height))]);
        }
    }
}

function reset_game(){

    player_x = (canvas.width / 2) - (player_width / 2);
    player_y = canvas.height - (1.5 * player_height);
    player_direction = 0;
    ball_x = (canvas.width / 2) - ball_radius;
    ball_y = (canvas.height * 0.75) - ball_radius;
    populate_targets();
}

function start_game(){

    var start_dir = Math.floor(Math.random() * 2);
    if(start_dir == 0){

        ball_dx = -BALL_SPEED;

    }else{

        ball_dx = BALL_SPEED;
    }
    ball_dy = -BALL_SPEED;
    running = true;
}

function rects_collide(rect1, rect2){

    r1_center_x = rect1[0] + Math.floor(rect1[2] / 2);
    r1_center_y = rect1[1] + Math.floor(rect1[3] / 2);
    r2_center_x = rect2[0] + Math.floor(rect2[2] / 2);
    r2_center_y = rect2[1] + Math.floor(rect2[3] / 2);
    return Math.abs(r1_center_x - r2_center_x) * 2 < rect1[2] + rect2[2] && Math.abs(r1_center_y - r2_center_y) * 2 < rect1[3] + rect2[3];
}

function update(delta){

    if(running){

        player_x += player_direction * PLAYER_SPEED * delta;

        if(player_x < 0){

            player_x = 0;

        }else if(player_x > canvas.width - player_width){

            player_x = canvas.width - player_width;
        }

        ball_x += ball_dx * delta;
        ball_y += ball_dy * delta;

        if(ball_x <= 0){

            ball_x = 0;
            ball_dx = BALL_SPEED;

        }else if(ball_x >= canvas.width - (ball_radius * 2)){

            ball_x = canvas.width - (ball_radius * 2);
            ball_dx = -BALL_SPEED;
        }

        if(ball_y <= 0){

            ball_y = 0;
            ball_dy = BALL_SPEED;
        }

        var player_collider = [player_x, player_y, player_width, 2 * BALL_SPEED];
        var ball_collider = [ball_x, ball_y, ball_radius * 2, ball_radius * 2];
        if(rects_collide(player_collider, ball_collider)){

            ball_center_x = ball_x + ball_radius;
            player_center_x = player_x + Math.floor(player_width / 2);
            if(ball_center_x > player_center_x){

                ball_dx = BALL_SPEED;

            }else{

                ball_dx = -BALL_SPEED;
            }
            ball_dy = -BALL_SPEED;
        }

        for(var i = 0; i < targets.length; i++){

            if(targets[i][0] == 1){

                var lower_collider = [targets[i][1] + Math.floor(target_width * 0.2), targets[i][2] + Math.floor(target_height / 2), Math.floor(target_width * 0.8), Math.floor(target_height / 2)];
                var upper_collider = [targets[i][1] + Math.floor(target_width * 0.2), targets[i][2], Math.floor(target_width * 0.8), Math.floor(target_height / 2)];
                var left_collider = [targets[i][1], targets[i][2], Math.floor(target_width * 0.2), target_height];
                var right_collider = [targets[i][1] + target_width - Math.floor(target_width * 0.2), targets[i][2], Math.floor(target_width * 0.2), target_height];

                if(rects_collide(ball_collider, lower_collider)){

                    targets[i][0] = 0;
                    ball_dy = BALL_SPEED;

                }else if(rects_collide(ball_collider, upper_collider)){

                    targets[i][0] = 0;
                    ball_dy = -BALL_SPEED;

                }else if(rects_collide(ball_collider, left_collider)){

                    targets[i][0] = 0;
                    ball_dx = -BALL_SPEED;

                }else if(rects_collide(ball_collider, right_collider)){

                    targets[i][0] = 0;
                    ball_dx = BALL_SPEED;
                }
            }
        }

        if(ball_y >= canvas.height - (ball_radius * 2)){

            reset_game();
            running = false;
        }
    }
}

function render(){

    context.clearRect(0, 0, canvas.width, canvas.height);

    fill_rect(player_x, player_y, player_width, player_height, "#ff00ff");
    fill_circle(ball_x, ball_y, ball_radius, "#ffff00");

    for(var i = 0; i < targets.length; i++){

        if(targets[i][0] == 1){

            fill_rect(targets[i][1], targets[i][2], target_width, target_height, "#0000ff");
        }
    }

    frames++;
}

function fill_rect(x, y, width, height, color){

    context.beginPath();
    context.rect(x, y, width, height);
    context.fillStyle = color;
    context.fill();
    context.closePath();
}

function fill_circle(x, y, radius, color){

    context.beginPath();
    context.arc(x + radius, y + radius, radius, 0, Math.PI * 2);
    context.fillStyle = color;
    context.fill();
    context.closePath();
}
