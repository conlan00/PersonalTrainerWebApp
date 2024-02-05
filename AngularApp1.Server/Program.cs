using backend.Data;
using backend.Model;
using backend.Repositories.ExerciseRepository;
using backend.Repositories.ItemRepository;
using backend.Repositories.TrainingRepository;
using backend.Repositories.TransactionRepository;
using backend.Repositories.UserRepository;
using backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<DataDbContext>(options =>{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DbConnection1"));
});
builder.Services.AddDbContext<TrainerDbContext>(options => {
    options.UseSqlServer(builder.Configuration.GetConnectionString("DbConnection2"));
});
//mo¿na teraz wstrzykiwaæ jwt serwis do kontrolerow
builder.Services.AddScoped<JWTService>();
builder.Services.AddScoped<EmailService>();
builder.Services.AddScoped<IItemRepository,ItemRepository>();
builder.Services.AddScoped<ITransactionRepository,TransactionRepository>();
builder.Services.AddScoped<ITrainingRepository,TrainingRepository>();
builder.Services.AddScoped<IUserRepository,UserRepository>();
builder.Services.AddScoped<IExerciseRepository,ExerciseRepository>();

builder.Services.AddIdentityCore<User>(options => {
    //konfiguracja has³a 
    options.Password.RequiredLength = 8;
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;
    //¿eby by³o potwierdzenie na mailu
    options.SignIn.RequireConfirmedEmail = true;
})
    .AddRoles<IdentityRole>()//zeby dodawac role
    .AddRoleManager<RoleManager<IdentityRole>>()//zeby uzywac menadzera roli
    .AddEntityFrameworkStores<DataDbContext>()//zeby dodac baze do przechowywania
    .AddSignInManager<SignInManager<User>>()//zeby mozna by³o sie logowac
    .AddUserManager<UserManager<User>>()//zeby mozna bylo tworzyc uzytkownika
    .AddDefaultTokenProviders();//zeby stworzyc tokeny to potwierdzenia e mail

//teraz jest mozliwosc autentykacji uzytkownika przez JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddCookie(x =>
    {
        x.Cookie.Name = "backand_token";
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"])),
            ValidIssuer = builder.Configuration["JWT:Issuer"],
            ValidateIssuer = true,
            ValidateAudience = false
        };
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                context.Token = context.Request.Cookies["backend_token"];
                return Task.CompletedTask;
            }
        };
    }).AddGoogle(googleOptions =>
    {
        googleOptions.ClientId = builder.Configuration["Authentication:Google:ClientId"];
        googleOptions.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
    });
/*builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<IdentityUser>()
 */
builder.Services.AddCors();
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = actionContext =>
    {
        var errors = actionContext.ModelState
        .Where(x => x.Value.Errors.Count > 0)
        .SelectMany(x => x.Value.Errors)
        .Select(x => x.ErrorMessage).ToArray();

        var toReturn = new
        {
            Errors = errors
        };
        return new BadRequestObjectResult(toReturn);
    };
});
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
app.UseCors(opt =>
{
    opt.AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials()
    .WithOrigins(builder.Configuration["JWT:ClientUrl"]);
});
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.MapIdentityApi<IdentityUser>();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
