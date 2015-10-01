// video-effects-demo.js
// Copyright David Corvoysier 2012
// http://www.kaizou.org

var fg;
var video;
var canvas;
function init(event){
    video = document.getElementById("video");
    canvas = document.getElementById("canvas");
    console.log(canvas);
    fg = new frameGrabber(video,canvas);
    displayEffects();
}

function displayEffects(){
    var effectsBlock = document.getElementById("effects");
    var ul = document.createElement("ul");
    for (var effect in JSManipulate) {
        var li = document.createElement("li");
        var input = document.createElement("input");
        input.type = "radio"
        input.name = "effects"
        input.value = effect;
        input.id = effect;
        input.addEventListener("click",
                                function(evt){
                                    fg.setEffect(this.value);
                                },
                                false);
        li.appendChild(input);
        var label = document.createElement("label");
        label.innerHTML = JSManipulate[effect].name;
        label.setAttribute("for",input.id);
        li.appendChild(label);
        ul.appendChild(li);
    }
    effectsBlock.appendChild(ul);
    effectsBlock.getElementsByTagName('input')[0].checked = true;
}

