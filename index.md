  height: {
          name: "高度",
          type: "input",
          value: "",
        },
        trigger: {
          name: "指示器触发方式",
          type: "select",
          value: "",
          options: [
            {
              value: "hover",
              label: "hover",
            },
            {
              value: "click",
              label: "click",
            },
          ],
        },
        autoplay: {
          type: "select",
          value: "",
        },
        // autoplay: true,
        // interval: 3000,
        // indicatorPosition: "outside",
        // arrow: "always",
        // type: "card",
        // cardScale: 0.8,
        // loop: true,
        // direction: "horizontal",
        // pauseOnHover: true,

         animation: {
          classes: [
            {
              value: "guide",
              label: "Guide",
              children: [
                {
                  value: "disciplines",
                  label: "Disciplines",
                },
              ],
            },
            {
              value: "component",
              label: "Component",
              children: [
                {
                  value: "basic",
                  label: "Basic",
                },
              ],
            },
          ],
          delay: null,
          duration: null,
          iteratiom: null,
        },
