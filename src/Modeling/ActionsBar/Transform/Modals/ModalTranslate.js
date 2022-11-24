var modal = document.querySelector("#modal-translate");
var modalCancelBtn = document.querySelector(".modal-cancel-button-translate");
var modalOkBtn = document.querySelector(".modal-ok-button-translate");
$(".modal-transform").draggable();

const translateX = document.querySelector("#translate-x-input");
const translateY = document.querySelector("#translate-y-input");
const translateZ = document.querySelector("#translate-z-input");

let currentMesh = null;
let selectedMeshesInScene;

export async function openTranslateModal(e, selectedMeshes) {
  selectedMeshesInScene = selectedMeshes;
  let selectedMesh;
  if (selectedMeshes.length === 1) {
    selectedMesh = selectedMeshes[0];
    currentMesh = selectedMesh;
    translateX.value = parseFloat(selectedMesh.position.x).toFixed(1);
    translateY.value = parseFloat(selectedMesh.position.y).toFixed(1);
    translateZ.value = parseFloat(selectedMesh.position.z).toFixed(1);
  } else {
    currentMesh = selectedMesh;
    translateX.value = 0;
    translateY.value = 0;
    translateZ.value = 0;
  }

  e.preventDefault();
  var rect = e.target.getBoundingClientRect();
  modal.style.left = `${rect.left - rect.left / 6}px`;
  modal.style.top = `${rect.top + 40}px`;
  modal.classList.add("is-open");
  let promise = new Promise((resolve, reject) => {
    modalOkBtn.addEventListener("click", () => {
      resolve("Translation Applied");
    });
    modalCancelBtn.addEventListener("click", () =>
      reject("user cancel action")
    );
  });

  await promise;
  return promise;
}

export function closeTranslateModal(e) {
  modal.classList.remove("is-open");
}

function submitFormHandler() {
  modal.classList.remove("is-open");
}

modalCancelBtn.addEventListener("click", closeTranslateModal);
modalOkBtn.addEventListener("click", submitFormHandler);

/* ------------------- Input Evenet Listener ---------------------- */

translateX.addEventListener("change", updateTranslateXInput);
translateY.addEventListener("change", updateTranslateYInput);
translateZ.addEventListener("change", updateTranslateZInput);

var previousXValue = 0;
var previousYValue = 0;
var previousZValue = 0;

function updateTranslateXInput(e) {
  if (selectedMeshesInScene.length === 1) {
    currentMesh.position.x = parseFloat(e.target.value);
  } else {
    selectedMeshesInScene.forEach((mesh) => {
      mesh.position.x =
        mesh.position.x + parseFloat(e.target.value - previousXValue);
    });
    previousXValue = parseFloat(e.target.value);
  }
}
function updateTranslateYInput(e) {
  if (selectedMeshesInScene.length === 1) {
    currentMesh.position.y = parseFloat(e.target.value);
  } else {
    selectedMeshesInScene.forEach((mesh) => {
      mesh.position.y =
        mesh.position.y + parseFloat(e.target.value - previousYValue);
    });
    previousYValue = parseFloat(e.target.value);
  }
}
function updateTranslateZInput(e) {
  if (selectedMeshesInScene.length === 1) {
    currentMesh.position.z = parseFloat(e.target.value);
  } else {
    selectedMeshesInScene.forEach((mesh) => {
      mesh.position.z =
        mesh.position.z + parseFloat(e.target.value - previousZValue);
    });
    previousZValue = parseFloat(e.target.value);
  }
}
