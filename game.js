function preload() {
    loadImage(this.load, 'face', "mxc://noordstar.me/IiUZjzEPoQPjHoTZpFpAnSdY");
}

function create() {
    this.add.image(450, 500, 'face');
    const particles = this.add.particles('red')
    const emitter = particles.createEmitter({
      speed: 100,
      scale: {start: 1, end: 0},
      blendeMode: 'ADD'
    });
    const logo = this.physics.add.image(400, 100, 'logo');
}

const config = {
    type: Phaser.Auto,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {}
    },
    scene: {
        preload: preload,
        create: create
    }
};
  
const game = new Phaser.Game(config);
