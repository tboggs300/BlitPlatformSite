import { undos, scene, actions } from "../../../index.js";

$(document).ready(function () {
  // CTRL Y
  document.addEventListener("keydown", (e) => {
    if (e.key === "y" && e.ctrlKey) {
      if (!undos.length) {
        return;
      }
      let undoObj = undos[0];
      switch (undoObj.action) {
        case "add":
          break;

        case "transform":
          undoObj.CurrentPositions.forEach((cr) => {
            let mesh = scene.getMeshById(cr.meshId);
            mesh[undoObj.type].x = cr.x;
            mesh[undoObj.type].y = cr.y;
            mesh[undoObj.type].z = cr.z;
          });
          break;
      }
      // -undo
      undos.splice(0, 1);
      console.log("Undos List : ", undos);
      // -redo
      actions.push(undoObj);
      console.log("Redos List : ", actions);
    }
  });
});

//   const file = BABYLON.STLExport.CreateSTL(
//     undoObj.mesh,
//     true,
//     "Test3",
//     false,
//     false
//   );
//   BABYLON.SceneLoader.ImportMesh(
//     "",
//     "",
//     url,
//     scene,
//     function (newMeshes) {
//       newMeshes[0].scaling = new BABYLON.Vector3(1, 1, 1);
//       newMeshes[0].rotation = new BABYLON.Vector3(0, 0, 0);
//       newMeshes[0].position = new BABYLON.Vector3(0, 0, 0);
//       newMeshes[0].material = new BABYLON.NormalMaterial(
//         "stlMaterial",
//         scene
//       );
//     },
//     null,
//     null,
//     extension
//   );
