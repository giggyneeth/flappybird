// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);


var score = -1;
var label_score;
var player;
var pipes;

/*
 * Loads all resources for the game and gives them names.
 */
function preload() {
    game.load.image("playerImg","assets/cupcake.png")

    game.load.audio("score","assets/point.ogg");

    game.load.image("pipe","assets/pipe.png");
}

/*
 * Initialises the game. This function is only called once.
 */
function create() {
    game.stage.setBackgroundColor("#9999FF");
    game.add.text(200, 50, "Welcome to my game :)", {font: "30px Rockwell Extra Bold", fill: "#0000CC"});


    game.input.onDown.add(clickHandler);



    label_score = game.add.text(350, 300, "0");


    game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(moveRight);
    game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(moveLeft);
    game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(moveUp);
    game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(moveDown);

    pipes=game.add.group()

    generate_pipe();

    game.physics.startSystem(Phaser.Physics.ARCADE);

    player=game.add.sprite(80,200,"playerImg");

    game.physics.arcade.enable(player);

    player.body.velocity.x=0;
    player.body.velocity.y=-200;

    player.body.gravity.y=300;

    game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(player_jump);

    var pipe_interval = 1.75;
    game.time.events.loop(pipe_interval * Phaser.Timer.SECOND, generate_pipe);

    player.checkWorldBounds = true;
    player.events.onOutOfBounds.add(game_over);
    score = -1;

}



function add_pipe_block(x,y){
    var pipe= pipes.create(x,y,"pipe");
    game.physics.arcade.enable(pipe);
    pipe.body.velocity.x=-200
}



/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {
    game.physics.arcade.overlap(player, pipes, game_over);
    
}
function clickHandler(event){
    game.add.sprite(event.x,  event.y,"playerImg");
    game.sound.play("score");

}




function changeScore(){
    score = score + 1;
    label_score.setText(score.toString());

}
function moveRight() {
    player.x = player.x + 10

}
function moveLeft(){
    player.x=player.x - 10;
}
function moveUp(){
    player.y=+player.y-10
}
function moveDown(){
    player.y=player.y+10
}
function player_jump(){
    game.sound.play("score");
    player.body.velocity.y=-175
}
function generate_pipe(){
    var gap = game.rnd.integerInRange(1,5);
    for (var count = 0; count < 8; count++) {
        if (count != gap && count != gap + 1)
            add_pipe_block(790, count * 50);
    }

    changeScore();
}



function game_over(){
    game.state.restart();
}



