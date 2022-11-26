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
    switch (Action) {
      case "translation":
        // Save Previous Position
        let PreviousPositions = [];
        selectedMeshes.forEach((mesh) => {
          PreviousPositions.push({
            meshId: mesh.id,
            x: mesh.position.x,
            y: mesh.position.y,
            z: mesh.position.z,
          });
        });

        openTranslateModal(e, selectedMeshes).then(
          (resolve) => {
            console.log(resolve);
          },
          (reject) => {
            console.log(reject);
            PreviousPositions.forEach((meshPositionObject) => {
              let mesh = scene.getMeshById(meshPositionObject.meshId);
              mesh.position.x = meshPositionObject.x;
              mesh.position.y = meshPositionObject.y;
              mesh.position.z = meshPositionObject.z;
            });
          }
        );

        break;

      case "rotation":
        let PreviousRotations = [];
        selectedMeshes.forEach((mesh) => {
          PreviousRotations.push({
            meshId: mesh.id,
            x: mesh.rotation.x,
            y: mesh.rotation.y,
            z: mesh.rotation.z,
          });
        });

        openRotateModal(e, selectedMeshes).then(
          (resolve) => {
            console.log(resolve);
          },
          (reject) => {
            console.log(reject);
            PreviousRotations.forEach((meshRotationObject) => {
              let mesh = scene.getMeshById(meshRotationObject.meshId);
              mesh.rotation.x = meshRotationObject.x;
              mesh.rotation.y = meshRotationObject.y;
              mesh.rotation.z = meshRotationObject.z;
            });
          }
        );

        break;

      case "scaling":
        let PreviousScale = [];
        selectedMeshes.forEach((mesh) => {
          PreviousScale.push({
            meshId: mesh.id,
            x: mesh.scaling.x,
            y: mesh.scaling.y,
            z: mesh.scaling.z,
          });
        });

        openScaleModal(e, selectedMeshes).then(
          (resolve) => {
            console.log(resolve);
          },
          (reject) => {
            console.log(reject);
            PreviousScale.forEach((meshScaleObject) => {
              let mesh = scene.getMeshById(meshScaleObject.meshId);
              mesh.scaling.x = meshScaleObject.x;
              mesh.scaling.y = meshScaleObject.y;
              mesh.scaling.z = meshScaleObject.z;
            });
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
