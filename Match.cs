public class Match {
    public Player Player1 { get; set; }
    public Player Player2 { get; set; }
    public int GamesToWin { get; set; }
    public List<(int p1, int p2)> GameScores { get; set; } = new();
}
