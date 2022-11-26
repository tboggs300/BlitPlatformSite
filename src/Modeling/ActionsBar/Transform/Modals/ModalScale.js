var modal = document.querySelector("#modal-scale");
var modalCancelBtn = document.querySelector(".modal-cancel-button-scale");
var modalOkBtn = document.querySelector(".modal-ok-button-scale");
$(".modal-transform").draggable();

const scaleX = document.querySelector("#scale-x-input");
const scaleY = document.querySelector("#scale-y-input");
const scaleZ = document.querySelector("#scale-z-input");

var selectedMeshesInScene;

export async function openScaleModal(e, selectedMeshes) {
  // Modal
  e.preventDefault();
  var rect = e.target.getBoundingClientRect();
  modal.style.left = `${rect.left - rect.left / 6}px`;
  modal.style.top = `${rect.top + 40}px`;
  modal.classList.add("is-open");

  selectedMeshesInScene = selectedMeshes;
  let isMultipleSelect = selectedMeshes.length !== 1; // true if multipe object are selected

  scaleX.value = isMultipleSelect
    ? 0.0
    : parseFloat(selectedMeshes[0].scaling.x).toFixed(1);
  scaleY.value = isMultipleSelect
    ? 0.0
    : parseFloat(selectedMeshes[0].scaling.y).toFixed(1);
  scaleZ.value = isMultipleSelect
    ? 0.0
    : parseFloat(selectedMeshes[0].scaling.z).toFixed(1);

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
      resolve("Translation Applied");
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

scaleX.addEventListener("change", updateScaleXInput);
scaleY.addEventListener("change", updateScaleYInput);
scaleZ.addEventListener("change", updateScaleZInput);

function updateScaleXInput(e) {
  updateScaleInput(e, "x");
}
function updateScaleYInput(e) {
  updateScaleInput(e, "y");
}
function updateScaleZInput(e) {
  updateScaleInput(e, "z");
}

var previousCordinates = {
  x: 0,
  y: 0,
  z: 0,
};

function updateScaleInput(e, axis) {
  selectedMeshesInScene.forEach((mesh) => {
    if (selectedMeshesInScene.length === 1) {
      mesh.scaling[axis] = e.target.valueAsNumber;
      return 0;
    } else {
      mesh.scaling[axis] += e.target.valueAsNumber - previousCordinates[axis];
    }
  });
  previousCordinates[axis] = e.target.valueAsNumber;
}
