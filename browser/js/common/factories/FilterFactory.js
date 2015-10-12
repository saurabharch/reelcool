app.factory("FilterFactory", () => {
  let filters =  [
    {
        code: "",
        displayName:"Clear filters",
        type:"none"
    },
    {
        code: "grayscale()",
        displayName:"100% Grayscale",
        type:"color"
    },
    {
        code: "grayscale(80%)",
        displayName:"70% Grayscale",
        type:"color"
    },
    {
        code: "sepia()",
        displayName:"Sepia",
        type:"color"
    },
    // {
    //     code: "blur(3px)",
    //     displayName:"Blur",
    //     type:"blur"
    // },
    {
        code: "invert()",
        displayName:"Invert",
        type:"invert"
    }
  ];

  let createFilterString = (filtersArr) => {
    return filtersArr.filter(el => el.applied).map(el => el.code).join(" ");
  }

  return {
    filters: filters,
    createFilterString: createFilterString
  }
})
