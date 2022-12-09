import { getNumberOfPickedMeshes } from "../ActionsBar/Create/CreateActions.js";
import { createContainer } from "./Collection.js";
import { selectedMeshes } from "./ObjectComponent.js";

export const chooseMaterial = (materialStr, scene) => {
  var material;
  switch (materialStr) {
    case "Default":
      material = new BABYLON.NormalMaterial("Default", scene);
      break;

    case "Red":
      material = new BABYLON.StandardMaterial("Red", scene);
      material.diffuseColor = new BABYLON.Color3(1, 0, 0);
      break;

    case "Green":
      material = new BABYLON.StandardMaterial("Green", scene);
      material.diffuseColor = new BABYLON.Color3(0, 1, 0);
      break;

    case "Blue":
      material = new BABYLON.StandardMaterial("Blue", scene);
      material.diffuseColor = new BABYLON.Color3(0, 0, 1);
      break;
  }
  return material;
};

const createObjectContextMenu = (mesh, objectCompoenetContainer, scene) => {
  const objectContextMenu = document.createElement("div");
  objectContextMenu.className = "wrapper";

  const menu = document.createElement("ul");
  menu.className = "menu";

  // ---------------- Material --------------
  const itemMaterial = document.createElement("li");
  itemMaterial.className = "item material";

  // Span Div
  const spanDiv = document.createElement("div");
  const spanMaterial = document.createElement("span");
  spanDiv.innerHTML = "Material";
  spanDiv.appendChild(spanMaterial);

  // Arrow Icon
  const arrowIcon = document.createElement("i");
  arrowIcon.className = "icon arrowIcon";

  // Material Menu
  const materialMenu = document.createElement("ul");
  materialMenu.className = "material-menu";

  // Default
  const liDefault = document.createElement("li");
  liDefault.className = "item kamalqraytou";
  const spanDefault = document.createElement("span");
  spanDefault.innerText = "Default";
  liDefault.appendChild(spanDefault);

  // Red
  const liRed = document.createElement("li");
  liRed.className = "item kamalqraytou";
  const spanRed = document.createElement("span");
  spanRed.innerText = "Red";
  liRed.appendChild(spanRed);

  // Green
  const liGreen = document.createElement("li");
  liGreen.className = "item kamalqraytou";
  const spanGreen = document.createElement("span");
  spanGreen.innerText = "Green";
  liGreen.appendChild(spanGreen);

  // Blue
  const liBlue = document.createElement("li");
  liBlue.className = "item kamalqraytou";
  const spanBlue = document.createElement("span");
  spanBlue.innerText = "Blue";
  liBlue.appendChild(spanBlue);

  const selectedMaterialIcon = document.createElement("i");
  selectedMaterialIcon.className = "icon selectIcon";
  selectedMaterialIcon.id = mesh.id;

  switch (mesh.material.id) {
    case "Default":
      liDefault.appendChild(selectedMaterialIcon);
      break;
    case "Red":
      liRed.appendChild(selectedMaterialIcon);
      break;
    case "Green":
      liGreen.appendChild(selectedMaterialIcon);
      break;
    case "Blue":
      liBlue.appendChild(selectedMaterialIcon);
      break;
  }

  // Create Differents Materials
  var matDefault = new BABYLON.NormalMaterial("defaultMaterial", scene);

  var matRed = new BABYLON.StandardMaterial("Red", scene);
  matRed.diffuseColor = new BABYLON.Color3(1, 0, 0);

  var matGreen = new BABYLON.StandardMaterial("Green", scene);
  matGreen.diffuseColor = new BABYLON.Color3(0, 1, 0);

  var matBlue = new BABYLON.StandardMaterial("Blue", scene);
  matBlue.diffuseColor = new BABYLON.Color3(0, 0, 1);
  // Select Material
  liDefault.addEventListener("click", () => {
    mesh.material = matDefault;

    $("#" + mesh.id + ".icon.selectIcon").remove();

    // Create Material Selected Icon
    const selectedMaterialIcon = document.createElement("i");
    selectedMaterialIcon.className = "icon selectIcon";
    selectedMaterialIcon.id = mesh.id;

    liDefault.appendChild(selectedMaterialIcon);
  });
  liRed.addEventListener("click", () => {
    mesh.material = matRed;
    $("#" + mesh.id + ".icon.selectIcon").remove();

    const selectedMaterialIcon = document.createElement("i");
    selectedMaterialIcon.className = "icon selectIcon";
    selectedMaterialIcon.id = mesh.id;

    liRed.appendChild(selectedMaterialIcon);
  });
  liGreen.addEventListener("click", () => {
    mesh.material = matGreen;
    $("#" + mesh.id + ".icon.selectIcon").remove();

    const selectedMaterialIcon = document.createElement("i");
    selectedMaterialIcon.className = "icon selectIcon";
    selectedMaterialIcon.id = mesh.id;

    liGreen.appendChild(selectedMaterialIcon);
  });
  liBlue.addEventListener("click", () => {
    mesh.material = matBlue;
    $("#" + mesh.id + ".icon.selectIcon").remove();

    const selectedMaterialIcon = document.createElement("i");
    selectedMaterialIcon.className = "icon selectIcon";
    selectedMaterialIcon.id = mesh.id;

    liBlue.appendChild(selectedMaterialIcon);
  });

  materialMenu.appendChild(liDefault);
  materialMenu.appendChild(liRed);
  materialMenu.appendChild(liGreen);
  materialMenu.appendChild(liBlue);

  itemMaterial.appendChild(spanDiv);
  itemMaterial.appendChild(arrowIcon);
  itemMaterial.appendChild(materialMenu);

  // --------------- Delete ---------------
  const itemDelete = document.createElement("li");
  itemDelete.className = `item deleteItem ${mesh.id}`;
  const deleteSpan = document.createElement("span");
  deleteSpan.innerText = "Delete";
  itemDelete.appendChild(deleteSpan);

  itemDelete.addEventListener("click", () => {
    $("#" + objectCompoenetContainer.id).remove();
    mesh.dispose();

    // When the selected mesh is deleted -> turn visibility of the other meshes to 1
    console.log(selectedMeshes.length);
    if (selectedMeshes.length == 0) {
      scene.meshes.forEach((mesh) => {
        mesh.visibility = 1;
      });
    }

    // When we delete the last mesh
    if (scene.meshes.length == 1) {
      const emptyScene = document.createElement("p");
      emptyScene.className = "empty-scene";
      emptyScene.innerText = "Empty Scene";
      $(".sidebar-elements").append(emptyScene);
    }
  });

  const itemCreateContainer = document.createElement("li");
  itemCreateContainer.className = `item  ${mesh.id}`;
  const createContainerSpan = document.createElement("span");
  createContainerSpan.innerText = "Create Container";
  itemCreateContainer.appendChild(createContainerSpan);
  itemCreateContainer.addEventListener("click", () => {
    const assetContainer = createContainer();
    assetContainer.appendChild(objectCompoenetContainer);
  });

  // ---------------- Rename Object ---------------

  // Append the two childs to menu
  menu.appendChild(itemMaterial);
  menu.appendChild(itemCreateContainer);
  menu.appendChild(itemDelete);

  objectContextMenu.appendChild(menu);
  document.body.appendChild(objectContextMenu);

  // When Right clicking on a Object in the left panel
  objectCompoenetContainer.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    var rect = objectCompoenetContainer.getBoundingClientRect();
    var x = e.offsetX;
    var y = e.offsetY;
    objectContextMenu.style.left = `${x + rect.left}px`;
    objectContextMenu.style.top = `${y + rect.top}px`;
    objectContextMenu.style.animation = "0.5s ease";
    objectContextMenu.style.visibility = "visible";
  });

  // When clicking outside of the Object Context Menu
  document.addEventListener("click", (e) => {
    objectContextMenu.style.visibility = "hidden";
  });
};

export default createObjectContextMenu;
