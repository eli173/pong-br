

var mspf = 100;
var c = {
    // matchmaker
    WS_PORT: 6789,
    NUM_PLAYERS: 4,
    MS_PER_FRAME: mspf,
    FPS: 1000/mspf,
    WAIT_TIME: 60000, // 1 minute
    MAX_GAMES: 5, // the most games allowed to go on at once, to be tweaked as needed for purposes
    // gamestate
    DYING_TIME_IN_FRAMES: 100,
    BOARD_RADIUS: 10,
    OOB_THRESH: 4, // out-of-bounds threshold
    ANGLE_THRESH: 0.2, //radians, needs to acct for various rotatings going on... can prolly wing it
    PADDLE_MVT_BONUS: 0.1, // why this value? who knows. the extra speed from paddles in motion
    // ball
    MIN_INIT: 0.1,
    MAX_INIT: 1, // initial speed constraints
    BALL_RADIUS: 0.5,
    MAX_SPEED: 15,
    SPEED_BUMP: 0.2,
    // field
    BOARD_RADIUS: 10, // completely arbitrary actually...
    // paddle
    DPADDLE: 0.1,
    WIDTH_RATIO: 0.2, // paddle is 1/10th of gap rn
}

module.exports = c
