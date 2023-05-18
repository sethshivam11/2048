var board;
var score = 0;
var rows = 4;
var columns = 4;
window.onload = function () {
    setGame();
}

// function gameOver(){
//     document.getElementById("over").style.display = "none";
//     board = [
//         [0, 0, 0, 0],
//         [0, 0, 0, 0],
//         [0, 0, 0, 0],
//         [0, 0, 0, 0]
//     ]
// }

function setGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
        // [2, 4, 8, 16],
        // [32, 64, 128, 256],
        // [512, 1024, 2048, 8],
        // [4, 4, 8, 8]
    ]

    document.getElementById('score').innerText = score;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            //<div></div>
            let tile = document.createElement('div');
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }
    setTwo();
    setTwo();
}

function hasEmptyTile(){
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            if(board[r][c] == 0){
                return true;
            }
        }
    }
}
function setTwo(){
    if(!hasEmptyTile()){
        return;
    }
    let found = false;
    while(!found){
        //random r, c
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if(board[r][c] == 0){
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = ""; // clear the classList
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num;
        if(num <= 1024){
            tile.classList.add("x" + num.toString());
        }
        else {
            tile.classList.add("x2048");
        }
    }
}

document.addEventListener("keyup", (e) => {
    if (e.code == "ArrowLeft") {
        slideLeft();
    }
    else if(e.code == "ArrowRight"){
        slideRight();   
    }
    else if(e.code == "ArrowUp"){
        slideUp();
    }
    else if(e.code == "ArrowDown"){
        slideDown();
    }
});

document.addEventListener("swiped-up", (e)=>{

    document.getElementById("name").innerHtml = "swiped-up";

});

function filterZero(row) {
    console.log(row);
    return row.filter(num => num != 0);
}

function slide(row) {
    //[0,2,2,2]
    row = filterZero(row); // get rid of zeroes [2,2,2]
    // slide
    for (let i = 0; i < row.length; i++) {
        // check every 2
        if (row[i] == row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        } // [2, 2, 2] --> [4, 0, 2]
    }

    row = filterZero(row); // [4,2]

    while (row.length < columns) {
        row.push(0);
    }// [4,2,0,0]

    return row;
}

function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;

        for(let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
    setTwo();
    setTwo();
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row.reverse();
        row = slide(row);
        row.reverse();
        board[r] = row;

        for(let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
    setTwo();
    setTwo();
}

function slideUp(){
    for(let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        board[0][c] = row[0];
        board[1][c] = row[1];
        board[2][c] = row[2];
        board[3][c] = row[3];
        
        for(let r = 0; r < columns; r++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
    setTwo();
    setTwo();
}

function slideDown(){
    for(let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        board[0][c] = row[3];
        board[1][c] = row[2];
        board[2][c] = row[1];
        board[3][c] = row[0];
        
        for(let r = 0; r < columns; r++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
    setTwo();
    setTwo();
}
