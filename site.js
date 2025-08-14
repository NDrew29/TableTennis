const urlParams = new URLSearchParams(window.location.search);
const player1Name = urlParams.get('p1') || "Player 1";
const player2Name = urlParams.get('p2') || "Player 2";
const matchLength = parseInt(urlParams.get('match')) || 3;

let p1Score = 0, p2Score = 0;

document.getElementById('name1').innerText = player1Name;
document.getElementById('name2').innerText = player2Name;

function incrementScore(player) {
    if (player === 1) p1Score++;
    else p2Score++;

    updateServeIndicator();
    updateScores();
    checkWin();
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

function checkWin() {
    if ((p1Score >= 11 || p2Score >= 11) && Math.abs(p1Score - p2Score) >= 2) {
    const winner = p1Score > p2Score ? player1Name : player2Name;
    const loser  = p1Score < p2Score ? player1Name : player2Name;

    recordMatchResult(winner, loser);

    alert(`🏆 ${winner} wins the game!`);
}
    
}

function recordMatchResult(winnerName, loserName) {
    const records = JSON.parse(localStorage.getItem("playerRecords") || "{}");

    if (!records[winnerName]) {
        records[winnerName] = { wins: 0, losses: 0 };
    }
    if (!records[loserName]) {
        records[loserName] = { wins: 0, losses: 0 };
    }

    records[winnerName].wins++;
    records[loserName].losses++;

    localStorage.setItem("playerRecords", JSON.stringify(records));
}

