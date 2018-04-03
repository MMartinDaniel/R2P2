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
    
    this.r2d2Height = (parameters.r2d2Height === undefined ? 30 : parameters.r2d2Height);
    this.r2d2Width  = (parameters.r2d2Width === undefined ? 45 : parameters.r2d2Width);
    this.material    = (parameters.material === undefined ? new THREE.MeshPhongMaterial ({color: 0xA2C257, specular: 0xfbf804, shininess: 70}) : parameters.material);
          
    // With these variables, the posititon of the hook is set
    this.angle           = 0;
    this.distance        = this.r2d2Width / 2;
    this.height          = this.r2d2Height / 2;
    
    // Height of different parts
    this.baseHookHeight = this.r2d2Height/100;
    
    // Objects for operating with the r2d2
    this.base         = null;

    this.base = this.createBase();
    // A way of feedback, a red jail will be visible around the r2d2 when a box is taken by it

    this.add (this.base);
  }
  

    createBase () {
    var base = new THREE.Mesh (
      new THREE.CylinderGeometry (this.r2d2Width/10, this.r2d2Width/10, this.r2d2Height/3, 16, 8), this.material);
    base.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0, this.r2d2Height/3, 0));
   
    base.castShadow = true;
    base.autoUpdateMatrix = false;
    base.add(this.createHead());
    return base;
  }

  /// It creates the head and adds the jib to the head
  createHead () {
    var head = new THREE.Mesh (
      new THREE.SphereGeometry (this.r2d2Width/10.2, this.r2d2Width, this.r2d2Height), this.material);
    head.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0, this.r2d2Height/2, 0));
    head.castShadow = true;
    head.position.y = this.baseHookHeight;
    head.autoUpdateMatrix = false;
    head.updateMatrix();
    return head;
  }
}

// class variables
r2d2.WORLD = 0;
r2d2.LOCAL = 1;
