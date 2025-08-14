const urlParams = new URLSearchParams(window.location.search);
const player1Name = urlParams.get('p1') || "Player 1";
const player2Name = urlParams.get('p2') || "Player 2";
const matchLength = parseInt(urlParams.get('match')) || 3;
const gamesToWin = Math.ceil(matchLength / 2);

let p1Score = 0, p2Score = 0;
let gameNumber = 1;
let gameHistory = [];
let p1Wins = 0;
let p2Wins = 0;

document.getElementById('name1').innerText = player1Name;
document.getElementById('name2').innerText = player2Name;

function incrementScore(player) {
    if (player === 1) p1Score++;
    else p2Score++;

    updateServeIndicator();
    updateScores();
    checkGameWin();
}

function updateScores() {
    document.getElementById("score1").innerText = p1Score;
    document.getElementById("score2").innerText = p2Score;
}

function updateServeIndicator() {
    const totalPoints = p1Score + p2Score;
    const isDeuce = p1Score >= 10 && p2Score >= 10;
    const interval = isDeuce ? 1 : 2;
    const server = Math.floor(totalPoints / interval) % 2 === 0 ? 1 : 2;
    document.getElementById("server").innerText = `Serving: Player ${server}`;
}

function checkGameWin() {
    if ((p1Score >= 11 || p2Score >= 11) && Math.abs(p1Score - p2Score) >= 2) {
        const winner = p1Score > p2Score ? player1Name : player2Name;
        const loser  = p1Score < p2Score ? player1Name : player2Name;

        if (p1Score > p2Score) p1Wins++;
        else p2Wins++;

        gameHistory.push({ game: gameNumber, p1: p1Score, p2: p2Score });
        updateHistoryList();

        if (p1Wins === gamesToWin || p2Wins === gamesToWin) {
            recordMatchResult(winner, loser);
            showMatchSummary(winner);
        } else {
            alert(`🎯 ${winner} wins game ${gameNumber}`);
            gameNumber++;
            resetCurrentGame();
        }
    }
}

function updateHistoryList() {
    const list = document.getElementById("historyList");
    list.innerHTML = "";

    gameHistory.forEach(game => {
        const li = document.createElement("li");
        li.textContent = `Game ${game.game}: ${player1Name} ${game.p1} - ${game.p2} ${player2Name}`;
        list.appendChild(li);
    });
}

function resetCurrentGame() {
    p1Score = 0;
    p2Score = 0;
    updateScores();
    updateServeIndicator();
}

function recordMatchResult(winner, loser) {
    const records = JSON.parse(localStorage.getItem("playerRecords") || "{}");

    if (!records[winner]) records[winner] = { wins: 0, losses: 0 };
    if (!records[loser])  records[loser]  = { wins: 0, losses: 0 };

    records[winner].wins++;
    records[loser].losses++;

    localStorage.setItem("playerRecords", JSON.stringify(records));
}

function showMatchSummary(winner) {
    const modal = document.getElementById("matchSummary");
    const summaryText = document.getElementById("winnerSummary");
    const summaryList = document.getElementById("summaryList");

    summaryText.textContent = `${winner} wins the match!`;

    summaryList.innerHTML = "";
    gameHistory.forEach(game => {
        const li = document.createElement("li");
        li.textContent = `Game ${game.game}: ${player1Name} ${game.p1} - ${game.p2} ${player2Name}`;
        summaryList.appendChild(li);
    });

    modal.classList.remove("hidden");
}
