// var audioClient;
var scene, camera, renderer, clock, geometry;
var context;
var saved;


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
  loadSound();
}

// init()
//-------------------------------------------
// function beginAudioProcessing() {
//   var audio = new Audio();
//   audio.src = 'music.mp3';
//   audio.controls = true;
//   audio.autoplay = true;
//   document.body.appendChild(audio);
// }
//-------------above code works but shows music player -------



try {
    context = new (window.AudioContext || window.webkitAudioContext)();
}
catch (e) {
    console.log("Your browser doesn't support Web Audio API");
}

if (saved) {
    playSound(saved);
} else {
    loadSound();
}

//loading sound into the created audio context
function loadSound() {
    //set the audio file's URL
    var audioURL = 'music.mp3';

    //creating a new request
    var request = new XMLHttpRequest();
    request.open('GET', audioURL, true);
    request.responseType = 'arraybuffer';
    request.onload = function () {
        //take the audio from http request and decode it in an audio buffer
        context.decodeAudioData(request.response, function (buffer) {
            // save buffer, to not load again
            saved = buffer;
            // play sound
            playSound(buffer);
        });
    };
    request.send();
}

//playing the audio file
function playSound(buffer) {
    //creating source node
    var source = context.createBufferSource();
    //passing in data
    source.buffer = buffer;
    //giving the source which sound to play
    source.connect(context.destination);
    //start playing
    source.start(0);
}

//audio playing code ends



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
