class Ovo extends THREE.Object3D {

 constructor (parameters) {
    super();
    
    // If there are no parameters, the default values are used
    var loader3 = new THREE.TextureLoader();


    if (parameters.type == 1) {
	 var texturaPiloto = loader3.load ("imgs/red.jpg");
    }else{
	var texturaPiloto = loader3.load ("imgs/green2.jpg");
    }
  
  	var mat3 = new THREE.MeshPhongMaterial({map: texturaPiloto});
  	this.material2    = (mat3);
    this.material    = (parameters.material === undefined ? new THREE.MeshPhongMaterial ({color: 0xFF0000, specular: 0xfbf804, shininess: 70}) : parameters.material);

    this.type = parameters.type;
    this.speed = Math.random()*(-5 - (-2)) + (-2);

    // With these variables, the posititon of the hook is set
    this.angle           = 0;
    this.distance        = 5;
    this.height          = 5;
   
    // Objects for operating with the r2d2
    this.base   = null;
    this.head = null;
    this.brazoD = null;
    this.brazoI = null;
    this.base = null;
    this.hit = false;

    this.add(this.createPlato());

  }


  createPlato(){
	var base = new THREE.Mesh (
    new THREE.CylinderGeometry (1,5.5,2,13,28,false,6,6.3), this.material);
    base.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0, 12, 10));
    base.castShadow = true;
    base.autoUpdateMatrix = false;
    base.add(this.createPilot());
    return base;

  }

  createPilot(){
  	var pilot = new THREE.Mesh (
    new THREE.SphereGeometry (1.7,20, 5), this.material2);
    pilot.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0, 13, 10));
    pilot.castShadow = true;
    pilot.autoUpdateMatrix = false;
    pilot.updateMatrix();
    return pilot;
  }


  getSpeed(){
  	//alert(this.speed);
  	return this.speed;
  }
  setSpeed(parameters){
  	this.speed = parameters.speed;
  }

  getType(){
    return this.type;
  }
  getHit(){
    return this.hit;
  }
  setHit(parameters){
    this.hit = parameters.hit;
  }

}