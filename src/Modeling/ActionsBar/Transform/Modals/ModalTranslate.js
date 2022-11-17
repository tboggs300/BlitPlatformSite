var modal = document.querySelector("#modal-translate");
var modalCancelBtn = document.querySelector(".modal-cancel-button-translate");
var modalOkBtn = document.querySelector(".modal-ok-button-translate");
$(".modal-transform").draggable();

const translateX = document.querySelector("#translate-x-input");
const translateY = document.querySelector("#translate-y-input");
const translateZ = document.querySelector("#translate-z-input");

let currentMesh = null;

export async function openTranslateModal(e, selectedMesh, gizmo) {
  currentMesh = selectedMesh;

  translateX.value = parseFloat(selectedMesh.position.x).toFixed(1);
  translateY.value = parseFloat(selectedMesh.position.y).toFixed(1);
  translateZ.value = parseFloat(selectedMesh.position.z).toFixed(1);

  gizmo.xGizmo.onSnapObservable.add((event) => {
    translateX.value = parseFloat(selectedMesh.position.x).toFixed(1);
  });
  gizmo.yGizmo.onSnapObservable.add((event) => {
    translateY.value = parseFloat(selectedMesh.position.y).toFixed(1);
  });
  gizmo.zGizmo.onSnapObservable.add((event) => {
    translateZ.value = parseFloat(selectedMesh.position.z).toFixed(1);
  });

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

export function closeTranslateModal(e, xt, yt, zt) {
  if (currentMesh !== null) {
    currentMesh.position.x = xt;
    currentMesh.position.y = yt;
    currentMesh.position.z = zt;
    console.log(xt, yt, zt);
  }

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

function updateTranslateXInput(e) {
  currentMesh.position.x = parseFloat(e.target.value);
}
function updateTranslateYInput(e) {
  currentMesh.position.y = parseFloat(e.target.value);
}
function updateTranslateZInput(e) {
  currentMesh.position.z = parseFloat(e.target.value);
}
