var audioClient;
var scene, camera, renderer, clock, geometry;

var width = window.innerWidth,
  height = window.innerHeight;

var startButton = document.getElementById( 'start-animate' );
startButton.addEventListener( 'click', startClicked );

function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
}

function startClicked() {
  document.getElementById("button-c").style.visibility = "hidden";
  init();
  beginAudioProcessing();
}

// init()

function beginAudioProcessing() {
  var audio = new Audio();
  audio.src = 'music.mp3';
  audio.controls = true;
  audio.autoplay = true;
  document.body.appendChild(audio);
}

function init() {
// print("test")
//scene created
  this.scene = new THREE.Scene();
  this.camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 0.1, 10000 );
// render
  this.renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

//light
  var hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x0C056D, 0.6);
   scene.add(hemisphereLight);

    var light = new THREE.DirectionalLight(0x590D82, 0.5);
    light.position.set(200, 300, 400);
    scene.add(light);

    var light2 = light.clone();
    light2.position.set(-200, 300, 400);
    scene.add(light2);
//IcosahedronBufferGeometry shape created
  this.geometry= new THREE.IcosahedronBufferGeometry();

//material
   var material = new THREE.MeshPhongMaterial({
     emissive: 0xF6C7F1,
     emissiveIntensity: 0.4,
     shininess: 0
   });
  var shape = new THREE.Mesh(geometry, material);
  scene.add(shape);

  camera.position.z = 10;

//animate
  var animate = function () {
    requestAnimationFrame( animate );

    shape.rotation.x += 0.01;
    shape.rotation.y += 0.01;

    renderer.render( scene, camera );
  };

  animate();
}

function animate(time){
  renderer.render( scene, camera );
  updateVertices(time);
}

//update Vertices
function updateVertices(time) {
  for (var i = 0; i < geometry.vertices.length; i++) {
    var vector = geometry.vertices[i];
  }
}
