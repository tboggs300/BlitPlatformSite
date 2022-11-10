import { scene } from "../../../index.js";
import { frameCamera } from "../Scene/BabylonScene.js";
import createComponent from "../ObjectComponent/ObjectComponent.js";

// var ListOfMeshes = {};

// Upload STL File ------------------------------------//
export function loadMesh(fileName, url, extension, s) {
  BABYLON.Scene;
  BABYLON.SceneLoader.ImportMesh(
    "",
    "",
    url,
    scene,
    function (newMeshes) {
      const mesh = newMeshes[0];
      mesh.name = fileName;
      mesh.id = fileName;
      mesh.scaling = new BABYLON.Vector3(s, s, s);
      mesh.rotation = new BABYLON.Vector3(0, 0, 0);
      mesh.position = new BABYLON.Vector3(0, 0, 0);
      mesh.material = new BABYLON.NormalMaterial("stlMaterial", scene);
      $(".empty-scene").remove();

      mesh.material = new BABYLON.NormalMaterial(fileName, scene);
      if (getNumberOfPickedMeshes() > 0) {
        mesh.visibility = 0.5;
      }
      const objectCompoenetContainer = createComponent(mesh, "meshIcon", scene);
      $(".sidebar-elements").append(objectCompoenetContainer);
      frameCamera(1.5, mesh);

      actions.push({
        mesh: [url, mesh],
        meshId: fileName,
        action: "add",
        objectCompoenetContainer: objectCompoenetContainer,
        type: "mesh",
      });

      console.log(actions);
    },
    null,
    null,
    extension
  );
}
export function importSTLFile() {
  let input = document.createElement("input");
  input.type = "file";
  input.accept = ".stl";
  input.multiple = true;

  input.onchange = (_) => {
    let file = input.files[0];
    let fileName = file.name.split(".")[0];

    // let numberUploadedFiles = input.files.length;

    const ext = "." + file.name.split(".").pop().toLowerCase(); //ext|exts

    if (ext !== ".stl") {
      alert(ext + " file format is not supported! Please enter an STL File");
      return 0;
    } else {
      //   alert("you uploaded " + numberUploadedFiles + " files");
    }

    const url = URL.createObjectURL(file);
    loadMesh(fileName, url, ext, 1);
  };
  input.click();
}

// Create Shapes : Sphere, Cube, Cylinder --------------//
export function createShape(meshType, buttonsClicks) {
  // console.log("meshType : ", meshType, "Type : ", typeof meshType);
  // console.log("meshType : ", buttonsClicks, "Type : ", typeof buttonsClicks);
  let mesh;
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
    default:
      console.log("default");
  }
  $(".sidebar-elements").append(objectCompoenetContainer);

  actions.push({
    mesh: mesh,
    meshId: buttonsClicks,
    action: "add",
    objectCompoenetContainer: objectCompoenetContainer,
    type: meshType,
  });

  console.log(actions);

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
