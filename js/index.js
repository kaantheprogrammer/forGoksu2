var pics = [
"1s.jpeg", "2s.jpeg", "3s.jpeg", "4s.jpeg", "5s.jpeg", "6s.jpeg", "7s.jpeg", "8s.jpeg", "9s.jpeg"
];

var dims = [
    [540, 405],
    [540, 405],
    [540, 405],
    [405, 540],
    [540, 405],
    [540, 405],
    [540, 405],
    [540, 405],
    [405, 540]
];



const scene = new THREE.Scene();
scene.rotation.x = 90 * Math.PI/180;
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
camera.position.set( 0, 0, 0 );
camera.lookAt( 0, 1, 0 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.getElementById("hello").appendChild( renderer.domElement );
//document.body.appendChild( renderer.domElement );

var N =9;
var L = 3; // side = 2*L
var alpha = (2*Math.PI)/N;
var R = 5+L / Math.tan(alpha/2);



for(var i = 0;i<N;i++){

    var t1 = new THREE.TextureLoader().load( "pics/"+pics[i], function(){
            renderer.render( scene, camera );
    });

    // assuming you want the texture to repeat in both directions:
    t1.wrapS = THREE.RepeatWrapping; 
    t1.wrapT = THREE.RepeatWrapping;
    
    var pMaterial = new THREE.MeshBasicMaterial( {map : t1, side: THREE.DoubleSide} );
    var pWidth = dims[i][0]; //width
    var pHeight = dims[i][1]; //heigth
    var ratio = pHeight / pWidth;

    if(pWidth>pHeight){
        var pGeometry = new THREE.PlaneGeometry( 2*L, 2*L*ratio );
    } else { 
        var pGeometry = new THREE.PlaneGeometry( 2*L/ratio, 2*L );
    }

    var plane = new THREE.Mesh( pGeometry, pMaterial );
    plane.position.x = R * Math.cos((Math.PI/2)-i*alpha);
    plane.position.z = R * Math.sin((Math.PI/2)-i*alpha);
   
    plane.rotation.y = i*alpha + Math.PI;
   
    scene.add(plane);
}


N = 9;
L = 9; // side = 2*L
H = 20; // side = 2*L
alpha = (2*Math.PI)/N;
R = L / Math.tan(alpha/2);


var t1 = new THREE.TextureLoader().load( "textures/walls.jpeg", function(){
        renderer.render( scene, camera );
        });

// assuming you want the texture to repeat in both directions:
t1.wrapS = THREE.RepeatWrapping; 
t1.wrapT = THREE.RepeatWrapping;
var pMaterial = new THREE.MeshBasicMaterial( {map : t1, side: THREE.DoubleSide} );
var pGeometry = new THREE.PlaneGeometry( 2*L, H );

for(var i = 0;i<N;i++){

    

    var plane = new THREE.Mesh( pGeometry, pMaterial );
    plane.position.x = R * Math.cos((Math.PI/2)-i*alpha);
    plane.position.z = R * Math.sin((Math.PI/2)-i*alpha);
   
    plane.rotation.y = i*alpha;

    scene.add(plane);
}


    var flMaterial = new THREE.MeshBasicMaterial( {color: 0xf45faf, side: THREE.DoubleSide} );
    var flGeometry = new THREE.PlaneGeometry( 2*R+4, 2*R+4 );

    var fl = new THREE.Mesh( flGeometry, flMaterial );
    fl.position.y = -H/2;
   
    fl.rotation.x = Math.PI/2;

    scene.add(fl);


    var floorTex = new THREE.TextureLoader().load( "textures/grass.jpeg", function(){
            renderer.render( scene, camera );
    });

    // assuming you want the texture to repeat in both directions:
    floorTex.wrapS = THREE.RepeatWrapping; 
    floorTex.wrapT = THREE.RepeatWrapping;
    
    var floorMaterial = new THREE.MeshBasicMaterial( { map : floorTex, side: THREE.DoubleSide} );
    var floorGeometry = new THREE.PlaneGeometry( 2*R+4, 2*R+4 );

    var floor = new THREE.Mesh( floorGeometry, floorMaterial );
    floor.position.y = -H/2;
   
    floor.rotation.x = Math.PI/2;

    scene.add(floor);




    var ceilTex = new THREE.TextureLoader().load( "textures/sky.jpeg", function(){
            renderer.render( scene, camera );
    });

    // assuming you want the texture to repeat in both directions:
    ceilTex.wrapS = THREE.RepeatWrapping; 
    ceilTex.wrapT = THREE.RepeatWrapping;
    
    var ceilMaterial = new THREE.MeshBasicMaterial( { map : ceilTex, side: THREE.DoubleSide} );
    var ceilGeometry = new THREE.PlaneGeometry( 2*R+4, 2*R+4 );

    var ceil = new THREE.Mesh( ceilGeometry, ceilMaterial );
    ceil.position.y = H/2;
   
    ceil.rotation.x = Math.PI/2;

    scene.add(ceil);


renderer.render( scene, camera );

var degtorad = Math.PI / 180; // Degree-to-Radian conversion

function getQuaternion( alpha, beta, gamma ) {

  var _x = beta  ? beta  * degtorad : 0; // beta value
  var _y = gamma ? gamma * degtorad : 0; // gamma value
  var _z = alpha ? alpha * degtorad : 0; // alpha value

  var cX = Math.cos( _x/2 );
  var cY = Math.cos( _y/2 );
  var cZ = Math.cos( _z/2 );
  var sX = Math.sin( _x/2 );
  var sY = Math.sin( _y/2 );
  var sZ = Math.sin( _z/2 );

  //
  // ZXY quaternion construction.
  //

  var w = cX * cY * cZ - sX * sY * sZ;
  var x = sX * cY * cZ - cX * sY * sZ;
  var y = cX * sY * cZ + sX * cY * sZ;
  var z = cX * cY * sZ + sX * sY * cZ;

  return [ w, x, y, z ];

}



window.addEventListener('deviceorientation', function(eventData) {
    
    var alpha = eventData.alpha;
    var beta = eventData.beta;
    var gamma = eventData.gamma;

    if(alpha == null || beta ==null || gamma ==null){
        return;
    }

    Q = getQuaternion(alpha, beta ,gamma);
    
    camera.quaternion.w = Q[0] ;
    camera.quaternion.x = Q[1] ;
    camera.quaternion.y = Q[2] ;
    camera.quaternion.z = Q[3] ;
    
    renderer.render( scene, camera );
});


document.addEventListener('keydown', function(event) {

            if(event.keyCode==37){
            camera.position.x -=1; 
            }  
            if(event.keyCode==38){
            camera.position.y +=1; 
            }  
            if(event.keyCode==39){
            camera.position.x +=1; 
            }  
            if(event.keyCode==40){
            camera.position.y -=1; 
            }  
            if(event.keyCode==87){
            camera.position.z -= Math.cos(camera.rotation.y); 
            camera.position.x -= Math.sin(camera.rotation.y); 
            }  
            if(event.keyCode==83){
            camera.position.z += Math.cos(camera.rotation.y); 
            camera.position.x += Math.sin(camera.rotation.y); 
            } 
            if(event.keyCode==81){
                camera.rotation.y = (camera.rotation.y - (0.1 * Math.PI) )% (2* Math.PI);
            }  
            if(event.keyCode==69){
                camera.rotation.y = (camera.rotation.y + (0.1 * Math.PI) )% (2* Math.PI);
            }

            renderer.render( scene, camera );
    });
