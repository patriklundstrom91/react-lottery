public class LotteryTicket
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int[] Numbers { get; set; } = new int[4];
    public DateTime Created { get; set; } = DateTime.Now;
    public bool Won { get; set; }
}