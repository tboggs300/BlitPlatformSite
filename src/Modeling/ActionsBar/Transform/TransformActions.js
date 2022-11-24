// import { getNumberOfPickedMeshes } from "../Create/CreateActions";

import { scene } from "../../../../index.js";
import { openTranslateModal } from "./Modals/ModalTranslate.js";
import { openRotateModal } from "./Modals/ModalRotate.js";
import { openScaleModal } from "./Modals/ModalScale.js";

function getNumberOfPickedMeshes() {
  var numberOfPickedMeshes = 0;
  scene.meshes.forEach((mesh) => {
    if (mesh.showBoundingBox) {
      numberOfPickedMeshes += 1;
    }
  });
  return numberOfPickedMeshes;
}

export async function getThePickedMeshes() {
  var pickedMeshes = [];
  scene.meshes.forEach((mesh) => {
    if (mesh.showBoundingBox) {
      pickedMeshes.push(mesh);
    }
  });
  return pickedMeshes;
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
    alert("please select at least one mesh");
    return 0;
  }

  getThePickedMeshes().then((selectedMeshes) => {
    var utilLayer = new BABYLON.UtilityLayerRenderer(scene);

    let selectedMesh = selectedMeshes.length === 1 ? selectedMeshes[0] : null;

    // One action at a time
    if (gizmo) {
      gizmo.attachedMesh = null;
    }
    // Cancel Button

    let PreviousPositions = [];

    switch (Action) {
      case "translation":
        if (selectedMesh !== null) {
          xt = selectedMesh.position.x;
          yt = selectedMesh.position.y;
          zt = selectedMesh.position.z;
        } else {
          selectedMeshes.forEach((mesh) => {
            PreviousPositions.push({
              meshId: mesh.id,
              x: mesh.position.x,
              y: mesh.position.y,
              z: mesh.position.z,
            });
          });
        }

        openTranslateModal(e, selectedMeshes).then(
          (resolve) => {
            console.log(resolve);
          },
          (reject) => {
            if (selectedMesh !== null) {
              selectedMesh.position.x = xt;
              selectedMesh.position.y = yt;
              selectedMesh.position.z = zt;
            } else {
              PreviousPositions.forEach((meshPositionObject) => {
                let mesh = scene.getMeshById(meshPositionObject.meshId);
                mesh.position.x = meshPositionObject.x;
                mesh.position.y = meshPositionObject.y;
                mesh.position.z = meshPositionObject.z;
              });
            }
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
