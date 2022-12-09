import { scene } from "../../../../index.js";
import createComponent from "../../ObjectComponent/ObjectComponent.js";
import { chooseMaterial } from "../../ObjectComponent/ContextMenu.js";
import { selectedMeshes } from "../../ObjectComponent/ObjectComponent.js";

const unionBtn = document.querySelector("#union-button");
const subtractBtn = document.querySelector("#subtract-button");

unionBtn.addEventListener("click", (e) => {
  if (!scene.meshes.length) {
    alert("please add a mesh to the scene");
    return 0;
  }

  if (getNumberOfPickedMeshes() <= 1) {
    alert("please select at least two meshes");
    return 0;
  } else {
    getThePickedMeshes().then((pickedMeshes) => {
      let uniqueId = Date.now().toString();
      const newMesh = BABYLON.Mesh.MergeMeshes(pickedMeshes, true);
      var objectCompoenetContainer = createComponent(
        newMesh,
        "cubeIcon",
        uniqueId,
        scene
      );
      $(".sidebar-elements").append(objectCompoenetContainer);
      pickedMeshes.forEach((mesh) => {
        $("#" + mesh.id).remove();
      });
    });
  }
});

subtractBtn.addEventListener("click", (e) => {
  console.log(scene.meshes);
  if (!scene.meshes.length) {
    alert("please add a mesh to the scene");
    return 0;
  }

  if (getNumberOfPickedMeshes() !== 2) {
    alert("please select two meshes");
    return 0;
  } else {
    getThePickedMeshes().then((pickedMeshes) => {
      var c2cgs = BABYLON.CSG.FromMesh(pickedMeshes[0]);
      pickedMeshes[0].dispose();
      var subcgs = BABYLON.CSG.FromMesh(pickedMeshes[1]);
      pickedMeshes[1].dispose();
      var sub = c2cgs.subtract(subcgs);
      var DefaultMat = chooseMaterial("Default", scene);
      var newMesh = sub.toMesh("subMesh", DefaultMat, scene, false);

      // Create Obj Component for the new mesh
      let uniqueId = Date.now().toString();
      var objectCompoenetContainer = createComponent(
        newMesh,
        "cubeIcon",
        uniqueId,
        scene
      );
      $(".sidebar-elements").append(objectCompoenetContainer);

      // Remove Obj Component for the two meshes
      pickedMeshes.forEach((mesh) => {
        $("#" + mesh.id).remove();
      });
    });
  }
});

function getNumberOfPickedMeshes() {
  return selectedMeshes.length;
}

export async function getThePickedMeshes() {
  return selectedMeshes;
}
