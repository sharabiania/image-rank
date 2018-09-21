/**
 * @author Ali Sharabiani
 */
/** config constants  */
const CONF_TOTAL_IMAGES = 3;
const CONF_TOTAL_METHODS = 5;
/** END config */
const VERSION = '1.9';
var qs = new URLSearchParams(window.location.search);
var TOTAL_IMAGES =  qs.get('i') || CONF_TOTAL_IMAGES;
var TOTAL_METHODS = qs.get('m') || CONF_TOTAL_METHODS;
var IMAGE_FOLDER = 'images/';
var debug = (qs.get('d') == 1);

if(debug) {
    IMAGE_FOLDER = 'dummy/';
    document.getElementById('version').style.display = 'block';
}

/** img Class */
var img = function(name, method) {
    this.name = name;
    this.method = method;
}
img.prototype.src = function() {
    return IMAGE_FOLDER + "img" + this.name + '_' + this.method + ".png";
}
img.prototype.tag = function(){				
    return "i" + this.name + "_m" + this.method;
}
/** END img class */

/** Global vars */

var li = 0;
var ri = 1;
var currImageIndex = 0;
var imgSet = [];
var currSet = [];
var winners = [];
var currWinner = null;
var finishFlag = false;
// Initialize image set
for(var i = 0; i < TOTAL_IMAGES; ++i) imgSet.push([]);	
for(var i = 0; i < TOTAL_IMAGES; ++i) {
    for(var j = 0; j < TOTAL_METHODS; ++j) {	
        imgSet[i][j] = new img(i + 1, j + 1);				
    }
}
// END Initialize image set
var imgLeft = document.getElementById("img-left");
var imgRight = document.getElementById("img-right");
var buttonPanel = document.getElementById('panel');
var container = document.getElementById('container');
var progress = document.getElementById('progress');
var loadText = document.getElementById('load-txt');
progress.max = TOTAL_IMAGES * ((TOTAL_METHODS - 1) * (TOTAL_METHODS))/2;
document.getElementById('version').innerText = 'version' +  VERSION;
imgLeft.onload =  function(){if(imgRight.complete) 
    {
       
        setTimeout(function(){
            buttonPanel.hidden = ''; 
            var e = document.getElementById('img-panel');
            e.className = "fade-in";
            e.style.opacity = 1;
            loadText.style.display = 'none';
        }, 1000);
    }
};
imgRight.onload = function(){if(imgLeft.complete) {
    
    setTimeout(function(){
        buttonPanel.hidden = '';
        var e = document.getElementById('img-panel');
        e.className = "fade-in";
        e.style.opacity = 1;
        loadText.style.display = 'none';
}, 1000);
}};
var mglass = new MGlass2("img-left", "img-right", imgLeft.src, imgRight.src, null);

progress.style.width = document.getElementsByClassName('mglass_picture_box')[0].clientWidth;

/** END global vars */

// helpers
function updateTitle() {
    document.getElementById('title').innerHTML =
    '<h3>Image ' + (currImageIndex + 1) + ' of ' + TOTAL_IMAGES + '</h3>'
    + '<h4> Round ' + (TOTAL_METHODS - currSet.length + 1) + ' of ' 
    + (TOTAL_METHODS - 1) + '</h4>';   
}

function loadImages(img1, img2){
    loadText.style.display = 'block';
    var imgPanel = document.getElementById('img-panel');
    imgPanel.className = "";
    imgPanel.style.opacity = 0;
    var src1 = img1.src();
    var src2 = img2.src();
   if(Math.random()>= 0.5) {   
        // swap					
        var temp = li;
        li = ri;
        ri = temp;
        temp = src1;
        src1 = src2;
        src2 = temp;
    }
    
    buttonPanel.hidden = 'hidden';    
    
   
    
    imgLeft.src = "";
    imgRight.src = "";   
    imgLeft.src = src1;    
    imgRight.src = src2;    
    mglass.updateSrc(src1, src2);
   
    
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

// END helpers

/** MAIN **/
// 1 - Select the next image set
currSet = imgSet[0];
currSet = shuffle(currSet);

// 2 - load the first two images
loadImages(currSet[0], currSet[1]);
updateTitle();

function finish() {
    finishFlag = true;
    var text = "";
    var p = document.createElement('p');
    p.innerHTML += (new Date()).toString() + '<hr/>';
    for(var i = 0; i < winners.length; ++i) {
        text += winners[i].method;
        if(i%TOTAL_METHODS == 1) text+='\r\n';
        else text += ', ';
        p.innerHTML += winners[i].tag() + '<br/>';
    }
    container.innerHTML = p.innerHTML;

    // Save file:
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', 'results');
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}

function next() {
    
    if(finishFlag) {
        finish();
        return;
    }

    if(ri >= currSet.length || li >= currSet.length){
        ri = 0;
        li = 1;
        winners.push(currWinner);
        var index = currSet.indexOf(currWinner);
        currSet.splice(index, 1);
        if(currSet.length == 1) {
            winners.push(currSet[0]);
            currImageIndex++;
            if(currImageIndex >= TOTAL_IMAGES) {                
                finish();
                return;
            }
            else {
                currSet = imgSet[currImageIndex];                
            }
        }               
        currSet = shuffle(currSet);
    }

       
    loadImages(currSet[li], currSet[ri]);
    updateTitle();
    progress.value++;

}

function leftClick() {

    currWinner = currSet[li];
    if(li < ri) ri++;
    else ri = li + 1;

    next();
    
}

function rightClick(){

    currWinner = currSet[ri];
    if(ri < li) li++;
    else li = ri + 1;

    next();

}