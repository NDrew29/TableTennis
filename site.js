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
let actionHistory = []; // 👈 Track scoring events for undo

document.getElementById('name1').innerText = player1Name;
document.getElementById('name2').innerText = player2Name;

function incrementScore(player) {
    // Save current state BEFORE change
    actionHistory.push({ p1Score, p2Score });

    if (player === 1) p1Score++;
    else p2Score++;

    updateServeIndicator();
    updateScores();
    checkGameWin();
}

function undoLastAction() {
    if (actionHistory.length === 0) {
        alert("Nothing to undo.");
        return;
    }

    const lastState = actionHistory.pop();
    p1Score = lastState.p1Score;
    p2Score = lastState.p2Score;
    updateScores();
    updateServeIndicator();
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

        // Clear point-level undo stack
        actionHistory = [];

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
    actionHistory = []; // Also reset undo stack
    updateScores();
    updateServeIndicator();
}

function recordMatchResult(winner, loser) {
    const records = JSON.parse(localStorage.getItem("playerRecords") || "{}");

    // Ensure both players exist
    if (!records[winner]) {
        records[winner] = { wins: 0, losses: 0, gamesWon: 0, gamesPlayed: 0, streak: "", lastOpponent: "" };
    }
    if (!records[loser]) {
        records[loser] = { wins: 0, losses: 0, gamesWon: 0, gamesPlayed: 0, streak: "", lastOpponent: "" };
    }

    // Update winner
    records[winner].wins++;
    records[winner].gamesWon += gameHistory.filter(g => (g.p1 > g.p2 && player1Name === winner) || (g.p2 > g.p1 && player2Name === winner)).length;
    records[winner].gamesPlayed += gameHistory.length;
    records[winner].streak = updateStreak(records[winner].streak, true);
    records[winner].lastOpponent = loser;

    // Update loser
    records[loser].losses++;
    records[loser].gamesWon += gameHistory.filter(g => (g.p1 > g.p2 && player1Name === loser) || (g.p2 > g.p1 && player2Name === loser)).length;
    records[loser].gamesPlayed += gameHistory.length;
    records[loser].streak = updateStreak(records[loser].streak, false);
    records[loser].lastOpponent = winner;

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

function updateStreak(currentStreak, isWin) {
    if (!currentStreak) return isWin ? "W1" : "L1";

    const prefix = currentStreak[0];
    const count = parseInt(currentStreak.slice(1)) || 0;

    if ((isWin && prefix === "W") || (!isWin && prefix === "L")) {
        return `${prefix}${count + 1}`;
    } else {
        return isWin ? "W1" : "L1";
    }
}

// Rules modal behavior
document.getElementById("rulesInfo").addEventListener("click", () => {
    document.getElementById("rulesModal").classList.remove("hidden");
});

function closeRulesModal() {
    document.getElementById("rulesModal").classList.add("hidden");
}
