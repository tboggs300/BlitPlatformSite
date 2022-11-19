//Scenes
import { createBabylonScene } from "./src/Modeling/Scene/BabylonScene.js";
import {
  createAxisViewScene,
  updateAxisViewViewport,
} from "./src/Modeling/Scene/AxisViewScene.js";
import { createVtkScene } from "./src/Simulation/Scene/VtkScene.js";

import "./src/Modeling/ActionsBar/Create/CreateActions.js";
import "./src/Modeling/ActionsBar/Transform/TransformActions.js";
import "./src/Modeling/ActionsBar/Operate/Operate.js";
import "./src/Modeling/UndoRedo/Redo.js";

const canvas = document.querySelectorAll("canvas")[0];
canvas.style.width = "100%";
canvas.style.height = "100%";

const engine = new BABYLON.Engine(canvas, true, {});
engine.disablePerformanceMonitorInBackground = true;
engine.disableWebGL2Support = false;
engine.preserveDrawingBuffer = false;
engine.enableOfflineSupport = false;
engine.doNotHandleContextLost = false;
engine.loadingUIBackgroundColor = "#000000e1";

export const scene = createBabylonScene(canvas, engine);
const axisViewScene = createAxisViewScene(canvas, engine);

// scene.debugLayer.show();

var groundMaterial = new BABYLON.GridMaterial("groundMaterial", scene);
groundMaterial.majorUnitFrequency = 5;
groundMaterial.minorUnitVisibility = 0.5;
groundMaterial.gridRatio = 2;
groundMaterial.opacity = 0.99;
groundMaterial.useMaxLine = true;
groundMaterial.mainColor = new BABYLON.Color3(95 / 255, 158 / 255, 160 / 255);
groundMaterial.lineColor = new BABYLON.Color3(95 / 255, 158 / 255, 160 / 255);

var ground = BABYLON.MeshBuilder.CreateGround(
  "ground",
  { width: 100, height: 100 },
  scene,
  false
);
ground.material = groundMaterial;

engine.runRenderLoop(function () {
  scene.render();
  axisViewScene.render();
  axisViewScene.activeCamera.alpha = scene.activeCamera.alpha;
  axisViewScene.activeCamera.beta = scene.activeCamera.beta;
  scene.autoClear = true;
});

window.addEventListener(
  "resize",
  function (ev) {
    engine.resize();
    updateAxisViewViewport(axisViewScene, canvas);
  },
  false
);

$(document).ready(function () {
  // ---- Modeling Section
  $("#Modeling-anchor").click(() => {
    $("#modeling").show();
    $("#mesh").hide();
    $("#simulation").hide();
    $("#result").hide();
  });

  // ---- Mesh Section
  $("#Mesh-anchor").click(() => {
    $("#modeling").hide();
    $("#mesh").show();
    $("#simulation").hide();
    $("#result").hide();
  });

  // ---- Simulation Section
  let click = 0;
  $("#Simulation-anchor").click(() => {
    if (click == 0) {
      createVtkScene();
      click++;
    }
    $("#modeling").hide();
    $("#mesh").hide();
    $("#simulation").show();
    $("#result").hide();
  });

  // ---- Result Section
  $("#Result-anchor").click(() => {
    $("#modeling").hide();
    $("#mesh").hide();
    $("#simulation").hide();
    $("#result").show();
  });
});

// How to add more modals - re-using the code
// On key press 'esc', close the modal
// Add in Accessability
//Recactoring? toggle the class names? instead of add and remove, and then somehow for the modal overlay?

// More advanced make this in prototyping/oop JS

const sideBarElement = document.querySelector("#target");

sideBarElement.addEventListener("dragover", (ev) => {
  if (!ev.target.classList.contains("objComp")) {
    ev.preventDefault();
  }
  ev.dataTransfer.dropEffect = "move";
});

sideBarElement.addEventListener("drop", (ev) => {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("application/my-app");
  ev.target.appendChild(document.getElementById(data));
});
