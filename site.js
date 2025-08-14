let p1Score = 0, p2Score = 0, serveCount = 0;

function incrementScore(player) {
    if (player === 1) p1Score++;
    else p2Score++;

    serveCount++;
    updateServeIndicator();
    checkWinCondition();
    updateUI();
}

function updateServeIndicator() {
    const totalPoints = p1Score + p2Score;
    const interval = (p1Score >= 10 && p2Score >= 10) ? 1 : 2;
    const server = Math.floor(totalPoints / interval) % 2 === 0 ? 1 : 2;
    document.getElementById('server').textContent = `Serving: Player ${server}`;
}

function checkWinCondition() {
    if ((p1Score >= 11 || p2Score >= 11) && Math.abs(p1Score - p2Score) >= 2) {
        alert(`Player ${p1Score > p2Score ? 1 : 2} wins!`);
    }
}
