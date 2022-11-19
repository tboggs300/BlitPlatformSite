import { scene } from "../../../../index.js";
import createComponent from "../../ObjectComponent/ObjectComponent.js";

const unionBtn = document.querySelector("#union-button");

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
      const newMesh = BABYLON.Mesh.MergeMeshes(pickedMeshes, false);
      var objectCompoenetContainer = createComponent(
        newMesh,
        "cubeIcon",
        scene
      );
      $(".sidebar-elements").append(objectCompoenetContainer);
    });
  }
});

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
