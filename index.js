// ------------------------- Engine - Scene - Camera - Light ------------------------ //

// Link the canvas with the Babylon.js Engine
const canvas = document.querySelectorAll("canvas")[0];
const engine = new BABYLON.Engine(canvas, true, {});
engine.disablePerformanceMonitorInBackground = true;
engine.disableWebGL2Support = false;
engine.preserveDrawingBuffer = false;
engine.enableOfflineSupport = false;
engine.doNotHandleContextLost = false;
engine.loadingUIBackgroundColor = "#000000e1";

// Create a scene
const scene = createScene(engine);

// Render the scene
engine.runRenderLoop(function () {
  scene.render();
  scene.autoClear = true;
  if (scene.meshes.length == 0) {
    clicks = 0;
  }
});

var matDefault = new BABYLON.NormalMaterial("defaultMaterial", scene);

var matRed = new BABYLON.StandardMaterial("Red", scene);
matRed.diffuseColor = new BABYLON.Color3(1, 0, 0);

var matGreen = new BABYLON.StandardMaterial("Green", scene);
matGreen.diffuseColor = new BABYLON.Color3(0, 1, 0);

var matBlue = new BABYLON.StandardMaterial("Blue", scene);
matBlue.diffuseColor = new BABYLON.Color3(0, 0, 1);

function createScene(engine) {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
  scene.autoClear = false;
  scene.autoClearDepthAndStencil = false;
  scene.blockMaterialDirtyMechanism = true;

  const camera = new BABYLON.ArcRotateCamera(
    "camera",
    0,
    0,
    10,
    BABYLON.Vector3.Zero(),
    scene
  );
  camera.attachControl(canvas, true);
  camera.setPosition(new BABYLON.Vector3(-1, 0.5, 1)); // initial
  camera.setTarget(BABYLON.Vector3.Zero());
  setCamera(camera);

  const ambient = new BABYLON.HemisphericLight(
    "ambient",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  ambient.diffuse = new BABYLON.Color3(0.8, 0.8, 0.8);
  ambient.specular = new BABYLON.Color3(0.7, 0.7, 0.7);
  ambient.groundColor = new BABYLON.Color3(0.6, 0.6, 0.6);
  ambient.intensity = 0.5;

  const light = new BABYLON.DirectionalLight(
    "direct",
    new BABYLON.Vector3(0, -1, 0),
    scene
  );
  setLightPositionByAngle(light, 120, 50, 100);
  light.autoUpdateExtends = true; // to REFRESHRATE_RENDER_ONCE
  light.diffuse = BABYLON.Color3.FromHexString("#ffffbb");
  light.intensity = 1;

  const light2 = new BABYLON.DirectionalLight(
    "direct_noshadow",
    new BABYLON.Vector3(0, -1, 0),
    scene
  );
  setLightPositionByAngle(light2, 310, 50, 100);
  light2.diffuse = BABYLON.Color3.FromHexString("#ffffbb");
  light2.intensity = 1;
  return scene;
}

function frameCamera(radius = 1.5, mesh) {
  scene.activeCamera.useFramingBehavior = true;
  scene.activeCamera.framingBehavior.radiusScale = radius;
  // const currentMesh = scene.getMeshByName("currentMesh");
  scene.activeCamera.setTarget(mesh);
  // scene.activeCamera.target = new BABYLON.Vector3(0, 0.01, 0); // workaround: prevent panning-lock in certain conditions
  setCamera(scene.activeCamera); // need to re-apply settings
  scene.activeCamera.useFramingBehavior = true;
}

function setCamera(camera) {
  camera.useFramingBehavior = true;
  camera.framingBehavior.zoomStopsAnimation = true;
  camera.framingBehavior.radiusScale = 1.5;
  camera.framingBehavior.positionScale = 0.5;
  camera.framingBehavior.defaultElevation = 0.3;
  camera.framingBehavior.elevationReturnTime = 1500;
  camera.framingBehavior.elevationReturnWaitTime = 1000;
  camera.framingBehavior.framingTime = 1000;
  camera.lowerRadiusLimit = 5;
  camera.upperRadiusLimit = 500;
  camera.wheelPrecision = 10;
  camera.panningSensibility = 300;
  camera.pinchPrecision = 100;
}

function setLightPositionByAngle(light, angle, distance, height) {
  const x = Math.cos((angle * Math.PI) / 180) * distance;
  const z = Math.sin((angle * Math.PI) / 180) * distance;
  light.position = new BABYLON.Vector3(x, height, z);
  light.setDirectionToTarget(BABYLON.Vector3.Zero());
}

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
  engine.resize();
});

// ---> Event Listener to Upload STL, Create Shape Buttons
$(document).ready(function () {
  let sphereButtonClicks = 0; // for position and naming purpose
  $("#sphere-button").click(function () {
    $(".empty-scene").hide();
    const mesh = createShape("sphere", sphereButtonClicks);
    sphereButtonClicks += 1;

    createComponent(mesh, "sphereIcon");
  });

  let cubeButtonclicks = 0;
  $("#cube-button").click(function () {
    $(".empty-scene").hide();
    const mesh = createShape("cube", cubeButtonclicks);
    cubeButtonclicks += 1;
    createComponent(mesh, "cubeIcon");
  });

  let cylinderButtonclicks = 0;
  $("#cylinder-button").click(function () {
    $(".empty-scene").hide();
    const mesh = createShape("cylinder", cylinderButtonclicks);
    cylinderButtonclicks += 1;
    createComponent(mesh, "cylinderIcon");
  });

  $(".upload-button").click(function () {
    importSTLFile();
  });
});

// Create Shapes : Sphere, Cube, Cylinder --------------//
function createShape(meshType, buttonsClicks) {
  let mesh = 0;
  switch (meshType) {
    case "sphere":
      mesh = BABYLON.MeshBuilder.CreateSphere(
        meshType + buttonsClicks,
        {},
        scene
      );
      break;
    case "cube":
      mesh = BABYLON.MeshBuilder.CreateBox(meshType + buttonsClicks, {}, scene);
      break;

    case "cylinder":
      mesh = BABYLON.MeshBuilder.CreateCylinder(
        meshType + buttonsClicks,
        {},
        scene
      );
      break;
  }
  mesh.material = new BABYLON.NormalMaterial(meshType, scene);
  mesh.position.x = 2 - buttonsClicks;
  buttonsClicks = buttonsClicks + 1;
  if (getNumberOfPickedMeshes() > 0) {
    mesh.visibility = 0.5;
  }
  return mesh;
}

// STL File ------------------------------------//
function importSTLFile() {
  // scene.dispose();
  let input = document.createElement("input");
  input.type = "file";
  input.accept = ".stl";
  input.multiple = true;

  let loadStatus = "hello";

  input.onchange = (_) => {
    // you can use this method to get file and perform respective operations
    let file = input.files[0];
    let fileName = file.name.split(".")[0];
    console.log(fileName);

    let numberUploadedFiles = input.files.length;

    const ext = "." + file.name.split(".").pop().toLowerCase(); //ext|exts

    if (ext !== ".stl") {
      alert(ext + " file format is not supported! Please enter an STL File");
      return 0;
    } else {
      // alert("you uploaded " + numberUploadedFiles + " files");
    }

    const url = URL.createObjectURL(file);
    loadStatus = loadMesh(fileName, url, ext, 1);
  };
  input.click();
}
function loadMesh(fileName, url, extension, s) {
  BABYLON.Scene;
  BABYLON.SceneLoader.ImportMesh(
    "",
    "",
    url,
    scene,
    function (newMeshes) {
      const mesh = newMeshes[0];
      newMeshes[0].name = fileName;
      newMeshes[0].id = fileName;
      newMeshes[0].scaling = new BABYLON.Vector3(s, s, s);
      newMeshes[0].rotation = new BABYLON.Vector3(0, 0, 0);
      newMeshes[0].position = new BABYLON.Vector3(0, 0, 0);
      newMeshes[0].material = new BABYLON.NormalMaterial("currentMesh", scene);
      frameCamera(1.5, newMeshes[0]);

      $(".empty-scene").hide();
      mesh.material = new BABYLON.NormalMaterial(fileName, scene);
      if (getNumberOfPickedMeshes() > 0) {
        mesh.visibility = 0.5;
      }
      createComponent(mesh, "meshIcon");
    },
    null,
    null,
    extension
  );
}

function createObjectContextMenu(mesh, objectCompoenetContainer) {
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
  const selectedMaterialIcon = document.createElement("i");
  selectedMaterialIcon.className = "icon selectIcon";

  liDefault.appendChild(spanDefault);
  liDefault.appendChild(selectedMaterialIcon);

  // Red
  const liRed = document.createElement("li");
  liRed.className = "item kamalqraytou";
  const spanRed = document.createElement("span");
  spanRed.innerText = "Red";
  liRed.appendChild(spanRed);
  //liRed.appendChild(selectedMaterialIcon);

  // Green
  const liGreen = document.createElement("li");
  liGreen.className = "item kamalqraytou";
  const spanGreen = document.createElement("span");
  spanGreen.innerText = "Green";
  liGreen.appendChild(spanGreen);
  // liGreen.appendChild(selectedMaterialIcon);

  // Blue
  const liBlue = document.createElement("li");
  liBlue.className = "item kamalqraytou";
  const spanBlue = document.createElement("span");
  spanBlue.innerText = "Blue";
  liBlue.appendChild(spanBlue);
  // liBlue.appendChild(selectedMaterialIcon);

  // Select Material

  liDefault.addEventListener("click", () => {
    mesh.material = matDefault;
    $(".selectIcon").remove();
    const selectedMaterialIcon = document.createElement("i");
    selectedMaterialIcon.className = "icon selectIcon";
    liDefault.appendChild(selectedMaterialIcon);
  });
  liRed.addEventListener("click", () => {
    mesh.material = matRed;
    $(".selectIcon").remove();
    const selectedMaterialIcon = document.createElement("i");
    selectedMaterialIcon.className = "icon selectIcon";
    liRed.appendChild(selectedMaterialIcon);
  });
  liGreen.addEventListener("click", () => {
    mesh.material = matGreen;
    $(".selectIcon").remove();
    const selectedMaterialIcon = document.createElement("i");
    selectedMaterialIcon.className = "icon selectIcon";
    liGreen.appendChild(selectedMaterialIcon);
  });
  liBlue.addEventListener("click", () => {
    mesh.material = matBlue;
    $(".selectIcon").remove();
    const selectedMaterialIcon = document.createElement("i");
    selectedMaterialIcon.className = "icon selectIcon";
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
  const deleteIcon = document.createElement("i");
  deleteIcon.className = "icon deleteIcon";
  const deleteSpan = document.createElement("span");
  deleteSpan.innerText = "Delete";
  itemDelete.appendChild(deleteIcon);
  itemDelete.appendChild(deleteSpan);

  itemDelete.addEventListener("click", () => {
    $("#" + objectCompoenetContainer.id).remove();
    const meshArrayIndex = scene.meshes.indexOf(mesh);
    scene.meshes.splice(meshArrayIndex, 1);

    // When the selected mesh is deleted -> turn visibility of the other meshes to 1
    if (getNumberOfPickedMeshes() == 0) {
      scene.meshes.forEach((mesh) => {
        mesh.visibility = 1;
      });
    }

    // When we delete the last mesh
    if (scene.meshes == 0) {
      $(".empty-scene").show();
    }
  });

  // Append the two childs to menu
  menu.appendChild(itemMaterial);
  menu.appendChild(itemDelete);

  objectContextMenu.appendChild(menu);
  return objectContextMenu;
}

// ---> Create the Compoenent linked to the loaded mesh
function createComponent(mesh, meshIcon) {
  const objectCompoenetContainer = document.createElement("div");
  objectCompoenetContainer.className = "objectInTheScene";
  objectCompoenetContainer.id = mesh.id;

  // Object Icon and Name
  const objIcon = document.createElement("p");
  objIcon.className = `objIcon ${meshIcon}`;
  const objName = document.createElement("p");
  objName.innerText = mesh.name;
  objName.className = "objName";
  objectCompoenetContainer.appendChild(objIcon);
  objectCompoenetContainer.appendChild(objName);

  // Toggle mesh Visivility
  const hideShow = document.createElement("button");
  hideShow.className = "hideShow show";
  hideShow.title = "hide";
  hideShow.addEventListener("click", (e) => {
    e.stopPropagation(); // clicked div inside another clickable div
    if (mesh.isEnabled()) {
      e.target.className = "hideShow hide";
      hideShow.title = "show";
      mesh.setEnabled(false);
    } else {
      e.target.className = "hideShow show";
      hideShow.title = "hide";
      mesh.setEnabled(true);
    }
  });
  objectCompoenetContainer.appendChild(hideShow);

  // Select Mesh - Ctrl click on component for multiple select
  objectCompoenetContainer.addEventListener("click", (event) => {
    if (mesh.showBoundingBox) {
      mesh.showBoundingBox = false;
      if (event.ctrlKey == false) {
        scene.meshes.forEach((mesh) => {
          mesh.visibility = 1;
        });
      }
    } else {
      if (event.ctrlKey == false) {
        scene.meshes.forEach((mesh) => {
          mesh.showBoundingBox = false;
          mesh.visibility = 0.5;
        });
      }
      mesh.showBoundingBox = true;
      mesh.visibility = 1;
    }
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

  // ---------------- Right Click Event - Context Menu ------------------
  // Create Context Menu
  const objectContextMenu = createObjectContextMenu(
    mesh,
    objectCompoenetContainer
  );
  document.body.appendChild(objectContextMenu);
  document.addEventListener("click", (e) => {
    objectContextMenu.style.visibility = "hidden";
  });

  // When Right click on Object
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

  $(".sidebar-elements").append(objectCompoenetContainer);
}

function getNumberOfPickedMeshes() {
  var numberOfPickedMeshes = 0;
  scene.meshes.forEach((mesh) => {
    if (mesh.showBoundingBox) {
      numberOfPickedMeshes += 1;
    }
  });
  return numberOfPickedMeshes;
}
