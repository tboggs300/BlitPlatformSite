import { scene } from "../../../index.js";

export function createContainer() {
  const assetContainer = document.createElement("div");
  assetContainer.className = "asset-container";

  const assetContainerHeader = document.createElement("div");
  assetContainerHeader.className = "asset-container-header objComp";

  const assetContainerHeaderText = document.createElement("p");
  assetContainerHeaderText.innerText = "Container";
  assetContainerHeaderText.className = "objComp";
  assetContainerHeaderText.style.width = "100%";

  const assetContainerHeaderSelectBtn = document.createElement("button");
  assetContainerHeaderSelectBtn.className = "objComp selectAll unselect";
  assetContainerHeaderSelectBtn.title = "Select all meshes in the container";

  assetContainerHeaderSelectBtn.addEventListener("click", (e) => {
    // Select Icon
    if (assetContainerHeaderSelectBtn.classList.contains("unselect")) {
      assetContainerHeaderSelectBtn.className = "objComp selectAll select";
      assetContainerHeaderSelectBtn.title =
        "Deselect all meshes in the container";
      for (let i = 1; i < assetContainer.children.length; i++) {
        let objectID = assetContainer.children[i].id;
        let mesh = scene.getMeshById(objectID);
        mesh.showBoundingBox = true;
      }
    } else if (assetContainerHeaderSelectBtn.classList.contains("select")) {
      assetContainerHeaderSelectBtn.className = "objComp selectAll unselect";
      assetContainerHeaderSelectBtn.title =
        "Select all meshes in the container";
      for (let i = 1; i < assetContainer.children.length; i++) {
        let objectID = assetContainer.children[i].id;
        let mesh = scene.getMeshById(objectID);
        mesh.showBoundingBox = false;
      }
    }

    // Functionality
  });

  assetContainerHeader.appendChild(assetContainerHeaderText);
  assetContainerHeader.appendChild(assetContainerHeaderSelectBtn);
  assetContainer.appendChild(assetContainerHeader);

  assetContainer.addEventListener("dragover", (ev) => {
    if (!ev.target.classList.contains("objComp")) {
      ev.preventDefault();
    }
    ev.dataTransfer.dropEffect = "move";
  });

  assetContainer.addEventListener("drop", (ev) => {
    var data = ev.dataTransfer.getData("application/my-app");
    var parentdiv = ev.target.parentNode;
    parentdiv.appendChild(document.getElementById(data));
  });

  $(".sidebar-elements").append(assetContainer);
  return assetContainer;
}
