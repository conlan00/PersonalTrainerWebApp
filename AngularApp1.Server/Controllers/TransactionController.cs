using backend.ModelsTrainer;
using backend.Repositories.TransactionRepository;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;
using System.Text.Json;
using backend.Data;
using backend.DTOs.Account;
using backend.DTOs.BusinessDto;
using System.IdentityModel.Tokens.Jwt;
using Azure.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Features;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly ITransactionRepository _transactionRepository;
        public TransactionController(ITransactionRepository transactionRepository)
        {
            _transactionRepository = transactionRepository;
        }
        [Authorize(Roles = "User")]
        [HttpGet("getTransaction")]
        public async Task<ActionResult<IEnumerable<TransactionDto>>> GetTransactionByEmail()
        {
            var request = Request.Cookies["backend_token"];
            var handler = new JwtSecurityTokenHandler();
            var decode = handler.ReadToken(request) as JwtSecurityToken;
            var email = decode.Claims.FirstOrDefault(x => x.Type == "email");
            var transactionsDTO = await _transactionRepository.GetTransactionsByEmail(email.Value);
            return Ok(transactionsDTO);
        }
        [Authorize(Roles = "User")]
        [HttpPost("newTransaction")]
        public async Task<IActionResult> CreateTransaction(NewTransactionDto model)
        {
            if (model != null)
            {
                var request = Request.Cookies["backend_token"];
                var handler = new JwtSecurityTokenHandler();
                var decode = handler.ReadToken(request) as JwtSecurityToken;
                var email = decode.Claims.FirstOrDefault(x => x.Type == "email");

                var idTrasakcji=Math.Abs(Guid.NewGuid().GetHashCode());
                DateTimeOffset dateTimeOffset = DateTimeOffset.Parse(model.dateOfTransacton);
                var AddTransaction = new Transaction
                {
                    IdTransaction = idTrasakcji,
                    IsPaid = model.isPaid,
                    IdItem = GetItemId(model.itemName),
                    EmailUser=email.Value,
                    DateOfTransaction=dateTimeOffset
                };
                await _transactionRepository.CreateTransaction(AddTransaction);
                return Ok(new { Message = "Transakcja utworzona pomyślnie" });
            }
            else
            {
                return BadRequest($"Błąd podczas tworzenia transakcji: sdefdsfds");
            }
            
        }
        //autoryzacja jako admin
        [Authorize(Roles = "Admin")]
        [HttpGet("piechart")]
        public async Task<ActionResult<IEnumerable<PieChart>>> GetDataPieChart()
        {
            var Data = await _transactionRepository.GetItemCount();
            return Ok(Data);

        }
        //autoryzacja jako admin
        [Authorize(Roles = "Admin")]
        [HttpGet("revenue")]
        public async Task<ActionResult<IEnumerable<RevenueDto>>> Revenue()
        {
            var Data = await _transactionRepository.GetItemRevenue();
            return Ok(Data);

        }
        //autoryzacja jako admin
       [Authorize(Roles = "Admin")]
        [HttpGet("totalRevenue")]
        public async Task<ActionResult<IEnumerable<TotalRevenueDto>>> TotalRevenue()
        {
            var Data = await _transactionRepository.GetTotalRevenue();
            return Ok(Data);

        }

        private decimal? GetItemId(string itemName)
        {
            var itemIdTask = _transactionRepository.GetItemIdByNameAsync(itemName);
            decimal? item = itemIdTask.Result;
            return item;
        }



    }
}
