app.factory("FilterFactory", () => {
  let filters =  [
    {
        code: "clear",
        displayName:"Clear filters",
    },
    {
        displayName:"Grayscale",
        primary: true,
        val:0,
        default:0
    },
    {
        displayName:"Sepia",
        primary: true,
        val:0,
        default:0
    },
    {
        displayName:"Invert",
        primary: true,
        val: 0,
        default:0
    },
    {
        displayName: "Brightness",
        primary: false,
        min:.2,
        max:1.8,
        val:1,
        default:1
    },
    {
        displayName: "Contrast",
        primary: false,
        min:1,
        max:5,
        val:1,
        default:1
    },
    {
        displayName: "Hue",
        primary: false,
        min:0,
        max:360,
        val:0,
        default:0
    },
    {
        displayName: "Saturation",
        primary: false,
        min:0,
        max:10,
        val:1,
        default:1
    }

  ];

  let createFilterString = (filtersArr) => {
    return filtersArr.filter(el => el.applied).map(el => el.code[0]+el.val+el.code[1]).join(" ");
  };

  return {
    filters: filters,
    createFilterString: createFilterString
  };
});
