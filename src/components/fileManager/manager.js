import { createVNode, render } from "vue";
import manager from "./manager.vue";

// 根据不同的调用创建虚拟dom
export default (options = {}) => {
  return new Promise((resolve, reject) => {
    const div = document.createElement("div");
    div.style.transition = `opacity 0.2s`;
    document.body.appendChild(div);

    const removeElement = () => {
      render(null, div);
      document.body.removeChild(div);
    };

    options.successBtn = (storage) => {
      div.style.opacity = 0;
      resolve(storage);
      setTimeout(() => {
        removeElement();
      }, 200);
    };
    options.cancelBtn = () => {
      div.style.opacity = 0;
      reject();
      setTimeout(() => {
        removeElement();
      }, 200);
    };

    const vnode = createVNode(manager, options);
    render(vnode, div);
  });
};
