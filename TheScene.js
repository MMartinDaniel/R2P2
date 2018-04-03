
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
  
    this.createLights ();
    this.createCamera (renderer);
    this.axis = new THREE.AxisHelper (25);
    this.add (this.axis);
    this.model = this.createModel ();
    this.add (this.model);
  }
  
  /// It creates the camera and adds it to the graph
  /**
   * @param renderer - The renderer associated with the camera
   */
  createCamera (renderer) {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set (60, 30, 60);
    var look = new THREE.Vector3 (0,20,0);
    this.camera.lookAt(look);

    this.trackballControls = new THREE.TrackballControls (this.camera, renderer);
    this.trackballControls.rotateSpeed = 5;
    this.trackballControls.zoomSpeed = -2;
    this.trackballControls.panSpeed = 0.5;
    this.trackballControls.target = look;
    
    this.add(this.camera);
  }
  
  /// It creates lights and adds them to the graph
  createLights () {
    // add subtle ambient lighting
    this.ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
    this.add (this.ambientLight);

    // add spotlight for the shadows
    this.spotLight = new THREE.SpotLight( 0xffffff );
    this.spotLight.position.set( 60, 60, 40 );
    this.spotLight.castShadow = true;
    // the shadow resolution
    this.spotLight.shadow.mapSize.width=2048
    this.spotLight.shadow.mapSize.height=2048;
    this.add (this.spotLight);


    //La luz ambiental es una luz que se proyecta en todo el plano, a diferencia de la focal que apunta a una posicion

    //P1  Luz añadida
    // add spotlight for the shadows
    this.addedLight = new THREE.SpotLight( 0xeecccc );
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
    var texturaGrua = loader1.load ("imgs/textura1.jpg");
    var mat = new THREE.MeshPhongMaterial({map: texturaGrua});
    this.r2d2 = new r2d2({r2d2Height: 30, r2d2Width: 45, material: mat});
    model.add (this.r2d2);
    var loader = new THREE.TextureLoader();
    var textura = loader.load ("imgs/wood.jpg");
    this.ground = new Ground (300, 300, new THREE.MeshPhongMaterial ({map: textura}), 4);
    model.add (this.ground);
    return model;
  }
  
  // Public methods

  /// It adds a new box, or finish the action
  /**
   * @param event - Mouse information
   * @param action - Which action is requested to be processed: start adding or finish.
   */
  addBox (event, action) {
    this.ground.addBox(event, action);
  }
  
  /// It moves or rotates a box on the ground
  /**
   * @param event - Mouse information
   * @param action - Which action is requested to be processed: select a box, move it, rotate it or finish the action.
   */
  moveBox (event, action) {
    this.ground.moveBox (event, action);
  }
  
  /// The r2d2 can take a box
  /**
   * @return The new height of the hook, on the top of the taken box. Zero if no box is taken
   */
  
  takeBox () { 
    var box = this.ground.takeBox (this.r2d2.getHookPosition());
    if (box === null)
      return 0; 
    else 
      return this.r2d2.takeBox (box); 
    // The retuned height set the new limit to down the hook
  }
  

  /// The r2d2 drops its taken box
  dropBox () {
    var box = this.r2d2.dropBox ();
    if (box !== null) {
      box.position.copy (this.r2d2.getHookPosition());
      box.position.y = 0;
      this.ground.dropBox (box);
    }
  }
  
  /// It sets the r2d2 position according to the GUI
  /**
   * @controls - The GUI information
   */
  animate (controls) {
    this.axis.visible = controls.axis;
    this.spotLight.intensity = controls.lightIntensity;
    //P1
    this.addedLight.intensity = controls.addedLightIntensity;
    //---
    if(controls.height >= 20){
      this.dropBox();
      controls.takeBox = false;
    }
    this.r2d2.setHookPosition (controls.rotation, controls.distance, controls.height);
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


