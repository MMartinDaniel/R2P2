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
    this.trolleyHeight  = this.r2d2Height/20;
    
    // Objects for operating with the r2d2
    this.base         = null;
    this.head          = null;
    this.trolley      = null;
    this.string       = null;
    // The string length is 1 at the beginning. So, the current length is the scale factor
    this.stringLength = 1;
    this.hook         = null;
    this.box          = null;
    this.feedBack     = null;
    
    // Limits
    this.distanceMin  = this.r2d2Width/7;
    this.distanceMax  = 0.75*this.r2d2Width;
    this.heightMin    = 0;
    this.heightMax    = 0.9*this.r2d2Height;
    
    this.base = this.createBase();
    // A way of feedback, a red jail will be visible around the r2d2 when a box is taken by it
    this.feedBack = new THREE.BoxHelper (this.base, 0xFF0000);
    this.feedBack.visible = false;
    this.add (this.base);
    this.add (this.feedBack);
  }
  
  // Private methods
  
  /// It computes the length of the string
  computeStringLength () {
    // stringLenght = base height + r2d2 height - trolley height - hook height - height of the hook to the ground. So,
    // stringLength = baseHookHeight + r2d2Height - trolleyHeight - baseHookHeight - height;
    return this.r2d2Height - this.trolleyHeight - this.height;
  }
  
  /// It creates the base and adds the mast to the base
  /*
  createBase () {
    var base = new THREE.Mesh (
      new THREE.CylinderGeometry (this.r2d2Width/10, this.r2d2Width/10, this.baseHookHeight, 16, 1), 
                               this.material);
    base.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0, this.baseHookHeight/2, 0));
   
    base.castShadow = true;
    base.autoUpdateMatrix = false;
    base.add(this.createMast());
    return base;
  }
  */
    createBase () {
    var base = new THREE.Mesh (
      new THREE.CylinderGeometry (this.r2d2Width/10, this.r2d2Width/10, this.r2d2Height/2, 16, 8), this.material);
    base.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0, this.r2d2Height/3, 0));
   
    base.castShadow = true;
    base.autoUpdateMatrix = false;
    base.add(this.createMast());
    return base;
  }

  /// It creates the mast and adds the jib to the mast
  createMast () {
    var mast = new THREE.Mesh (
      new THREE.SphereGeometry (this.r2d2Width/10.2, this.r2d2Width, this.r2d2Height), this.material);
    mast.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0, this.r2d2Height/1.7, 0));
    mast.castShadow = true;
    mast.position.y = this.baseHookHeight;
    mast.autoUpdateMatrix = false;
    mast.updateMatrix();

    return mast;
  }
  
  /// It creates the jib, and adds the trolley-string-hook group to the jib


  
  /// It sets the angle of the jib
  /**
   * @param anAngle - The angle of the jib
   */

  /// It sets the distance of the trolley from the mast
  /**
   * @param aDistance - The distance of the trolley from the mast
   */

  
  /// It sets the distance of the hook from the bottom of the base
  /**
   * @param aHeight - The distance of the hook from the bottom of the base
   */
  setHook (aHeight) {
    if (this.heightMin <= aHeight && aHeight <= this.heightMax) {
      this.height = aHeight;
      this.stringLength = this.computeStringLength ()

    }
  }

  /// It makes the r2d2 feedback visible or not
  /**
   * @param onOff - Visibility (true or false)
   */
  setFeedBack (onOff) {
    this.feedBack.visible = onOff;
  }
  
  /// It sets the hook according to
  /**
   * @param anAngle - The angle of the jib
   * @param aDistance - The distance of the trolley from the mast
   * @param aHeight - The distance of the hook from the bottom of the base
   */
  setHookPosition (anAngle, aDistance, aHeight) {

    this.setHook (aHeight);
  }
  
  /// It returns the position of the hook
  /**
   * @param world - Whether the returned position is referenced to the World Coordinates System (r2d2.WORLD) or is referenced to the r2d2 position (r2d2.LOCAL)
   * @return A Vector3 with the asked position
   */
  getHookPosition (world) {
    if (world === undefined)
      world = r2d2.WORLD;
    var hookPosition = new THREE.Vector3();
    hookPosition.y -= this.baseHookHeight;
    if (world === r2d2.LOCAL) {
      var r2d2Position = new THREE.Vector3();
      r2d2Position.setFromMatrixPosition (this.matrixWorld);
      hookPosition.sub (r2d2Position);
    }
    return hookPosition;
  }
  
  /// The r2d2 takes a box
  /**
   * @param aBox - The box to be taken
   * @return The new height of the hook, on the top of the box. Zero if no box is taken
   */
  takeBox (aBox) { 
    if (this.box === null) {
      this.setFeedBack(true);
      this.box = aBox;
      var newHeight = this.box.position.y + this.box.geometry.parameters.height;
      this.heightMin = this.box.geometry.parameters.height;
      this.box.position.x = 0;
      this.box.position.y = -this.box.geometry.parameters.height-this.baseHookHeight;
      this.box.position.z = 0;
      return newHeight;
    }
    return 0;
  }
  
  /// The r2d2 drops its taken box
  /**
   * @return The dropped box, or null if no box is dropped.
   */
  dropBox () {
    if (this.box !== null) {
      this.setFeedBack(false);
      var theBox = this.box;
      this.box = null;
      this.heightMin = 0;
      return theBox;
    } else
      return null;
  }

}

// class variables
r2d2.WORLD = 0;
r2d2.LOCAL = 1;
