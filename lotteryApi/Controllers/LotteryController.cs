using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class LotteryController : ControllerBase
{
    private readonly AppDbContext _context;

    public LotteryController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("submit-ticket")]
    public async Task<IActionResult> SubmitTicket([FromBody] TicketDto ticketDto)
    {
        var ticket = new LotteryTicket { UserId = ticketDto.UserId, Numbers = ticketDto.Numbers };
        await _context.Tickets.AddAsync(ticket);
        await _context.SaveChangesAsync();
        return Ok(new { id = ticket.Id });
    }

    [HttpGet("draw")]
    public IActionResult Draw()
    {
        var winningNumbers = Enumerable.Range(1, 9).OrderBy(x => Guid.NewGuid()).Take(4).ToArray();
        return Ok(winningNumbers);
    }
    private static int[]? _winningNumbers;

    [HttpGet("check/{ticketId}")]
    public async Task<IActionResult> CheckTicket(int ticketId)
    {
        var ticket = await _context.Tickets.FindAsync(ticketId);
        if (ticket == null) return NotFound();

        // Jämför mot vinnarnummer (efter draw!)
        var matches = ticket.Numbers.Intersect(_winningNumbers ?? new int[0]).Count();
        ticket.Won = matches >= 3;  // Din vinstregel

        await _context.SaveChangesAsync();

        return Ok(new { won = ticket.Won, matches, winningNumbers = _winningNumbers });
    }

}