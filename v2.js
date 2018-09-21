/** img Class */
var img = function(name, method) {
    this.name = name;
    this.method = method;
}
img.prototype.src = function() {
    return "images/img" + this.name + this.method + ".png";
}
img.prototype.tag = function(){				
    return "i" + this.name + "_m" + this.method;
}
/** END img class */

/** Global vars */
const TOTAL_IMAGES = 2;
const TOTAL_METHODS = 5;
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
var title = document.getElementById('title');
imgLeft.onload =  function(){buttonPanel.hidden = '';};
imgRight.onload = function(){buttonPanel.hidden = '';};
/** END global vars */

// helpers
function loadImages(img1, img2){
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

function finish() {
    finishFlag = true;
    var p = document.createElement('p');
    for(var i = 0; i < winners.length; ++i)
        p.innerHTML += winners[i].tag() + '<br/>';
    container.innerHTML = p.innerHTML;
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
                currSet = shuffle(currSet);
            }
        }               
    }

    
   
    loadImages(currSet[li], currSet[ri]);
    


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