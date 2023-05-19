var board;
var score = 0;
var rows = 4;
var columns = 4;
window.onload = function () {
    setGame();
}

function setGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
        // [2, 4, 8, 16],
        // [32, 64, 128, 256],
        // [512, 1024, 2, 32],
        // [4, 2, 16, 8]
    ]

    document.getElementById('score').innerHTML = "Score: " + score;
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

function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
}
function setTwo() {
    if (!hasEmptyTile()) {
        return;
    }
    let found = false;
    while (!found) {
        //random r, c
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            tile.style.animation = "newTileAnimation 0.3s";
            tile.addEventListener("animationend", () => {
                tile.style.animation = "";
            });
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
        if (num <= 1024) {
            tile.classList.add("x" + num.toString());
        }
        else {
            tile.classList.add("x2048");
        }
    }
}

// animation for tile and gameover function conditionals
function slideTile(tile, r, c) {
    const tileElement = document.getElementById(r.toString() + "-" + c.toString());
    const initialX = tileElement.offsetLeft;
    const initialY = tileElement.offsetTop;
    const finalX = c * 120;
    const finalY = r * 120;
    const deltaX = finalX - initialX;
    const deltaY = finalY - initialY;

    tile.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    tile.style.transition = "transform 0.3s";
    tile.addEventListener("transitionend", () => {
        tile.style.transform = "";
        tile.style.transition = "";
    });
    setTimeout(() => {
        tile.style.transform = "translate(0, 0)";
        if (gameOver()) {
            gameOver();
            document.getElementById('over').style.display = 'flex';
        }
    }, 10);
}


// swipe event listener
const swipeElement = document.getElementById('board');
let startX, startY;
swipeElement.addEventListener('touchstart', touchStart, false);
swipeElement.addEventListener('touchend', touchEnd, false);
function touchStart(event) {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
}
function touchEnd(event) {
    const endX = event.changedTouches[0].clientX;
    const endY = event.changedTouches[0].clientY;
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    if (Math.abs(deltaX
    ) > Math.abs(deltaY)) {
        if (deltaX > 0) {
            console.log('Right swipe detected');
            slideRight();
        } else {
            console.log('Left swipe detected');
            slideLeft();
        }
    } else {
        if (deltaY > 0) {
            console.log('Down swipe detected');
            slideDown();
        } else {
            console.log('Up swipe detected');
            slideUp();
        }
    }
}

document.addEventListener("keydown", (e) => {
    if (document.getElementById('over').style.display == 'flex') {
        return;
    }
    else if (e.code == "ArrowLeft" || e.code == "ArrowRight" || e.code == "ArrowUp" || e.code == "ArrowDown") {
        e.preventDefault(); // Disable default arrow key behavior (scrolling)
    }

    if (e.code == "ArrowLeft") {
        slideLeft();
    } else if (e.code == "ArrowRight") {
        slideRight();
    } else if (e.code == "ArrowUp") {
        slideUp();
    } else if (e.code == "ArrowDown") {
        slideDown();
    }
});

// Disable scroll on swipe
document.getElementById('board').addEventListener('touchmove', function (event) {
    event.preventDefault();
}, { passive: false });


function filterZero(row) {
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
            document.getElementById('score').innerHTML = "Score: " + score;

        }
        else if (row[i] == 2048) {
            document.getElementById('over-text').innerHTML = 'You Won!';
            document.getElementById('over').style.display = 'flex';
        }// [2, 2, 2] --> [4, 0, 2]
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

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            tile.style.transform = "translateY(tile.offsetLeft)";
            updateTile(tile, num);
            slideTile(tile, r, c);
        }
    }
    setTwo();
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row.reverse();
        row = slide(row);
        row.reverse();
        board[r] = row;

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
            slideTile(tile, r, c);
        }
    }
    setTwo();
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        board[0][c] = row[0];
        board[1][c] = row[1];
        board[2][c] = row[2];
        board[3][c] = row[3];

        for (let r = 0; r < columns; r++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
            slideTile(tile, r, c);
        }
    }
    setTwo();
}

function slideDown() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        board[0][c] = row[3];
        board[1][c] = row[2];
        board[2][c] = row[1];
        board[3][c] = row[0];

        for (let r = 0; r < columns; r++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
            slideTile(tile, r, c);
        }
    }
    setTwo();
}
function tryAgain() {
    document.getElementById("over").style.display = "none";
    score = 0;
    document.querySelectorAll('.tile').forEach(e => e.remove());
    setGame();
}
function share() {
    const shareData = {
        title: "2048",
        text: "🎮 Check out this addictive web game, 2048! 🧩🔢 Merge numbered tiles, strategize, and aim for the elusive 2048 tile. Challenge your mind and test your skills in this captivating puzzle adventure. Can you conquer the board and achieve the highest score? Play now and see if you have what it takes to become a 2048 champion! 💪💯 #2048 #puzzlegame #addictivefun #brainteaser",
        url: "http://blaisepascal287.github.io/game/2048.html"
    };
    navigator.share(shareData);
}
function gameOver() {
    // Check if the player has achieved the 2048 tile
    if (board.some(row => row.includes(2048))) {
        document.getElementById('over-text').innerHTML = 'You Won!';
        return true;
    }
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            const currentTile = board[r][c];
            if (currentTile == 0) {
                return false; // There is an empty tile, game is not over
            }
            if (
                (r > 0 && board[r - 1][c] == currentTile) ||
                (r < rows - 1 && board[r + 1][c] == currentTile) ||
                (c > 0 && board[r][c - 1] == currentTile) ||
                (c < columns - 1 && board[r][c + 1] == currentTile)
            ) {
                return false; // There is a possible merge, game is not over
            }
        }
    }
    document.getElementById('over-text').innerHTML = 'Game Over!';
    return true;
}