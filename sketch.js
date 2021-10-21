var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo = JOGAR;

var trex, trex_correndo, trex_colidiu;
var solo, soloinvisivel, imagemdosolo;

var nuvem, grupodenuvens, imagemdanuvem;
var grupodeobstaculos, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;

var pontuacao;
var gameover, fimdeJogo;
var reiniciar, restart;

var somSalto, somMorte, somCP;


function preload(){
  trex_correndo = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_colidiu = loadAnimation("trex_collided.png");
  
  imagemdosolo = loadImage("ground2.png");
  
  imagemdanuvem = loadImage("cloud.png");
  
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");
  
  gameover = loadImage("gameOver.png");
  reiniciar = loadImage("restart.png");
  
  somSalto = loadSound("jump.mp3");
  somMorte = loadSound("die.mp3");
  somCP = loadSound("checkPoint.mp3");
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
                //largura   //altura
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_correndo);
  trex.addAnimation("collided" , trex_colidiu);
  trex.scale = 0.5;
  
  solo = createSprite(width-50,100,400,20);
  solo.addImage("ground",imagemdosolo);
  solo.velocityX = -4;
  
  soloinvisivel = createSprite(width/2,height-10,width,10);
  soloinvisivel.visible = false;
   
  //criar grupos de obstáculos e de nuvens
  grupodeobstaculos = createGroup();
  grupodenuvens = createGroup();
  
  fimdeJogo = createSprite(300, 100);
  fimdeJogo.addImage(gameover);
  fimdeJogo.scale = 1;
  
  restart = createSprite(300, 140);
  restart.addImage(reiniciar);
  restart.scale = 0.5;
  
  trex.debug = false;
  
  trex.setCollider("circle", 0 , 0, 40 );
  
  pontuacao = 0;
}

function draw() {
  background(180);
  text("Pontuação: "+ pontuacao, 500,50);  
  
  if(estadoJogo === JOGAR){
    fimdeJogo.visible = false
    restart.visible = false;
    //mover o solo
    solo.velocityX = -4;
    
    pontuacao = pontuacao + Math.round(frameCount/60);
    
    if (solo.x < 0){
       solo.x = solo.width/2;
    }
    
    if(touches.length > 0 || keyDown("space")&& trex.y >= 100) {
      trex.velocityY = -13;
      somSalto.play();
      touches = [];
      
    }
    
    trex.velocityY = trex.velocityY + 0.8;
    
    if(pontuacao > 0 && pontuacao % 100 === 0){
      somCP.play();
    }
    
    //gerar as nuvens
    gerarNuvens();
  
    //gerar obstáculos no solo
    gerarObstaculos();
    
    if(grupodeobstaculos.isTouching(trex)){
      estadoJogo = ENCERRAR;
      somMorte.play();
      trex.changeAnimation("collided" , trex_colidiu);
    }
    
  }
  else if(estadoJogo === ENCERRAR){
    fimdeJogo.visible = true;
    restart.visible = true;
    //parar o solo
    solo.velocityX = 0;
    
    grupodenuvens.setLifetimeEach(-1); 
    
    grupodenuvens.setVelocityXEach(0);
    
    grupodeobstaculos.setVelocityXEach(0);
    
    grupodeobstaculos.setLifetimeEach(-1);
    
    if(touches.length > 0 || mousePressedOver(restart)){
      reset();
      touches = [];
    }
      
    }
 
   trex.collide(soloinvisivel);
    
    drawSprites();
}

function reset(){
  estadoJogo = JOGAR;
  fimdeJogo.visible = false
  restart.visible = false;
  grupodenuvens.destroyEach();
  grupodeobstaculos.destroyEach();
  pontuacao = 0;
  trex.changeAnimation("running", trex_correndo);
   
}

function gerarObstaculos(){
 if (frameCount % 60 === 0){
   var obstaculo = createSprite(600,165,10,40);
  obstaculo.velocityX = -6;
      
   
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstaculo.addImage(obstaculo1);
              break;
      case 2: obstaculo.addImage(obstaculo2);
              break;
      case 3: obstaculo.addImage(obstaculo3);
              break;
      case 4: obstaculo.addImage(obstaculo4);
              break;
      case 5: obstaculo.addImage(obstaculo5);
              break;
      case 6: obstaculo.addImage(obstaculo6);
              break;
      default: break;
    }
   
    //atribuir escala e tempo de duração ao obstáculo         
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 300;
   
    //adicionar cada obstáculo ao grupo
    grupodeobstaculos.add(obstaculo);
 }
}




function gerarNuvens() {
  //escreva o código aqui para gerar as nuvens 
  if (frameCount % 60 === 0) {
    nuvem = createSprite(600,100,40,10);
    nuvem.y = Math.round(random(10,60));
    nuvem.addImage(imagemdanuvem);
    nuvem.scale = 0.5;
    nuvem.velocityX = -3;
    
     //atribuir tempo de duração à variável
    nuvem.lifetime = 134;
    
    //ajustando a profundidade
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
        
    //adicionando nuvem ao grupo
   grupodenuvens.add(nuvem);
  }
}
