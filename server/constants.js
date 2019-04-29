

var c = {
    // matchmaker
    WS_PORT: 6789,
    NUM_PLAYERS: 3,
    MS_PER_FRAME: 500,
    WAIT_TIME: 60000, // 1 minute
    MAX_GAMES: 5, // the most games allowed to go on at once, to be tweaked as needed for purposes
    // gamestate
    DYING_TIME_IN_FRAMES: 100,
    BOARD_RADIUS: 10,
    OOB_THRESH: 1, // out-of-bounds threshold
    ANGLE_THRESH: 0.2, //radians, needs to acct for various rotatings going on... can prolly wing it
    PADDLE_MVT_BONUS: 0.1, // why this value? who knows. the extra speed from paddles in motion
    // ball
    MIN_INIT: 3,
    MAX_INIT: 5, // initial speed constraints
    BALL_RADIUS: 0.5,
    MAX_SPEED: 15,
    SPEED_BUMP: 0.2,
    // field
    BOARD_RADIUS: 10, // completely arbitrary actually...
    // paddle
    DPADDLE: 0.1,
    WIDTH_RATIO: 0.1, // paddle is 1/10th of gap rn
}

module.exports = c
