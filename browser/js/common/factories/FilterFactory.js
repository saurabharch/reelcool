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
        val:0,
        default:0,
        applied: false
    },
    {   
        code: ["sepia(",")"],
        displayName:"Sepia",
        primary: true,
        val:0,
        default:0,
        applied: false
    },
    {
        code: ["invert(",")"],
        displayName:"Invert",
        primary: true,
        val: 0,
        default:0,
        applied: false
    },
    {
        code: ["brightness(",")"],
        displayName: "Brightness",
        primary: false,
        min:0.2,
        max:1.8,
        val:1,
        default:1,
        applied: false
    },
    // {
    //     code: ["contrast(",")"],
    //     displayName: "Contrast",
    //     primary: false,
    //     min:1,
    //     max:5,
    //     val:1,
    //     default:1,
    //     applied: false
    // },
    {
        code: ["hue-rotate(","deg)"],
        displayName: "Hue",
        primary: false,
        min:0,
        max:360,
        val:0,
        default:0,
        applied: false
    // },
    // {
    //     code: ["saturate(",")"],
    //     displayName: "Saturation",
    //     primary: false,
    //     min:0,
    //     max:10,
    //     val:1,
    //     default:1,
    //     applied: false
    }

  ];

  let createFilterString = (filtersArr) => {
    return filtersArr.filter(el => el.applied).map(el => el.code[0]+el.val+el.code[1]).join(" ");
  };
  let parseFilterString = (str) => {
    if (!str.length) return filters;
    let newFilters = angular.copy(filters);
    let filts = str.split(' ').map(el => el.split('(')[0]);
    let filtVals = str.split(' ').map(el => el.split('(')[1].split(')')[0]);
    let templateFilts = filters.map(filt => filt.code[0].slice(0,filt.code[0].length-1));
    templateFilts.forEach((el,ind) => {
        let filtInd = filts.indexOf(el);
        if(filtInd>-1){
            if(el=="hue-rotate"){
                newFilters[ind].val=str.split('deg')[0].split('(').slice(-1);
                console.log('yooooo', newFilters[ind]);
                newFilters[ind].applied = true;
            }
            else{
                newFilters[ind].val = filtVals[filtInd];
                newFilters[ind].applied = true;
            }
        }
    });
    return newFilters;
  };

  let addFiltersToAllInstructions = (instructs) => {
    instructs.forEach(inst => {
        inst.filters = parseFilterString(inst.filterString);
    });
  };

  return {
    filters,
    createFilterString,
    parseFilterString,
    addFiltersToAllInstructions
  };
});
