public class GameSettings {
    public int MaxScore { get; set; } = 11;
    public int ServeInterval { get; set; } = 2;
    public bool IsDeuce => Player1Score >= 10 && Player2Score >= 10;
}
