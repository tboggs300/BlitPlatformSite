const createContainerBtn = document.querySelector("#create-container-button");
createContainerBtn.addEventListener("click", (e) => {
  createContainer();
});

export function createContainer() {
  const assetContainer = document.createElement("div");
  assetContainer.className = "asset-container ";

  const assetContainerHeader = document.createElement("div");
  assetContainerHeader.className = "asset-container-header objComp";

  const assetContainerHeaderText = document.createElement("p");
  assetContainerHeaderText.innerText = "Container";
  assetContainerHeaderText.className = "objComp";

  const assetContainerHeaderSelectBtn = document.createElement("button");
  assetContainerHeaderSelectBtn.className = "objComp";

  assetContainerHeader.appendChild(assetContainerHeaderText);
  assetContainerHeader.appendChild(assetContainerHeaderSelectBtn);

  assetContainer.appendChild(assetContainerHeader);
  //   assetContainer.appendChild(parag);
  assetContainer.addEventListener("dragover", (ev) => {
    if (!ev.target.classList.contains("objComp")) {
      ev.preventDefault();
    }
    ev.dataTransfer.dropEffect = "move";
  });

  assetContainer.addEventListener("drop", (ev) => {
    console.log(ev.target);
    var data = ev.dataTransfer.getData("application/my-app");
    var parentdiv = ev.target.parentNode;
    console.log(parentdiv);

    parentdiv.appendChild(document.getElementById(data));
  });

  $(".sidebar-elements").append(assetContainer);
}
