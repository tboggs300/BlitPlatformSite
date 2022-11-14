import { scene } from "../../../index.js";
import { frameCamera } from "../Scene/BabylonScene.js";
import createComponent from "../ObjectComponent/ObjectComponent.js";
import { openCubeModal } from "./Modals/ModalCostumizedCube.js";
import { openSphereModal } from "./Modals/ModalCostumizedSphere.js";
import { openCylinderModal } from "./Modals/ModalCostumizedCylinder.js";
import { chooseMaterial } from "../ObjectComponent/ContextMenu.js";

import "./Modals/ModalCostumizedCube.js";
import "./Modals/ModalCostumizedSphere.js";
import "./Modals/ModalCostumizedCylinder.js";

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
export function createShape(meshType, buttonsClicks, shapeObj) {
  let mesh;
  let objectCompoenetContainer;
  switch (meshType) {
    case "sphere":
      let sphereObj = shapeObj;
      console.log(sphereObj);

      mesh = BABYLON.MeshBuilder.CreateSphere(
        sphereObj.name,
        {
          segments: sphereObj.segment,
          diameter: sphereObj.diameter,
          diameterX: sphereObj.xDiameter,
          diameterY: sphereObj.yDiameter,
          diameterZ: sphereObj.zDiameter,
        },
        scene
      );

      // mesh.segments = 10;

      // mesh.material = new BABYLON.NormalMaterial(meshType, scene);
      mesh.material = chooseMaterial(sphereObj.material, scene);

      sphereButtonClicks += 1;
      objectCompoenetContainer = createComponent(mesh, "sphereIcon", scene);

      break;
    case "cube":
      let cubeObj = shapeObj;
      mesh = BABYLON.MeshBuilder.CreateBox(cubeObj.name, {}, scene);
      mesh.position.x = cubeObj.xmin;
      mesh.position.y = cubeObj.ymin;
      mesh.position.z = cubeObj.zmin;
      mesh.scaling.x = cubeObj.xmax - cubeObj.xmin;
      mesh.scaling.y = cubeObj.ymax - cubeObj.ymin;
      mesh.scaling.z = cubeObj.zmax - cubeObj.zmin;
      mesh.material = chooseMaterial(cubeObj.material, scene);
      console.log(mesh);

      // frameCamera(1.5, mesh);

      cubeButtonClicks += 1;
      objectCompoenetContainer = createComponent(mesh, "cubeIcon", scene);
      break;

    case "cylinder":
      let cylinderObj = shapeObj;
      console.log(cylinderObj);

      mesh = BABYLON.MeshBuilder.CreateCylinder(
        cylinderObj.name,
        {
          height: cylinderObj.height,
          diameter: cylinderObj.diameter,
          diameterTop: cylinderObj.topDiameter,
          diameterBottom: cylinderObj.bottomDiameter,
          tessellation: cylinderObj.tesselation,
          subdivisions: cylinderObj.subdivisions,
        },
        scene
      );

      mesh.material = chooseMaterial(cylinderObj.material, scene);

      // sphereButtonClicks += 1;
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

  buttonsClicks = buttonsClicks + 1;
  if (getNumberOfPickedMeshes() > 0) {
    mesh.visibility = 0.5;
  }
  return mesh;
}

const addSphere = (e) => {
  openSphereModal(e).then(
    (resolve) => {
      $(".empty-scene").remove();
      let sphereObj = resolve;
      createShape("sphere", sphereButtonClicks, sphereObj);
    },
    (reject) => {
      console.log(reject);
    }
  );
};

const addCube = (e) => {
  openCubeModal(e).then(
    (resolve) => {
      $(".empty-scene").remove();
      let cubeObj = resolve;
      console.log(cubeObj);
      createShape("cube", cubeButtonClicks, cubeObj);
    },
    (reject) => {
      console.log(reject);
    }
  );
};

const addCylinder = (e) => {
  openCylinderModal(e).then(
    (resolve) => {
      $(".empty-scene").remove();
      let cylinderObj = resolve;
      createShape("cylinder", sphereButtonClicks, cylinderObj);
    },
    (reject) => {
      console.log(reject);
    }
  );
};

var addSphereBtn = document.querySelector("#sphere-button");
addSphereBtn.addEventListener("click", addSphere);

var addCubeBtn = document.querySelector("#cube-button");
addCubeBtn.addEventListener("click", addCube);

var addCylinderBtn = document.querySelector("#cylinder-button");
addCylinderBtn.addEventListener("click", addCylinder);

$(document).ready(function () {
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
