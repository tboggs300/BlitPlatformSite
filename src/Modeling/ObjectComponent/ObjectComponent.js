import createObjectContextMenu from "./ContextMenu.js";
import { getNumberOfPickedMeshes } from "../ActionsBar/Create/CreateActions.js";
import "./Collection.js";

export let selectedMeshes = [];

export default function createComponent(mesh, meshIcon, uniqueId, scene) {
  const objectCompoenetContainer = document.createElement("div");
  objectCompoenetContainer.className = "objectInTheScene objComp";
  objectCompoenetContainer.id = uniqueId;
  objectCompoenetContainer.draggable = true;

  objectCompoenetContainer.addEventListener("dragstart", (ev) => {
    // ev.preventDefault();
    ev.dataTransfer.setData("application/my-app", ev.target.id);
    ev.dataTransfer.dropEffect = "move";
  });

  const MeshObject = {
    HtmlElement: objectCompoenetContainer,
    mesh: mesh,
    isSelected: false,
  };

  //   ListOfMeshes[mesh.id] = MeshObject;
  //   console.log(ListOfMeshes);

  // Object Icon and Name
  const objIcon = document.createElement("p");
  objIcon.className = `objIcon ${meshIcon} objComp`;
  const objName = document.createElement("p");
  objName.innerText = mesh.name;
  objName.className = "objName objComp";
  objectCompoenetContainer.appendChild(objIcon);
  objectCompoenetContainer.appendChild(objName);

  // Toggle mesh Visivility
  const hideShowBtn = document.createElement("button");
  hideShowBtn.className = "hideShow show objComp";
  hideShowBtn.title = "hide";
  hideShowBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (mesh.isEnabled()) {
      e.target.className = "hideShow hide objComp";
      hideShowBtn.title = "show";
      mesh.setEnabled(false);
    } else {
      e.target.className = "hideShow show objComp";
      hideShowBtn.title = "hide";
      mesh.setEnabled(true);
    }
  });
  objectCompoenetContainer.appendChild(hideShowBtn);

  // Select Mesh - Ctrl click on component for multiple select
  objectCompoenetContainer.addEventListener("click", (event) => {
    // When user unselect a mesh
    if (mesh.showBoundingBox) {
      mesh.showBoundingBox = false;
      if (event.ctrlKey == false) {
        scene.meshes.forEach((mesh) => {
          mesh.visibility = 1;
        });
        let meshIndex = selectedMeshes.indexOf(mesh);
        selectedMeshes.splice(meshIndex, 1);
      }
    }

    // When user select a mesh
    else {
      if (event.ctrlKey == false) {
        scene.meshes.forEach((mesh) => {
          mesh.showBoundingBox = false;
          mesh.visibility = 0.5;
        });
        selectedMeshes = [];
      }
      mesh.showBoundingBox = true;
      mesh.visibility = 1;
      selectedMeshes.push(mesh);
      //   ListOfMeshes[mesh.id].isSelected = true;
    }
    console.log("selected meshes : ", selectedMeshes);

    scene.meshes.forEach((mesh) => {
      // If no mesh is selected
      if (mesh.showBoundingBox === false && getNumberOfPickedMeshes() == 0) {
        mesh.visibility = 1;
      }
      // If at least one mesh is already selected
      else if (
        mesh.showBoundingBox === false &&
        getNumberOfPickedMeshes() > 0
      ) {
        mesh.visibility = 0.5;
      }
    });
  });

  // ---------------- Right Click Event - Object Context Menu ------------------
  createObjectContextMenu(mesh, objectCompoenetContainer, scene);

  return objectCompoenetContainer;
}
