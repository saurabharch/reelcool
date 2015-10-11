app.factory("FilterFactory", () => {
  let filters =  [
    {
        code: "clear",
        displayName:"Clear filters",
    },
    {
        code: ["grayscale(",")"],
        displayName:"Grayscale",
        primary: true,
        min:0,
        max:1,
        val:0
    },
    {
        code: ["sepia(",")"],
        displayName:"Sepia",
        primary: true,
        min:0,
        max:1,
        val:0
    },
    {
        code: "invert()",
        displayName:"Invert",
        primary: true,
    },
    {
        code: ["brightness(",")"],
        displayName: "Brightness",
        primary: false,
        min:.5,
        max:1.5,
        val:1
    },
    {
        code: ["contrast(",")"],
        displayName: "Contrast",
        primary: false,
        min:0,
        max:1,
        val:3
    },
    {
        code: ["hue-rotate(","deg)"],
        displayName: "Hue",
        primary: false,
        min:0,
        max:360,
        val:0
    },
    {
        code: ["opacity(",")"],
        displayName: "Opacity",
        primary: false,
        min:0,
        max:1,
        val:1
    },
    {
        code: ["saturate(",")"],
        displayName: "Saturation",
        primary: false,
        min:0,
        max:10,
        val:1
    }

  ];

  let createFilterString = (filtersArr) => {
    return filtersArr.filter(el => el.applied).map(el => el.code[0]+el.val.toString()+el.code[1]).join(" ");
  };

  return {
    filters: filters,
    createFilterString: createFilterString
  };
});
