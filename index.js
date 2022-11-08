//Scenes
import { createBabylonScene } from "./src/Modeling/Scene/BabylonScene.js";
import { createVtkScene } from "./src/Simulation/Scene/VtkScene.js";

import "./src/Modeling/ActionsBar/ActionsBar.js";
import "./src/Modeling/UndoRedo/Redo.js";

export const [scene, engine] = createBabylonScene();
// scene.debugLayer.show();

engine.runRenderLoop(function () {
  scene.render();
  scene.autoClear = true;
});

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
