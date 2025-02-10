import axios from "./request/axios.js";

window.$axios = axios;

window.$dialogLoading = () => {
  const dialogs = document.querySelectorAll(".el-dialog");
  const loadingNodes = [];
  dialogs.forEach((dialog) => {
    dialog.style.position = "relative";
    const loadingNode = document.createElement("div");
    loadingNode.className = "loadingBox";
    dialog.appendChild(loadingNode);
    const icon = document.createElement("div");
    loadingNode.appendChild(icon);
    icon.className = "loadingIcon";
    loadingNodes.push(loadingNode);
  });
  return function removeLoadingMasks() {
    loadingNodes.forEach((node) => {
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
    });
  };
};
