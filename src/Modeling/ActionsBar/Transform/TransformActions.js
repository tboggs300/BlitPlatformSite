// import { getNumberOfPickedMeshes } from "../Create/CreateActions";

import { scene } from "../../../../index.js";
import {
  openTranslateModal,
  closeTranslateModal,
} from "./Modals/ModalTranslate.js";
import { openRotateModal, closeRotateModal } from "./Modals/ModalRotate.js";

import { openScaleModal, closeScaleModal } from "./Modals/ModalScale.js";

function getNumberOfPickedMeshes() {
  var numberOfPickedMeshes = 0;
  scene.meshes.forEach((mesh) => {
    if (mesh.showBoundingBox) {
      numberOfPickedMeshes += 1;
    }
  });
  return numberOfPickedMeshes;
}

export async function getThePickedMesh() {
  var pickedMesh;
  scene.meshes.forEach((mesh) => {
    if (mesh.showBoundingBox) {
      pickedMesh = mesh;
    }
  });
  return pickedMesh;
}

export let gizmo;

let xt, yt, zt;
let xr, yr, zr;
let xs, ys, zs;

const transformMeshBtnHandler = (e, Action) => {
  if (!scene.meshes.length) {
    alert("please add a mesh to the scene");
    return 0;
  }
  if (getNumberOfPickedMeshes() === 0) {
    alert("please select a mesh");
    return 0;
  }
  if (getNumberOfPickedMeshes() > 1) {
    alert("please select only one mesh");
    return 0;
  }

  getThePickedMesh().then((selectedMesh) => {
    var utilLayer = new BABYLON.UtilityLayerRenderer(scene);

    // One action at a time
    if (gizmo) {
      gizmo.attachedMesh = null;
    }
    // Cancel Button

    switch (Action) {
      case "translation":
        xt = selectedMesh.position.x;
        yt = selectedMesh.position.y;
        zt = selectedMesh.position.z;

        // closeRotateModal(e, xr, yr, zr);
        // closeScaleModal(e, xs, ys, zs);

        gizmo = new BABYLON.PositionGizmo(utilLayer);
        gizmo.attachedMesh = null;
        gizmo.updateGizmoRotationToMatchAttachedMesh = false;
        gizmo.updateGizmoPositionToMatchAttachedMesh = true;
        gizmo.snapDistance = 0.1;

        openTranslateModal(e, selectedMesh, gizmo).then(
          (resolve) => {
            console.log(resolve);
            console.log(
              "Current Position : ",
              selectedMesh.position.x,
              selectedMesh.position.y,
              selectedMesh.position.z
            );
            gizmo.attachedMesh = null;
          },
          (reject) => {
            selectedMesh.position.x = xt;
            selectedMesh.position.y = yt;
            selectedMesh.position.z = zt;
            gizmo.attachedMesh = null;
            console.log(reject);
            console.log(
              "Current Position : ",
              selectedMesh.position.x,
              selectedMesh.position.y,
              selectedMesh.position.z
            );
          }
        );

        break;

      case "rotation":
        xr = selectedMesh.rotation.x;
        yr = selectedMesh.rotation.y;
        zr = selectedMesh.rotation.z;

        // closeTranslateModal(e, xt, yt, zt);
        // closeScaleModal(e, xs, ys, zs);

        gizmo = new BABYLON.RotationGizmo(utilLayer);
        // gizmo.attachedMesh = selectedMesh;
        gizmo.attachedMesh = null;
        gizmo.updateGizmoRotationToMatchAttachedMesh = false;
        gizmo.updateGizmoPositionToMatchAttachedMesh = true;
        gizmo.snapDistance = 0.00001;

        // Cancel Button

        openRotateModal(e, selectedMesh, gizmo).then(
          (resolve) => {
            console.log(resolve);
            console.log(
              "Current Rotation : ",
              selectedMesh.rotation.x,
              selectedMesh.rotation.y,
              selectedMesh.rotation.z
            );
            gizmo.attachedMesh = null;
          },
          (reject) => {
            selectedMesh.rotation.x = xr;
            selectedMesh.rotation.y = yr;
            selectedMesh.rotation.z = zr;
            gizmo.attachedMesh = null;
            console.log(reject);
            console.log(
              "Current Rotation : ",
              selectedMesh.rotation.x,
              selectedMesh.rotation.y,
              selectedMesh.rotation.z
            );
          }
        );

        break;

      case "scaling":
        xs = selectedMesh.scaling.x;
        ys = selectedMesh.scaling.y;
        zs = selectedMesh.scaling.z;

        // closeRotateModal(e, xr, yr, zr);
        // closeTranslateModal(e, xt, yt, zt);

        gizmo = new BABYLON.ScaleGizmo(utilLayer);
        gizmo.attachedMesh = null;
        gizmo.snapDistance = 0.00001;

        // Cancel Button

        openScaleModal(e, selectedMesh, gizmo).then(
          (resolve) => {
            console.log(resolve);
            console.log(
              "Current Scaling : ",
              selectedMesh.scaling.x,
              selectedMesh.scaling.y,
              selectedMesh.scaling.z
            );
            gizmo.attachedMesh = null;
          },
          (reject) => {
            selectedMesh.scaling.x = xs;
            selectedMesh.scaling.y = ys;
            selectedMesh.scaling.z = zs;
            gizmo.attachedMesh = null;
            console.log(reject);
            console.log(
              "Current Scaling : ",
              selectedMesh.scaling.x,
              selectedMesh.scaling.y,
              selectedMesh.scaling.z
            );
          }
        );
        break;
    }
  });
};

const translateMeshBtn = document.querySelector("#translate-button");
translateMeshBtn.addEventListener("click", (e) => {
  transformMeshBtnHandler(e, "translation");
});

const rotateMeshBtn = document.querySelector("#rotate-button");
rotateMeshBtn.addEventListener("click", (e) =>
  transformMeshBtnHandler(e, "rotation")
);

const scaleMeshBtn = document.querySelector("#scale-button");
scaleMeshBtn.addEventListener("click", (e) =>
  transformMeshBtnHandler(e, "scaling")
);
