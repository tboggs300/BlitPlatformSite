// import { getNumberOfPickedMeshes } from "../Create/CreateActions";

import { scene } from "../../../../index.js";

function getNumberOfPickedMeshes() {
  var numberOfPickedMeshes = 0;
  scene.meshes.forEach((mesh) => {
    if (mesh.showBoundingBox) {
      numberOfPickedMeshes += 1;
    }
  });
  return numberOfPickedMeshes;
}

async function getThePickedMesh() {
  var pickedMesh;
  scene.meshes.forEach((mesh) => {
    if (mesh.showBoundingBox) {
      pickedMesh = mesh;
    }
  });
  return pickedMesh;
}

export let gizmo;

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
    switch (Action) {
      case "translation":
        gizmo = new BABYLON.PositionGizmo(utilLayer);

        break;

      case "rotation":
        gizmo = new BABYLON.RotationGizmo(utilLayer);

        break;

      case "scaling":
        gizmo = new BABYLON.ScaleGizmo(utilLayer);
        break;
    }
    gizmo.attachedMesh = selectedMesh;
    gizmo.updateGizmoRotationToMatchAttachedMesh = false;
    gizmo.updateGizmoPositionToMatchAttachedMesh = true;
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
