/* */
import * as THREE from "./three/build/three.module.js";
import { GLTFLoader } from "./three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "./three/examples/jsm/controls/OrbitControls.js";
import { TGALoader } from "./three/examples/jsm/loaders/TGALoader.js";
import * as dat from "./dat.gui/build/dat.gui.module.js";

/* ITEMS */
var heads = [
  "./glowy/HUM_HEAD_BALD.glb",
  "./glowy/HUM_HEAD_THIEF.glb",
  "./glowy/HUM_HEAD_FATBALD.glb",
  "./glowy/HUM_HEAD_FIGHTER.glb",
  "./glowy/HUM_HEAD_PONY.glb",
  "./glowy/HUM_HEAD_PSIONIC.glb",
  "./glowy/HUM_HEAD_BALD_NOBLINK.glb",
  "./glowy/HUM_HEAD_BEARDD.glb",
  "./glowy/HUM_HEAD_BEARD2.glb",
  "./glowy/HUM_HEAD_BEARD4.glb",
  "./glowy/HUM_HEAD_broda2.glb",
  "./glowy/HUM_HEAD_GIGACHAD.glb",
  "./glowy/HUM_HEAD_LONG.glb",
  "./glowy/HUM_HEAD_LONGHAIR.glb",
  "./glowy/HUM_HEAD_MARVIN.glb",
  "./glowy/HUM_HEAD_MUSTACHE.glb",
  "./glowy/HUM_HEAD_NORDBART_1.glb",
  "./glowy/HUM_HEAD_NORDBART_2.glb",
  "./glowy/HUM_HEAD_NORDBART_3.glb",
  "./glowy/HUM_HEAD_PONYBEARD.glb",
  "./glowy/HUM_HEAD_PSIONIC_PONY.glb",
  "./glowy/HUM_HEAD_SIDEBURNS.glb",
  "./glowy/HUM_HEAD_STD_PONY.glb",
  "./glowy/HUM_HEAD_WITHOUTPONY.glb",
];
var headsw = [
  "./glowy/HUM_HEAD_BABE.glb",
  "./glowy/HUM_HEAD_BABE0.glb",
  "./glowy/HUM_HEAD_BABE1.glb",
  "./glowy/HUM_HEAD_BABE2.glb",
  "./glowy/HUM_HEAD_BABE3.glb",
  "./glowy/HUM_HEAD_BABE4.glb",
  "./glowy/HUM_HEAD_BABE5.glb",
  "./glowy/HUM_HEAD_BABE6.glb",
  "./glowy/HUM_HEAD_BABE7.glb",
  "./glowy/HUM_HEAD_BABE8.glb",
  "./glowy/HUM_HEAD_BABE12.glb",
  "./glowy/HUM_HEAD_BABEHAIR.glb",
  "./glowy/BAB_HEAD_HAIR1.glb",
  "./glowy/HUM_HEAD_IVY.glb",
];

let rootItemBody, rootItemHead;
let modelSex = ["bodyman.glb", "bodyw.glb"];
let activeSex = 0;
let headActive = 0;
let headTexture = 0;
let bodyTexture = 0;

/* INIT SETTINGS */
const buttons = document.querySelectorAll("button");
const menuButton = document.querySelector(".menu-toggle");
const canvas = document.querySelector(".webgl");
const scene = new THREE.Scene();
const loader = new GLTFLoader();
const TGAloader = new TGALoader();
const hemiLight = new THREE.AmbientLight(0xffffff, 1.5);
const camera = new THREE.PerspectiveCamera(80, 1.2, 1, 1000);
camera.position.z = 2;
camera.position.y = 2;
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  canvas: canvas,
});
const controls = new OrbitControls(camera, renderer.domElement);
controls.target = new THREE.Vector3(0, 1, 0);
controls.update();
renderer.setSize(window.innerWidth, window.innerHeight);
camera.aspect = window.innerWidth / window.innerHeight;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 2.3;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.gammaOuput = true;
renderer.setClearColor(0xffffff, 0);
scene.background = new THREE.Color("rgb(50, 50, 55)");

/* SCENE */
scene.add(hemiLight);
scene.add(camera);

const adjustCamera = () => {
  let width = window.innerWidth;
  let height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
};

/* GUI */
const gui = new dat.GUI();
let ambient = gui.addFolder("Ambient");
ambient.add(hemiLight, "visible");
ambient.add(hemiLight, "intensity", 0.0, 4.0);
ambient.add(hemiLight.color, "r", 0.0, 1.0);
ambient.add(hemiLight.color, "g", 0.0, 1.0);
ambient.add(hemiLight.color, "b", 0.0, 1.0);

/* FUNCTIONS */
const addBodyToScene = (bodyNumber) => {
  removeBody();
  bodyTexture = bodyNumber;
  let result = "./tekstury/Hum_Body_Naked_V" + bodyNumber + "_C0.tga";
  loader.load(modelSex[activeSex], function (glb) {
    let texture = TGAloader.load(result, function () {
      texture.flipY = false;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.encoding = THREE.sRGBEncoding;
    });
    texture.encoding = THREE.sRGBEncoding;
    rootItemBody = glb.scene;
    scene.add(rootItemBody);
    glb.scene.traverse(function (object) {
      object.isMesh ? (object.material.map = texture) : "";
    });
  });
};

const addHeadToScene = (headNumber) => {
  removeHead();
  headTexture = headNumber;
  let result = `./tekstury/Hum_Head_V${headNumber}_C0.tga`;
  loader.load(
    activeSex === 0 ? heads[headActive] : headsw[headActive],
    function (glb) {
      let texture = TGAloader.load(result, function () {
        texture.flipY = false;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.encoding = THREE.sRGBEncoding;
      });
      texture.encoding = THREE.sRGBEncoding;
      rootItemHead = glb.scene;
      scene.add(rootItemHead);
      glb.scene.traverse(function (object) {
        object.isMesh ? (object.material.map = texture) : "";
      });
    }
  );
};

const removeBody = () => {
  scene.remove(rootItemBody);
};

const removeHead = () => {
  scene.remove(rootItemHead);
};

const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

/* BUTTONS */
buttons.forEach((button) => {
  switch (button.id) {
    case "nextFaceTexture":
      button.addEventListener("click", () => {
        if (headTexture < 2168) {
          headTexture++;
          document.getElementById("faceTexture").value = headTexture;
          addHeadToScene(headTexture);
        }
      });
      break;
    case "prevFaceTexture":
      button.addEventListener("click", () => {
        if (headTexture > 0) {
          headTexture--;
          document.getElementById("faceTexture").value = headTexture;
          addHeadToScene(headTexture);
        }
      });
      break;
    case "nextFaceModel":
      button.addEventListener("click", () => {
        if (
          activeSex === 0
            ? headActive < heads.length - 1
            : headActive < headsw.length - 1
        ) {
          headActive++;
          document.getElementById(
            "headModel"
          ).innerHTML = `Model Głowy: ${headActive} ${
            activeSex === 0 ? "[Męska]" : "[Kobieca]"
          }`;
          addHeadToScene(headTexture);
        }
      });
      break;
    case "prevFaceModel":
      button.addEventListener("click", () => {
        if (headActive > 0) {
          headActive--;
          document.getElementById(
            "headModel"
          ).innerHTML = `Model Głowy: ${headActive} ${
            activeSex === 0 ? "[Męska]" : "[Kobieca]"
          }`;
          addHeadToScene(headTexture);
        }
      });
      break;
    case "nextBodyTexture":
      button.addEventListener("click", () => {
        if (bodyTexture < 50) {
          bodyTexture++;
          document.getElementById("bodyTexture").value = bodyTexture;
          addBodyToScene(bodyTexture);
        }
      });
      break;
    case "prevBodyTexture":
      button.addEventListener("click", () => {
        if (bodyTexture > 0) {
          bodyTexture--;
          document.getElementById("bodyTexture").value = bodyTexture;
          addBodyToScene(bodyTexture);
        }
      });
      break;
    case "changeSexMan":
      button.addEventListener("click", () => {
        activeSex = 0;
        document.getElementById("characterSex").innerHTML = `Płeć: ♂`;
        headActive = 0;
        document.getElementById(
          "headModel"
        ).innerHTML = `Model Głowy: ${headActive} ${
          activeSex === 0 ? "[Męska]" : "[Kobieca]"
        }`;
        addBodyToScene(bodyTexture);
        addHeadToScene(headTexture);
      });
      break;
    case "changeSexWoman":
      button.addEventListener("click", () => {
        activeSex = 1;
        document.getElementById("characterSex").innerHTML = `Płeć: ♀`;
        headActive = 0;
        document.getElementById(
          "headModel"
        ).innerHTML = `Model Głowy: ${headActive} ${
          activeSex === 0 ? "[Męska]" : "[Kobieca]"
        }`;
        addBodyToScene(bodyTexture);
        addHeadToScene(headTexture);
      });
      break;
  }
});

const initCharacterCreator = () => {
  animate();
  addBodyToScene(0);
  addHeadToScene(0);
};

initCharacterCreator();

/* Events */
window.addEventListener("resize", () => {
  adjustCamera();
});

window.addEventListener("load", () => {
  adjustCamera();
});

menuButton.addEventListener("click", () => {
  document.querySelector(".menu-toggle").classList.toggle("open");
  document.querySelector(".menu-round").classList.toggle("open");
  document.querySelector(".menu-line").classList.toggle("open");
  document.querySelector(".stats-section").classList.toggle("section-display");
});

document.querySelectorAll("input").forEach((input) => {
  switch (input.id) {
    case "faceTexture":
      console.log("test");
      input.addEventListener("change", () => {
        headTexture = input.value;
        addHeadToScene(headTexture);
      });
      break;
    case "bodyTexture":
      input.addEventListener("change", () => {
        bodyTexture = input.value;
        addBodyToScene(bodyTexture);
      });
      break;
  }
});
