/// The r2d2 class
/**
 * @author FVelasco
 * 
 * @param parameters = {
 *      r2d2Height: <float>,
 *      r2d2Width : <float>,
 *      material: <Material>
 * }
 */



class r2d2 extends THREE.Object3D {
  
  constructor (parameters) {
    super();
    
    // If there are no parameters, the default values are used
    
    this.r2d2Height = (parameters.r2d2Height === undefined ? 20 : parameters.r2d2Height);
    this.r2d2Width  = (parameters.r2d2Width === undefined ? 45 : parameters.r2d2Width);
    this.material    = (parameters.material === undefined ? new THREE.MeshPhongMaterial ({color: 0xA2C257, specular: 0xfbf804, shininess: 70}) : parameters.material);
          
    // With these variables, the posititon of the hook is set
    this.angle           = 0;
    this.distance        = this.r2d2Width / 2;
    this.height          = this.r2d2Height / 2;
    
    // Height of different parts
    this.baseHookHeight = this.r2d2Height/100;
    
    //SESION 2 DATOS

    this.energia = 100;
    this.puntos = 0;

    // Objects for operating with the r2d2
    this.base         = null;
    this.head = null;
    this.brazoD = null;
    this.brazoI = null;
    this.base = this.createBase();


    // A way of feedback, a red jail will be visible around the r2d2 when a box is taken by it

    this.add (this.base);
    

  }
  
  // CUERPO
    createBase () {
    var base = new THREE.Mesh (
      new THREE.CylinderGeometry (this.r2d2Width/10, this.r2d2Width/10, this.r2d2Height/3, 16, 8), this.material);
    base.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0, this.r2d2Height/3, 0));
    base.position.y =-2.2;
    base.castShadow = true;
    base.autoUpdateMatrix = false;

    //Funciones para crear la cabeza, y los dos hombros, que a su vez incluiran la de cada brazo y estas las de cada pie
    this.head = this.createHead();
    base.add(this.head);
    base.add(this.createShoulder({w:6,ww: 5}));
    base.add(this.createShoulder({w:-6, ww: -5}));
    return base;
  }

  // CABEZA
  createHead () {
    var head = new THREE.Mesh (
      new THREE.SphereGeometry (this.r2d2Width/10.2, this.r2d2Width, this.r2d2Height), this.material);
    head.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0, this.r2d2Height/2, 0));
    head.castShadow = true;
    head.position.y = this.baseHookHeight;
    head.autoUpdateMatrix = false;
    head.updateMatrix();
    //crear ojo
    head.add(this.createEye());

    return head;
  }

// LENTE
createEye(){
    var eye = new THREE.Mesh (
      new THREE.CylinderGeometry (this.r2d2Width/50, this.r2d2Width/50, this.r2d2Height/20, 10, 8), this.material);

    eye.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0, 11.5, -12.5));
    eye.rotateX(Math.PI/3);
    eye.castShadow = true;
    eye.autoUpdateMatrix = false;
    eye.updateMatrix();


    return eye;
}


createShoulder (place){
  var lshoulder = new THREE.Mesh ( 
    new THREE.BoxGeometry (this.r2d2Width/10, this.r2d2Width/20, this.r2d2Height/15), this.material);
    lshoulder.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (place.ww, this.r2d2Height/2.3, 0));
    
    lshoulder.castShadow = true;
    lshoulder.autoUpdateMatrix = false;
    lshoulder.updateMatrix();

    //crear brazo izquierdo
    lshoulder.add(this.createArm({w: place.w}));

    return lshoulder;
  } 

// BRAZOS
createArm (place){
  var larm = new THREE.Mesh ( 
    new THREE.CylinderGeometry (this.r2d2Width/50, this.r2d2Width/50 , this.r2d2Height/3, 16, 8), this.material);
    larm.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (place.w, this.r2d2Height/4, 0));
    
  larm.castShadow = true;
  larm.autoUpdateMatrix = false;
  larm.updateMatrix();

  //Crear pie iquierdo
  larm.add(this.createFoot({w: place.w}));

  return larm;  
}


createFoot (place){
  var rfoot = new THREE.Mesh ( 
    new THREE.ConeGeometry (this.r2d2Width/20, this.r2d2Width/20 , this.r2d2Height/3, 16, 8), this.material);
    rfoot.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (place.w, this.r2d2Height/8.5, 0));
    
  rfoot.castShadow = true;
  rfoot.autoUpdateMatrix = false;
  rfoot.updateMatrix();
    return rfoot;  
}

setPositionH(cabeza,cuerpo,brazos){
  this.setHead(cabeza);
  this.setBody(cuerpo);
  this.setBrazos(brazos);
}

setHead(cabeza){
  this.head.rotation.y = cabeza;
}

setBody(cuerpo){
  //this.base.rotation.x = cuerpo;
}

setBrazos(brazos){
//  this.brazoD.height = brazos;
//  this.brazoI.height = brazos;
}
quitarEnergia(parametros){

  var puntos =  Math.floor(Math.random() * (5 - 0 + 1));
  if(parametros.type == 1){
     this.energia = this.energia-10;
   }else{
    this.energia = this.energia +(5 - puntos);
   }

}

getEnergia(){
  return this.energia;
}

}




// class variables
r2d2.WORLD = 0;
r2d2.LOCAL = 1;
