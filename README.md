# Personal Trainer Web Applicaton [Using Angular + .Net 8 + MSSQL + Google API + MAILJET API + OPEN AI GPT MODEL API + PAYPAL API + IDENTITY FRAMEWORK + HTTP ONLY FLAG + JWT]

## Description

The web application for a personal trainer is a tool designed to facilitate the management of workouts, nutrition plans, and communication with clients. It enables trainers to effectively plan and monitor the progress of their clients, delivering personalized workouts and nutrition plans.

## Key Features

- **Creating personalized training plans:** Admin Panel allows create training plan for user, who bought training offer.
- **Diet Planning:** Connection with OpenAi Api allows you to propose a menu with macronutrients.
- **Monitoring:** You can see your total revenue, your total income per day in last week, number of users and most frequently selected training offers
- **Paypal payments:** Transaction is created after using Paypal payments
- **Google API:** Everyone can use your own Google account for log in into your trianer system.
- **MailJet API:** If users create accounts on your website, mailjet is sending verification email. 

## Requirements and installation
### Software Dependencies

Before running your Angular + .NET application with an MS SQL Database, make sure you have the following software installed:

1. **Node.js and npm:**
   - Download and install Node.js from [nodejs.org](https://nodejs.org/).
   - npm (Node Package Manager) is included with Node.js.

2. **Angular CLI:**
   - Install Angular CLI globally using the following command:
     ```bash
     npm install -g @angular/cli
     ```

3. **Visual Studio or Visual Studio Code:**
   - Download and install Visual Studio from [visualstudio.microsoft.com](https://visualstudio.microsoft.com/).
   - Alternatively, you can use Visual Studio Code ([code.visualstudio.com](https://code.visualstudio.com/)).

4. **.NET SDK:**
   - Install the .NET SDK from [dotnet.microsoft.com](https://dotnet.microsoft.com/download).
   - Verify the installation by running:
     ```bash
     dotnet --version
     ```

5. **SQL Server:**
   - Install Microsoft SQL Server. You can use the free [SQL Server Express](https://www.microsoft.com/en-us/sql-server/sql-server-downloads).
   - Set up a new database and take note of the connection string.

## Application Setup

Now, let's set up your Angular + .NET application:

1. **Angular Application:**
   - Navigate to your Angular project folder.
   - Install project dependencies using:
     ```bash
     npm install
     ```
   - Start the Angular development server:
     ```bash
     ng serve
     ```

2. **.NET Application:**
   - Open your .NET solution in Visual Studio or Visual Studio Code.
   - Configure the database connection string and other services in your `appsettings.json` or `appsettings.Development.json` file.
   Example:
    `appsettings.json`:
      ```bash
               {
            "Logging": {
              "LogLevel": {
                "Default": "Information",
                "Microsoft.AspNetCore": "Warning"
              }
            },
            "AllowedHosts": "*",
            "ConnectionStrings": {
              "DbConnection1": "Your Connection string to DbUsers",
              "DbConnection2": "Your Connection String to TrainerSystem"
            },
            "JWT": {
              "Key": "Your JWT KEY",
              "ExpiresInDays": 100,
              "Issuer": "http://localhost:5118",
              "ClientUrl": "https://localhost:4200"
            },
            "MailJet": {
              "ApiKey": "Your Api KEY",
              "SecretKey": "Your Secret Key"
            },
            "Email": {
              "From": "Your eamil sender @gmail.com",
              "ApplicationName": "Your App Name",
              "ConfirmEmailPath": "account/confirm-email",
              "ResetPasswordPath": "account/reset-password"
            }
          }
     ```
   - Configure OpenAi. Go to `OpenAiController.cs` and paste your API Key:
     ```bash
      string apiKey = "Your Open AI KEY";
     ```
   - Configure Google API. Go to `login-google.component.ts` and paste your client ID:
      ```bash
      client_id: 'Your Google client ID',
      ```
   - Configure Paypal API. Go to `payment.component.html` and paste script with your client ID:
     ```bash
       <head>
        <script src="https://www.paypal.com/sdk/js?client-id= YOUR PAYAPL KEY"></script>
      </head>
     ```
   - Run the .NET application using the IDE or with the command:
     ```bash
     dotnet run
     ```

3. **Run Sql scripts from `SqlScripts` directory:**
   - `DbUsers.sql`
   - `TrainerSystem.sql`

## Integration

1. **Angular + .NET Integration:**
   - Ensure that your Angular application is configured to make HTTP requests to the correct API endpoint provided by your .NET application.

2. **Database Integration:**
   - Ensure that your .NET application is configured with the correct connection string to connect to your MS SQL Database.

## Running the Full Stack

1. **Run Angular Application:**
   - Access the Angular application in your web browser at `http://localhost:4200`.

2. **Run .NET Application:**
   - Access the .NET application at the specified API endpoint (e.g., `http://localhost:5000` or `https://localhost:5001`).

Your Angular + .NET application with an MS SQL Database should now be up and running. Make sure to handle CORS settings, authentication, and authorization based on your application's requirements.

Feel free to adapt the instructions based on your specific project structure and configuration.

## Db Schemas

   - Database `DbUsers`
     ![image](https://github.com/conlan00/PersonalTrainerWebApp/assets/104897926/8717095c-ca32-44ec-9985-19364b94eab2)
   - Database `TrainerSystem`
    ![image](https://github.com/conlan00/PersonalTrainerWebApp/assets/104897926/9cf69640-f721-428f-8650-9d576b7d238b)

## Use
### Login
![image](https://github.com/conlan00/PersonalTrainerWebApp/assets/104897926/539d0407-aa3f-4dd9-a345-94f82eda268b)
### Payment
![image](https://github.com/conlan00/PersonalTrainerWebApp/assets/104897926/2fb3c03a-c5dc-4231-8920-09233ac98122)
### OpenAI
![image](https://github.com/conlan00/PersonalTrainerWebApp/assets/104897926/45b450d5-bd5b-4241-ba9a-3e75087fb0ee)
### Administration Panel 
#### Dashboards
![image](https://github.com/conlan00/PersonalTrainerWebApp/assets/104897926/8e5daf0c-d831-4521-b0c1-607c7fe1d186)
#### Add Exercise
![image](https://github.com/conlan00/PersonalTrainerWebApp/assets/104897926/9ada65e5-ad68-4a6e-b082-b9088409c0a1)
#### Add Offer
![image](https://github.com/conlan00/PersonalTrainerWebApp/assets/104897926/70034f02-da0e-4b20-afa3-5bdb96bf4783)
#### Add Training
![image](https://github.com/conlan00/PersonalTrainerWebApp/assets/104897926/a69e8680-f4d4-4810-922b-8915aee368c0)

## Contribution

We welcome community engagement and contributions from other developers to enhance the development of this project. Below, you'll find information on how you can contribute to our application:

### Reporting Bugs

If you come across a bug or issue in our application, please create an issue in the "Issues" section. Ensure that you provide a detailed description of the bug, reproduction steps, and the expected behavior.

### Feature Requests

If you have an idea for a new feature or an improvement to an existing one, use the "Issues" section to share your proposal. Try to describe the feature clearly and include any details you find relevant.

### Submitting Pull Requests

We accept pull requests! If you wish to add a new feature, fix a bug, or make any other contribution, we appreciate you submitting a pull request. Make sure that:

- Your code complies with our coding standards.
- You clearly describe what your pull request introduces.
- You've tested your changes and ensured they don't introduce new issues.


Using photos from:
- https://unsplash.com/
