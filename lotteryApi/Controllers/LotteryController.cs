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
        return Ok(ticket);
    }
}