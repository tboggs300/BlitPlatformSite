var modal = document.querySelector("#modal-rotate");
var modalCancelBtn = document.querySelector(".modal-cancel-button-rotate");
var modalOkBtn = document.querySelector(".modal-ok-button-rotate");
$(".modal-transform").draggable();

const rotateX = document.querySelector("#rotate-x-input");
const rotateY = document.querySelector("#rotate-y-input");
const rotateZ = document.querySelector("#rotate-z-input");

let selectedMeshesInScene;

export async function openRotateModal(e, selectedMeshes) {
  e.preventDefault();
  var rect = e.target.getBoundingClientRect();
  modal.style.left = `${rect.left - rect.left / 6}px`;
  modal.style.top = `${rect.top + 40}px`;
  modal.classList.add("is-open");

  selectedMeshesInScene = selectedMeshes;

  let isMultipleSelect = selectedMeshes.length !== 1; // true if multipe object are selected

  rotateX.value = isMultipleSelect
    ? 0
    : parseInt(selectedMeshes[0].rotation.x * (180 / Math.PI));
  rotateY.value = isMultipleSelect
    ? 0
    : parseInt(selectedMeshes[0].rotation.y * (180 / Math.PI));
  rotateZ.value = isMultipleSelect
    ? 0
    : parseInt(selectedMeshes[0].rotation.z * (180 / Math.PI));

  function cleanHandler() {
    previousCordinates = {
      x: 0,
      y: 0,
      z: 0,
    };
    modal.classList.remove("is-open");
  }

  let promise = new Promise((resolve, reject) => {
    modalOkBtn.addEventListener("click", () => {
      cleanHandler();
      resolve("Rotation Applied");
    });
    modalCancelBtn.addEventListener("click", () => {
      cleanHandler();
      reject("user cancel action");
    });
  });

  await promise;
  return promise;
}

/* ------------------- Input Evenet Listener ---------------------- */

rotateX.addEventListener("change", updateRotateXInput);
rotateY.addEventListener("change", updateRotateYInput);
rotateZ.addEventListener("change", updateRotateZInput);

function updateRotateXInput(e) {
  updateRotationInput(e, "x");
}
function updateRotateYInput(e) {
  updateRotationInput(e, "y");
}
function updateRotateZInput(e) {
  updateRotationInput(e, "z");
}

var previousCordinates = {
  x: 0,
  y: 0,
  z: 0,
};

function updateRotationInput(e, axis) {
  selectedMeshesInScene.forEach((mesh) => {
    if (selectedMeshesInScene.length === 1) {
      mesh.rotation[axis] = e.target.valueAsNumber / (180 / Math.PI);
      return 0;
    } else {
      mesh.rotation[axis] +=
        (e.target.valueAsNumber - previousCordinates[axis]) / (180 / Math.PI);
    }
  });
  previousCordinates[axis] = e.target.valueAsNumber;
}
