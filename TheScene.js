
/// The Model Facade class. The root node of the graph.
/**
 * @param renderer - The renderer to visualize the scene
 */
class TheScene extends THREE.Scene {
  
  constructor (renderer) {
    super();
    
    // Attributes
    
    this.ambientLight = null;
    this.spotLight = null;
    this.camera = null;
    this.trackballControls = null;
    this.r2d2 = null;
    this.ground = null;
    this.ovos = [];
    this.ovo = new THREE.Object3D();
    this.n_ovos = 0;
    this.createLights ();
    this.cameraON = 1;
   // this.createCamera (renderer);
   this.cameraOut = null;
    this.axis = new THREE.AxisHelper (25);
    this.add (this.axis);
    this.model = this.createModel ();
    this.healthbar = this.createHealthBar();
    this.model.add(this.healthbar);
    this.gameover = false;
    this.cameraR2 = this.r2d2.fpsgetCamera();
    this.createCamera (renderer);

    this.add (this.model);

/*
    this.hudCanvas = document.createElement('canvas');
    this.hudCanvas.width = 100;
    this.hudCanvas.height = 100;
    this.hudBitMap = this.hudCanvas.getContext('2d');
*/


  }
  
  /// It creates the camera and adds it to the graph
  /**
   * @param renderer - The renderer associated with the camera
   */
  createCamera (renderer) {
  
    this.cameraOut = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
   this.cameraOut.position.set (240, 240, 240);
   var look = new THREE.Vector3 (0,0,100);
    var look2 = new THREE.Vector3 (0,0,0);
    this.cameraR2.lookAt(look);
    this.cameraOut.lookAt(look2);
  
    this.trackballControls = new THREE.TrackballControls (this.cameraOut, renderer);
    this.trackballControls.rotateSpeed = 5;
    this.trackballControls.zoomSpeed = -2;
    this.trackballControls.panSpeed = 0.5;
    this.trackballControls.target = look2;

    this.camera = this.cameraOut;
    this.add(this.cameraOut);
  }
  
  /// It creates lights and adds them to the graph
  createLights () {
    // add subtle ambient lighting
    this.ambientLight = new THREE.AmbientLight(0xccddee, 0.5);
    this.add (this.ambientLight);

    // add spotlight for the shadows
    this.spotLight = new THREE.SpotLight( 0xffffff,0.5 );
    this.spotLight.position.set( 60, 60, 40 );
    this.spotLight.castShadow = true;
    // the shadow resolution
    this.spotLight.shadow.mapSize.width=2048
    this.spotLight.shadow.mapSize.height=2048;
   // this.add (this.spotLight);


    //La luz ambiental es una luz que se proyecta en todo el plano, a diferencia de la focal que apunta a una posicion

    //P1  Luz añadida
    // add spotlight for the shadows
    this.addedLight = new THREE.SpotLight( 0xeecccc,0.5);
    this.addedLight.position.set( 60, 300, 40 );
    this.addedLight.castShadow = true;
    // the shadow resolution
    this.addedLight.shadow.mapSize.width=2048
    this.addedLight.shadow.mapSize.height=2048;
    this.add (this.addedLight);

  }
  
  /// It creates the geometric model: r2d2 and ground
  /**
   * @return The model
   */
  createModel () {

  var model = new THREE.Object3D();
    var loader1 = new THREE.TextureLoader();
    var texturaGrua = loader1.load ("imgs/images.jpg");
    var mat = new THREE.MeshPhongMaterial({map: texturaGrua});
    this.r2d2 = new r2d2({r2d2Height: 30, r2d2Width: 45, material: mat});
    model.add (this.r2d2);
    //this.r2d2.position.set(0, 0, -140);
    this.r2d2.position.set(0,0,-140);

    var loader = new THREE.TextureLoader();
    var textura = loader.load ("imgs/wood.jpg");
    this.ground = new Ground (300, 300, new THREE.MeshPhongMaterial ({map: textura}), 4);
    model.add (this.ground);

    return model;
  }
  
  createOvo(parameters){

 
    this.ovo = new THREE.Object3D();
    var loader2 = new THREE.TextureLoader();
    var texturaPlato = loader2.load ("imgs/ufobase.jpg");
    var mat2 = new THREE.MeshPhongMaterial({map: texturaPlato});
    this.ovo = new Ovo({r2d2Height: 30, r2d2Width: 45, material: mat2, type: parameters.type});
    this.pos = Math.floor(Math.random() * (140 - (-140) + 1)) + -140;

    this.ovo.position.set(this.pos,0,144);
    this.ovos.push(this.ovo);
    parameters.model.add (this.ovos[this.n_ovos]);
    this.n_ovos++;
    return parameters.model;

  }

  // Public methods

 
  animate (controls) {
   
    this.axis.visible = controls.axis;
    this.spotLight.intensity = controls.lightIntensity;
    //P1
    this.addedLight.intensity = controls.addedLightIntensity;
    if(Math.floor(Math.random()*100) <= 1){
    this.add(this.spawnOvo());
    }

    this.moveOvo();

    this.r2d2.setPositionH(controls.rotation, controls.distance, controls.height);
  }
  
  checkCamera(parameters){
    var look = new THREE.Vector3 (0,0,0);
    var look2 = new THREE.Vector3 (0,0,-100);
    
    if(parameters.cam == 1){
      this.cameraON = 1;
    }else{
      this.cameraON = 2;
    }
    if(this.cameraON == 1){
        this.camera = this.cameraOut;
         this.trackballControls.target = look;
    }else{
      this.camera = this.cameraR2;
      this.trackballControls.target = look2;
    }
  }
  spawnOvo(){
    if(this.n_ovos < 10){
      if(Math.floor(Math.random()*10) > 2){
         this.createOvo({model:this.model, type:1});
      }else{
          this.createOvo({model:this.model, type:2});
      }
    }

  }

  moveOvo(){
    for (var i = this.ovos.length - 1; i >= 0; i--) {
      if(this.ovos[i].position.z > -151){    
        if( this.ovos[i].position.z > this.r2d2.position.z ){
        }else{
            if( this.ovos[i].position.x > this.r2d2.position.x-12 && this.ovos[i].position.x < this.r2d2.position.x+12 && this.ovos[i].getHit() == false ){
                this.ovos[i].setHit({hit: true});
                this.r2d2.quitarEnergia({type: this.ovos[i].getType() });
            }

        }
      this.ovos[i].translateZ(this.ovos[i].getSpeed()); 
      }else if(this.ovos[i].position.z < -150){
        this.ovos[i].position.z = 140;
        var maxSpeed = 5 + (this.r2d2.getPuntos()/20);
        this.s = Math.random()*(-maxSpeed - (-2)) + (-2);
        this.p = Math.floor(Math.random() * (140 - (-140) + 1)) + -140;
        this.ovos[i].setSpeed({speed: this.s });
        this.ovos[i].position.x = this.p;
        this.ovos[i].setHit({hit:false});
      }
    }
    this.checkbar();
   this.checkEndGame();


  }

  makeMove(parameters){
    switch (parameters.move) {
      case 'up':
          this.r2d2.translateZ(5);
        break;
      case'down':
      this.r2d2.translateZ(-5);
      break;
      case'left':
      // this.r2d2.position.x += -5;
      var axis = new THREE.Vector3(0,1,0);//tilted a bit on x and y - feel free to plug your different axis here
      //in your update/draw function
      this.r2d2.rotateOnAxis(axis, 0.25);
      break;
      case'right':
       // this.r2d2.position.x += -5;
      var axis = new THREE.Vector3(0,1,0);//tilted a bit on x and y - feel free to plug your different axis here
      //in your update/draw function
      this.r2d2.rotateOnAxis(axis, -0.25);
      break;
    }
    this.r2d2.decreaseEnergy();

  }
  checkbar(){

    document.getElementById('score').innerHTML = this.r2d2.getPuntos();

    var energy = this.r2d2.getEnergia();
     this.healthbar.scale.set(energy/100,1,1);
     var mat;
     if(energy > 50){
       mat = new THREE.MeshBasicMaterial( {color: 0x00ff00,opacity: 1} );
      }else if(energy > 20 && energy <= 50){ 
         mat = new THREE.MeshBasicMaterial( {color: 0xff9900,opacity: 1} );
      }else{
        mat = new THREE.MeshBasicMaterial( {color: 0xff0000,opacity: 1} );
      }

    this.healthbar.material = mat;
  }


  /// It returns the camera
  /**
   * @return The camera
   */
  getCamera () {
    return this.camera;
  }
  
  /// It returns the camera controls
  /**
   * @return The camera controls
   */
  getCameraControls () {
    return this.trackballControls;
  }
  
  /// It updates the aspect ratio of the camera
  /**
   * @param anAspectRatio - The new aspect ratio for the camera
   */
  setCameraAspect (anAspectRatio) {
    this.camera.aspect = anAspectRatio;
    this.camera.updateProjectionMatrix();
  }
  checkEndGame(){

    if(this.r2d2.getEnergia() <= 0 || this.r2d2.position.x >= 154 || this.r2d2.position.x <= -154 || this.r2d2.position.z <= -154 || this.r2d2.position.z >= 154){

      document.getElementById('endbox').style.visibility = 'visible';
    document.getElementById('gamepausa').innerHTML = "Game Over";
    document.getElementById('recarg').innerHTML = "Recarga la pagina para volver a jugar";

      document.getElementById('pfinal').innerHTML = this.r2d2.getPuntos();
      this.gameover = true;
    }
  } 
 



  createHealthBar(){
   var barra = new THREE.BoxGeometry (200, 10, 10);
   var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
   var hbar = new THREE.Mesh (barra, material);

   hbar.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0, 75, -170));
   hbar.autoUpdateMatrix = false;
   hbar.updateMatrix();
   return hbar;
 }

}

  // class variables
  
  // Application modes
  TheScene.NO_ACTION = 0;
  TheScene.ADDING_BOXES = 1;
  TheScene.MOVING_BOXES = 2;
  
  // Actions
  TheScene.NEW_BOX = 0;
  TheScene.MOVE_BOX = 1;
  TheScene.SELECT_BOX = 2;
  TheScene.ROTATE_BOX = 3;
  TheScene.END_ACTION = 10;


