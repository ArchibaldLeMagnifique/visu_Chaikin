/*
    ----- INITIALISATION -----
 */
function readSingleFile(e) {
    var file = e.target.files[0];
    if (!file) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
        var contents = e.target.result;
        var splitByLine = contents.split("\n");

        var X = [], Y = [];

        for (var i = 0; i<splitByLine.length; i++) {

            var splitByWord = splitByLine[i].split(" ");
            var splitByWordMinusSpaces = [];

            for (var j = 0; j<splitByWord.length; j++) {
                if (splitByWord[j] !== "") splitByWordMinusSpaces.push(splitByWord[j]);
            }
            X.push(parseFloat(splitByWordMinusSpaces[0]));
            Y.push(parseFloat(splitByWordMinusSpaces[1]));
        }
        displayImage("firstCanvas", X, Y);

        decompositionTotale(X, Y);

    };
    reader.readAsText(file);
}

function refresh(){
    document.getElementById('file-input').dispatchEvent(new Event('change'));
}

document.getElementById('file-input')
    .addEventListener('change', readSingleFile, false);


/*
    ----- DECOMPOSITION -----
 */
function etapeDecomposition(X, Y, etape) {
    var resX = X.slice(), resY = Y.slice();
    var t = X.length/Math.pow(2, etape);
    var seuil = parseFloat(document.getElementById("seuil").value);

    for (var i = 0; i < t; i++) {
        resX[i] = 1/4 * (-X[mod(2*i-2, 2*t)] + 3*X[mod(2*i-1, 2*t)] + 3*X[mod(2*i, 2*t)] - X[mod(2*i+1, 2*t)]);
        resY[i] = 1/4 * (-Y[mod(2*i-2, 2*t)] + 3*Y[mod(2*i-1, 2*t)] + 3*Y[mod(2*i, 2*t)] - Y[mod(2*i+1, 2*t)]);

        resX[i+t] = 1/4 * (X[mod(2*i-2, 2*t)] - 3*X[mod(2*i-1, 2*t)] + 3*X[mod(2*i, 2*t)] - X[mod(2*i+1, 2*t)]);
        resY[i+t] = 1/4 * (Y[mod(2*i-2, 2*t)] - 3*Y[mod(2*i-1, 2*t)] + 3*Y[mod(2*i, 2*t)] - Y[mod(2*i+1, 2*t)]);
        if (Math.sqrt(Math.pow(resX[i+t], 2) + Math.pow(resY[i+t], 2)) < seuil) {
            resX[i+t] = 0;
            resY[i+t] = 0;
        }
    }
    return [resX, resY];
}

function decompositionTotale(X, Y) {
    var resX = X.slice(), resY = Y.slice();
    for (var i=1; i<=Math.log(X.length)/Math.log(2); i++) {
        [resX, resY] = etapeDecomposition(resX, resY, i);
    }
    recompositionTotale(resX, resY);
}

/*
    ----- RECOMPOSITION -----
 */
function etapeRecomposition(X, Y, etape) {
    var resX = X.slice(), resY = Y.slice();
    var t = Math.pow(2, etape);

    for (var i = 0; i < t; i++) {
        resX[2*i] = 3/4 * (X[i]+X[i+t]) + 1/4 * (X[mod(i+1, t)]-X[mod(i+1, t)+t]);
        resX[2*i+1] = 1/4 * (X[i]+X[i+t]) + 3/4 * (X[mod(i+1, t)]-X[mod(i+1, t)+t]);
        resY[2*i] = 3/4 * (Y[i]+Y[i+t]) + 1/4 * (Y[mod(i+1, t)]-Y[mod(i+1, t)+t]);
        resY[2*i+1] = 1/4 * (Y[i]+Y[i+t]) + 3/4 * (Y[mod(i+1, t)]-Y[mod(i+1, t)+t]);
    }
    return [resX, resY];
}

function recompositionTotale(X, Y) {
    var resX = X.slice(), resY = Y.slice();
    for (var i=0; i<Math.log(X.length)/Math.log(2); i++) {
        [resX, resY] = etapeRecomposition(resX, resY, i);
    }
    displayImage("secondCanvas", resX, resY);
}

/*
    ----- ANNEXES -----
 */
function mod (a, n) {
    if (a<0) return mod(a+n, n);
    return a%n;
}

function displayImage(name, X, Y) {
    var taille = Math.max(Math.max.apply(Math, X)-Math.min.apply(Math, X), Math.max.apply(Math, Y)-Math.min.apply(Math, Y));
    var padding_left = Math.min.apply(Math, X);
    var padding_top = Math.min.apply(Math, Y);

    var c=document.getElementById(name);
    var ctx=c.getContext("2d");
    ctx.beginPath();
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.moveTo(c.width - (X[X.length-1]-padding_left)/taille*c.width, c.height - (Y[Y.length-1]-padding_top)/taille*c.height);
    for(var i = 0; i < X.length; i++){
        ctx.lineTo(c.width - (X[i]-padding_left)/taille*c.width, c.height - (Y[i]-padding_top)/taille*c.height);
    }
    ctx.stroke();
}