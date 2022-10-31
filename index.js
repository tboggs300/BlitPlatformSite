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

// ------------------------ Create - Delete - Deubg --------------------//

let meshesInTheScene = [];
var pickedMeshes = [];

const getNumberOfPickedMeshes = () => {
  var numberOfPickedMeshes = 0;
  meshesInTheScene.forEach((mesh) => {
    if (mesh.showBoundingBox) {
      numberOfPickedMeshes += 1;
    }
  });
  return numberOfPickedMeshes;
};

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

function createComponent(mesh, meshIcon) {
  const objectCompoenetContainer = document.createElement("div");
  objectCompoenetContainer.className = "objectInTheScene ";
  objectCompoenetContainer.id = mesh.id;

  // Object Icon and Name
  const objIcon = document.createElement("p");
  objIcon.className = `objIcon ${meshIcon}`;
  const objName = document.createElement("p");
  objName.innerText = mesh.name;
  objName.className = "objName";
  objectCompoenetContainer.appendChild(objIcon);
  objectCompoenetContainer.appendChild(objName);

  // Toggle Visivility
  const hideShow = document.createElement("button");
  hideShow.className = "hideShow show";
  hideShow.addEventListener("click", (e) => {
    alert("hideshow");
    e.preventDefault();
    if (mesh.isEnabled()) {
      e.target.className = "hideShow hide";
      mesh.setEnabled(false);
    } else {
      e.target.className = "hideShow show";
      mesh.setEnabled(true);
    }
  });
  objectCompoenetContainer.appendChild(hideShow);

  // Toggle bounding box
  // const boundingBoxCheckBtn = document.createElement("button");
  // boundingBoxCheckBtn.id = mesh.id;
  // boundingBoxCheckBtn.className = "boundingBox";
  // boundingBoxCheckBtn.addEventListener("click", (e) => {
  //   if (mesh.showBoundingBox) {
  //     e.target.className = "boundingBox hideBoundingBox";
  //     mesh.showBoundingBox = false;
  //   } else {
  //     e.target.className = "boundingBox showBoundingBox";
  //     mesh.showBoundingBox = true;
  //   }

  //   var numberOfPickedMeshes = getNumberOfPickedMeshes();

  //   meshesInTheScene.forEach((mesh, index) => {
  //     if (mesh.showBoundingBox === true) {
  //       mesh.visibility = 1;
  //     } else if (mesh.showBoundingBox === false && numberOfPickedMeshes == 0) {
  //       mesh.visibility = 1;
  //     } else if (mesh.showBoundingBox === false && numberOfPickedMeshes > 0) {
  //       mesh.visibility = 0.5;
  //     }
  //   });
  // });
  // objectCompoenetContainer.appendChild(boundingBoxCheckBtn);

  objectCompoenetContainer.addEventListener("click", (event) => {
    alert("objectComponent");
    switch (event.ctrlKey) {
      case true:
        if (mesh.showBoundingBox) {
          mesh.showBoundingBox = false;
          scene.meshes.forEach((mesh) => {
            if (mesh.showBoundingBox) {
              mesh.visibility = 1;
            }
          });
        } else {
          scene.meshes.forEach((mesh) => {
            if (mesh.showBoundingBox == false) {
              mesh.visibility = 0.5;
            }
          });
          mesh.showBoundingBox = true;
          mesh.visibility = 1;
        }
        break;
      case false:
        if (mesh.showBoundingBox) {
          mesh.showBoundingBox = false;
          scene.meshes.forEach((mesh) => {
            mesh.visibility = 1;
          });
        } else {
          scene.meshes.forEach((mesh) => {
            mesh.showBoundingBox = false;
            mesh.visibility = 0.5;
          });
          mesh.visibility = 1;
          mesh.showBoundingBox = true;
        }
    }
    // if (event.ctrlKey) {
    //   var numberOfPickedMeshes = getNumberOfPickedMeshes();

    //   meshesInTheScene.forEach((mesh, index) => {
    //     if (mesh.showBoundingBox === true) {
    //       mesh.visibility = 1;
    //     } else if (
    //       mesh.showBoundingBox === false &&
    //       numberOfPickedMeshes == 0
    //     ) {
    //       mesh.visibility = 1;
    //     } else if (mesh.showBoundingBox === false && numberOfPickedMeshes > 0) {
    //       mesh.visibility = 0.5;
    //     }
    //   });
    // } else {
    //   if (mesh.showBoundingBox) {
    //     mesh.showBoundingBox = false;
    //     scene.meshes.forEach((mesh) => {
    //       mesh.visibility = 1;
    //     });
    //   } else {
    //     scene.meshes.forEach((mesh) => {
    //       mesh.showBoundingBox = false;
    //       mesh.visibility = 0.5;
    //     });
    //     mesh.visibility = 1;
    //     mesh.showBoundingBox = true;
    //   }
    // }

    // var numberOfPickedMeshes = getNumberOfPickedMeshes();

    // meshesInTheScene.forEach((mesh, index) => {
    //   if (mesh.showBoundingBox === true) {
    //     mesh.visibility = 1;
    //   } else if (mesh.showBoundingBox === false && numberOfPickedMeshes == 0) {
    //     mesh.visibility = 1;
    //   } else if (mesh.showBoundingBox === false && numberOfPickedMeshes > 0) {
    //     mesh.visibility = 0.5;
    //   }
    // });
  });

  // ------------------- Context Menu ------------------
  const wrapper = document.createElement("div");
  wrapper.className = "wrapper";

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

  console.log(itemDelete.className);
  const deleteIcon = document.createElement("i");
  deleteIcon.className = "icon deleteIcon";
  const deleteSpan = document.createElement("span");
  deleteSpan.innerText = "Delete";

  itemDelete.appendChild(deleteIcon);
  itemDelete.appendChild(deleteSpan);

  // Append the two childs to menu
  menu.appendChild(itemMaterial);
  menu.appendChild(itemDelete);

  wrapper.appendChild(menu);

  document.body.appendChild(wrapper);

  // const meshMenu = document.getElementsByClassName("wrapper")[0];

  objectCompoenetContainer.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    var rect = objectCompoenetContainer.getBoundingClientRect();
    var x = e.offsetX;
    var y = e.offsetY;
    wrapper.style.left = `${x + rect.left}px`;
    wrapper.style.top = `${y + rect.top}px`;
    wrapper.style.animation = "0.5s ease";
    wrapper.style.visibility = "visible";
  });

  $(".sidebar-elements").append(objectCompoenetContainer);

  itemDelete.addEventListener("click", () => {
    console.log(objectCompoenetContainer.id);
    mesh.dispose();
    $("#" + objectCompoenetContainer.id).remove();
    const meshArrayIndex = meshesInTheScene.indexOf(mesh);
    meshesInTheScene.splice(meshArrayIndex, 1);

    if (getNumberOfPickedMeshes() == 0) {
      meshesInTheScene.forEach((mesh) => {
        mesh.visibility = 1;
      });
    }
    if (meshesInTheScene == 0) {
      $(".empty-scene").show();
    }
  });

  document.addEventListener("click", (e) => {
    wrapper.style.visibility = "hidden";
    // scene.meshes.forEach((mesh) => {
    //   mesh.showBoundingBox = false;
    // });
  });

  meshesInTheScene.push(mesh);
}

$(document).ready(function () {
  let sphereButtonClicks = 0;
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

  // Upload Button
  $(".upload-button").click(function () {
    // ----- Uploading the Mesh -------
    importSTLFiles();

    // ------ Mesh Visibility ---------
  });
});

// ---------------------------Upload STL Files------------------------------------//
function importSTLFiles() {
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

// --------------------------Load the Mesh to The scene-------------------------------------//
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
