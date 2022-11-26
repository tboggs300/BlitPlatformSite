var modal = document.querySelector("#modal-translate");
var modalCancelBtn = document.querySelector(".modal-cancel-button-translate");
var modalOkBtn = document.querySelector(".modal-ok-button-translate");
$(".modal-transform").draggable();

const translateX = document.querySelector("#translate-x-input");
const translateY = document.querySelector("#translate-y-input");
const translateZ = document.querySelector("#translate-z-input");

var selectedMeshesInScene;

export async function openTranslateModal(e, selectedMeshes) {
  // Modal
  e.preventDefault();
  var rect = e.target.getBoundingClientRect();
  modal.style.left = `${rect.left - rect.left / 6}px`;
  modal.style.top = `${rect.top + 40}px`;
  modal.classList.add("is-open");

  selectedMeshesInScene = selectedMeshes;
  let isMultipleSelect = selectedMeshes.length !== 1; // true if multipe object are selected

  translateX.value = isMultipleSelect
    ? 0.0
    : parseFloat(selectedMeshes[0].position.x).toFixed(1);
  translateY.value = isMultipleSelect
    ? 0.0
    : parseFloat(selectedMeshes[0].position.y).toFixed(1);
  translateZ.value = isMultipleSelect
    ? 0.0
    : parseFloat(selectedMeshes[0].position.z).toFixed(1);

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

translateX.addEventListener("change", updateTranslateXInput);
translateY.addEventListener("change", updateTranslateYInput);
translateZ.addEventListener("change", updateTranslateZInput);

function updateTranslateXInput(e) {
  updateTranslateInput(e, "x");
}
function updateTranslateYInput(e) {
  updateTranslateInput(e, "y");
}
function updateTranslateZInput(e) {
  updateTranslateInput(e, "z");
}

var previousCordinates = {
  x: 0,
  y: 0,
  z: 0,
};

function updateTranslateInput(e, axis) {
  selectedMeshesInScene.forEach((mesh) => {
    if (selectedMeshesInScene.length === 1) {
      mesh.position[axis] = e.target.valueAsNumber;
      return 0;
    } else {
      mesh.position[axis] += e.target.valueAsNumber - previousCordinates[axis];
    }
  });
  previousCordinates[axis] = e.target.valueAsNumber;
}
