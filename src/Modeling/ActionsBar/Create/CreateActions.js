import { scene } from "../../../../index.js";
import { frameCamera } from "../../Scene/BabylonScene.js";
import createComponent from "../../ObjectComponent/ObjectComponent.js";
import { chooseMaterial } from "../../ObjectComponent/ContextMenu.js";

import { openCubeModal, closeCubeModal } from "./Modals/ModalCostumizedCube.js";
import {
  openSphereModal,
  closeSphereModal,
} from "./Modals/ModalCostumizedSphere.js";
import {
  openCylinderModal,
  closeCylinderModal,
} from "./Modals/ModalCostumizedCylinder.js";

import { actions } from "../../../../index.js";

// var ListOfMeshes = {};

// Upload STL File ------------------------------------//
export function loadMesh(fileName, url, extension, s) {
  BABYLON.Scene;
  let uniqueId = Date.now().toString();
  BABYLON.SceneLoader.ImportMesh(
    "",
    "",
    url,
    scene,
    function (newMeshes) {
      const mesh = newMeshes[0];
      mesh.name = fileName;
      mesh.id = uniqueId;
      mesh.scaling = new BABYLON.Vector3(s, s, s);
      mesh.rotation = new BABYLON.Vector3(0, 0, 0);
      mesh.position = new BABYLON.Vector3(0, 0, 0);
      mesh.material = new BABYLON.NormalMaterial("stlMaterial", scene);
      $(".empty-scene").remove();

      mesh.material = new BABYLON.NormalMaterial(fileName, scene);
      if (getNumberOfPickedMeshes() > 0) {
        mesh.visibility = 0.5;
      }

      const objectCompoenetContainer = createComponent(
        mesh,
        "meshIcon",
        uniqueId,
        scene
      );
      $(".sidebar-elements").append(objectCompoenetContainer);
      frameCamera(1.5, mesh);

      actions.push({
        mesh: [url, mesh],
        meshId: fileName,
        action: "add",
        objectCompoenetContainer: objectCompoenetContainer,
        type: "mesh",
      });
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
export function createShape(meshType, uniqueId, shapeObj) {
  let mesh;
  let objectCompoenetContainer;
  switch (meshType) {
    case "sphere":
      let sphereObj = shapeObj;
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

      mesh.id = uniqueId;
      mesh.material = chooseMaterial(sphereObj.material, scene);

      objectCompoenetContainer = createComponent(
        mesh,
        "sphereIcon",
        uniqueId,
        scene
      );

      break;
    case "cube":
      let cubeObj = shapeObj;
      mesh = BABYLON.MeshBuilder.CreateBox(cubeObj.name, {}, scene);

      mesh.scaling.x = cubeObj.xmax - cubeObj.xmin;
      mesh.scaling.y = cubeObj.ymax - cubeObj.ymin;
      mesh.scaling.z = cubeObj.zmax - cubeObj.zmin;

      mesh.position.x =
        (parseFloat(cubeObj.xmax) + parseFloat(cubeObj.xmin)) / 2;
      mesh.position.y =
        (parseFloat(cubeObj.ymax) + parseFloat(cubeObj.ymin)) / 2;
      mesh.position.z =
        (parseFloat(cubeObj.zmax) + parseFloat(cubeObj.zmin)) / 2;

      mesh.id = uniqueId;
      mesh.material = chooseMaterial(cubeObj.material, scene);

      // frameCamera(1.5, mesh);

      objectCompoenetContainer = createComponent(
        mesh,
        "cubeIcon",
        uniqueId,
        scene
      );
      break;
    case "cylinder":
      let cylinderObj = shapeObj;

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

      mesh.id = uniqueId;
      mesh.material = chooseMaterial(cylinderObj.material, scene);

      objectCompoenetContainer = createComponent(
        mesh,
        "cylinderIcon",
        uniqueId,
        scene
      );
      break;
    default:
      console.log("default");
  }

  $(".sidebar-elements").append(objectCompoenetContainer);

  actions.push({
    mesh: mesh,
    meshId: uniqueId,
    action: "add",
    objectCompoenetContainer: objectCompoenetContainer,
    type: meshType,
  });

  if (getNumberOfPickedMeshes() > 0) {
    mesh.visibility = 0.5;
  }
  return mesh;
}

const addSphere = (e) => {
  closeCubeModal(e);
  closeCylinderModal(e);
  openSphereModal(e).then(
    (resolve) => {
      $(".empty-scene").remove();
      let sphereObj = resolve;
      let uniqueId = Date.now().toString();
      createShape("sphere", uniqueId, sphereObj);
    },
    (reject) => {
      console.log(reject);
    }
  );
};

const addCube = (e) => {
  closeSphereModal(e);
  closeCylinderModal(e);
  openCubeModal(e).then(
    (resolve) => {
      $(".empty-scene").remove();
      let cubeObj = resolve;
      let uniqueId = Date.now().toString();
      createShape("cube", uniqueId, cubeObj);
    },
    (reject) => {
      console.log(reject);
    }
  );
};

const addCylinder = (e) => {
  closeSphereModal(e);
  closeCubeModal(e);
  openCylinderModal(e).then(
    (resolve) => {
      $(".empty-scene").remove();
      let cylinderObj = resolve;
      let uniqueId = Date.now().toString();
      createShape("cylinder", uniqueId, cylinderObj);
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
