var modal = document.querySelector("#modal-rotate");
var modalCancelBtn = document.querySelector(".modal-cancel-button-rotate");
var modalOkBtn = document.querySelector(".modal-ok-button-rotate");
$(".modal-transform").draggable();

const rotateX = document.querySelector("#rotate-x-input");
const rotateY = document.querySelector("#rotate-y-input");
const rotateZ = document.querySelector("#rotate-z-input");

let currentMesh = null;

export async function openRotateModal(e, selectedMesh, gizmo) {
  currentMesh = selectedMesh;

  rotateX.value = parseInt(currentMesh.rotation.x * (180 / Math.PI));
  rotateY.value = parseInt(currentMesh.rotation.y * (180 / Math.PI));
  rotateZ.value = parseInt(currentMesh.rotation.z * (180 / Math.PI));

  e.preventDefault();
  var rect = e.target.getBoundingClientRect();
  modal.style.left = `${rect.left - rect.left / 6}px`;
  modal.style.top = `${rect.top + 40}px`;
  modal.classList.add("is-open");
  let promise = new Promise((resolve, reject) => {
    modalOkBtn.addEventListener("click", () => {
      resolve("Rotation Applied");
    });
    modalCancelBtn.addEventListener("click", () =>
      reject("user cancel action")
    );
  });

  //  -------- Transform With Gizmos ------------ //
  gizmo.xGizmo.onSnapObservable.add((event) => {
    rotateX.value = parseInt(gizmo.xGizmo.angle * (180 / Math.PI));
  });

  gizmo.yGizmo.onSnapObservable.add((event) => {
    rotateY.value = parseInt(gizmo.yGizmo.angle * (180 / Math.PI));
  });

  gizmo.zGizmo.onSnapObservable.add((event) => {
    rotateZ.value = parseInt(gizmo.zGizmo.angle * (180 / Math.PI));
  });

  await promise;
  return promise;
}

export function closeRotateModal(e, xr, yr, zr) {
  if (currentMesh !== null) {
    currentMesh.rotation.x = xr;
    currentMesh.rotation.y = yr;
    currentMesh.rotation.z = zr;
    console.log(xr, yr, zr);
  }
  modal.classList.remove("is-open");
}

function submitFormHandler() {
  modal.classList.remove("is-open");
}

modalCancelBtn.addEventListener("click", closeRotateModal);
modalOkBtn.addEventListener("click", submitFormHandler);

/* ------------------- Input Evenet Listener ---------------------- */

rotateX.addEventListener("change", updateRotateXInput);
rotateY.addEventListener("change", updateRotateYInput);
rotateZ.addEventListener("change", updateRotateZInput);

function updateRotateXInput(e) {
  currentMesh.rotation.x = parseInt(e.target.value) / (180 / Math.PI);
}
function updateRotateYInput(e) {
  currentMesh.rotation.y = parseInt(e.target.value) / (180 / Math.PI);
}
function updateRotateZInput(e) {
  currentMesh.rotation.z = parseInt(e.target.value) / (180 / Math.PI);
}
