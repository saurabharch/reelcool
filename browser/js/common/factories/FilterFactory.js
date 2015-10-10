app.factory("FilterFactory", () => {
  let filters =  [
    {
        code: "",
        displayName:"Clear filters",
    },
    {
        code: "grayscale()",
        displayName:"100% Grayscale",
    },
    {
        code: "grayscale(80%)",
        displayName:"70% Grayscale",
    },
    {
        code: "sepia()",
        displayName:"Sepia",
    },
    {
        code: "blur(3px)",
        displayName:"Blur",
    },
    {
        code: "invert()",
        displayName:"Invert",
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
