var modal = document.querySelector("#modal-scale");
var modalCancelBtn = document.querySelector(".modal-cancel-button-scale");
var modalOkBtn = document.querySelector(".modal-ok-button-scale");
$(".modal-transform").draggable();

const scaleX = document.querySelector("#scale-x-input");
const scaleY = document.querySelector("#scale-y-input");
const scaleZ = document.querySelector("#scale-z-input");

let currentMesh = null;

export async function openScaleModal(e, selectedMesh, gizmo) {
  currentMesh = selectedMesh;
  scaleX.value = selectedMesh.scaling.x;
  scaleY.value = selectedMesh.scaling.y;
  scaleZ.value = selectedMesh.scaling.z;

  gizmo.xGizmo.onSnapObservable.add((event) => {
    scaleX.value = selectedMesh.scaling.x;
  });
  gizmo.yGizmo.onSnapObservable.add((event) => {
    scaleY.value = selectedMesh.scaling.y;
  });
  gizmo.zGizmo.onSnapObservable.add((event) => {
    scaleZ.value = selectedMesh.scaling.z;
  });

  e.preventDefault();
  var rect = e.target.getBoundingClientRect();
  modal.style.left = `${rect.left - rect.left / 6}px`;
  modal.style.top = `${rect.top + 40}px`;
  modal.classList.add("is-open");
  let promise = new Promise((resolve, reject) => {
    modalOkBtn.addEventListener("click", () => {
      resolve("Scale Applied");
    });
    modalCancelBtn.addEventListener("click", () =>
      reject("user cancel action")
    );
  });

  await promise;
  return promise;
}

export function closeScaleModal(e, xs, ys, zs) {
  if (currentMesh !== null) {
    currentMesh.scaling.x = xs;
    currentMesh.scaling.y = ys;
    currentMesh.scaling.z = zs;
  }

  modal.classList.remove("is-open");
}

function submitFormHandler() {
  modal.classList.remove("is-open");
}

modalCancelBtn.addEventListener("click", closeScaleModal);
modalOkBtn.addEventListener("click", submitFormHandler);

/* ------------------- Input Evenet Listener ---------------------- */

scaleX.addEventListener("change", updateScaleXInput);
scaleY.addEventListener("change", updateScaleYInput);
scaleZ.addEventListener("change", updateScaleZInput);

function updateScaleXInput(e) {
  currentMesh.scaling.x = parseFloat(e.target.value);
}
function updateScaleYInput(e) {
  currentMesh.scaling.y = parseFloat(e.target.value);
}
function updateScaleZInput(e) {
  currentMesh.scaling.z = parseFloat(e.target.value);
}
