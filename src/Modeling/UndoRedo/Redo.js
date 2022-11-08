export function decrementCounter(meshType) {
  switch (meshType) {
    case "sphere":
      sphereButtonClicks--;
      break;
    case "cube":
      cubeButtonClicks--;
      break;

    case "cylinder":
      cubeButtonClicks--;
      break;
  }
  console.log(sphereButtonClicks, cubeButtonClicks, cylinderButtonClicks);
}

$(document).ready(function () {
  // CTRL Z
  document.addEventListener("keydown", (e) => {
    if (e.key === "z" && e.ctrlKey) {
      if (!actions.length) {
        return;
      }
      switch (actions[actions.length - 1].action) {
        case "add":
          actions[actions.length - 1].mesh.dispose();
          console.log(actions[actions.length - 1].objectCompoenetContainer);
          $(
            "#" + actions[actions.length - 1].objectCompoenetContainer.id
          ).remove();
          decrementCounter(actions[actions.length - 1].type);
          actions.splice(actions.length - 1, 1);
          break;
        case "delete":
          const objectCompoenetContainer =
            actions[actions.length - 1].objectCompoenetContainer;
          $(".sidebar-elements").append(objectCompoenetContainer);
          const mesh = actions[actions.length - 1].mesh;
          const meshInstance = mesh.createInstance(
            actions[actions.length - 1].mesh.name
          );
          meshInstance.setEnabled(true);

          // console.log("mesh Instance", meshInstance);

          //   BABYLON.SceneLoader.ImportMesh(mesh, "", "", scene);
          actions.splice(actions.length - 1, 1);
          break;
        default:
          console.log("default");
          break;
      }

      // Reset Counter
      if (!actions.length) {
        sphereButtonClicks = 0;
        cubeButtonClicks = 0;
        cylinderButtonClicks = 0;
        return;
      }
    }
  });
});
