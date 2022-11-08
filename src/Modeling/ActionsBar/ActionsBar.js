import { scene } from "../../../index.js";
import { frameCamera } from "../Scene/BabylonScene.js";
import createComponent from "../ObjectComponent/ObjectComponent.js";

// var ListOfMeshes = {};

// Upload STL File ------------------------------------//
function loadMesh(fileName, url, extension, s) {
  BABYLON.Scene;
  BABYLON.SceneLoader.ImportMesh(
    "",
    "",
    url,
    scene,
    function (newMeshes) {
      const mesh = newMeshes[0];
      newMeshes[0].name = fileName;
      newMeshes[0].id = fileName;
      newMeshes[0].scaling = new BABYLON.Vector3(s, s, s);
      newMeshes[0].rotation = new BABYLON.Vector3(0, 0, 0);
      newMeshes[0].position = new BABYLON.Vector3(0, 0, 0);
      newMeshes[0].material = new BABYLON.NormalMaterial("currentMesh", scene);
      frameCamera(1.5, newMeshes[0]);

      $(".empty-scene").remove();
      mesh.material = new BABYLON.NormalMaterial(fileName, scene);
      if (getNumberOfPickedMeshes() > 0) {
        mesh.visibility = 0.5;
      }
      const objectCompoenetContainer = createComponent(mesh, "meshIcon", scene);
      $(".sidebar-elements").append(objectCompoenetContainer);
    },
    null,
    null,
    extension
  );
}
export function importSTLFile() {
  // scene.dispose();
  let input = document.createElement("input");
  input.type = "file";
  input.accept = ".stl";
  input.multiple = true;

  input.onchange = (_) => {
    // you can use this method to get file and perform respective operations
    let file = input.files[0];
    let fileName = file.name.split(".")[0];
    console.log(fileName);

    // let numberUploadedFiles = input.files.length;

    const ext = "." + file.name.split(".").pop().toLowerCase(); //ext|exts

    if (ext !== ".stl") {
      alert(ext + " file format is not supported! Please enter an STL File");
      return 0;
    } else {
      //   alert("you uploaded " + numberUploadedFiles + " files");
    }

    const url = URL.createObjectURL(file);
    loadStatus = loadMesh(fileName, url, ext, 1);
  };
  input.click();
}

// Create Shapes : Sphere, Cube, Cylinder --------------//
export function createShape(meshType, buttonsClicks) {
  let mesh = 0;
  let objectCompoenetContainer;
  switch (meshType) {
    case "sphere":
      mesh = BABYLON.MeshBuilder.CreateSphere(
        meshType + buttonsClicks,
        {},
        scene
      );
      sphereButtonClicks += 1;
      objectCompoenetContainer = createComponent(mesh, "sphereIcon", scene);

      break;
    case "cube":
      mesh = BABYLON.MeshBuilder.CreateBox(meshType + buttonsClicks, {}, scene);
      cubeButtonClicks += 1;
      objectCompoenetContainer = createComponent(mesh, "cubeIcon", scene);
      break;

    case "cylinder":
      mesh = BABYLON.MeshBuilder.CreateCylinder(
        meshType + buttonsClicks,
        {},
        scene
      );
      cylinderButtonClicks += 1;
      objectCompoenetContainer = createComponent(mesh, "cylinderIcon", scene);
      break;
  }
  $(".sidebar-elements").append(objectCompoenetContainer);

  actions.push({
    mesh: mesh,
    action: "add",
    objectCompoenetContainer: objectCompoenetContainer,
    type: meshType,
  });

  mesh.material = new BABYLON.NormalMaterial(meshType, scene);
  mesh.position.x = 2 - buttonsClicks;
  buttonsClicks = buttonsClicks + 1;
  if (getNumberOfPickedMeshes() > 0) {
    mesh.visibility = 0.5;
  }
  return mesh;
}

$(document).ready(function () {
  $("#sphere-button").click(function () {
    $(".empty-scene").remove();
    createShape("sphere", sphereButtonClicks);
  });

  $("#cube-button").click(function () {
    $(".empty-scene").remove();
    createShape("cube", cubeButtonClicks);
  });

  $("#cylinder-button").click(function () {
    $(".empty-scene").remove();
    createShape("cylinder", cylinderButtonClicks);
  });

  $(".upload-button").click(function () {
    importSTLFile();
  });
});

export function getNumberOfPickedMeshes() {
  var numberOfPickedMeshes = 0;
  scene.meshes.forEach((mesh) => {
    if (mesh.showBoundingBox) {
      numberOfPickedMeshes += 1;
    }
  });
  return numberOfPickedMeshes;
}
