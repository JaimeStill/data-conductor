# Data Conductor

Expose legacy SQL data over HTTP as JSON with custom property structures to ingest in modern apps.

Uses [Microsoft.Data.SqlClient](https://github.com/dotnet/SqlClient) via the [SqlConnector](./src/server/Conductor.Services/Sql/SqlConnector.cs) Service, and [System.Text.Json.Nodes](https://docs.microsoft.com/en-us/dotnet/api/system.text.json.nodes?view=net-6.0) via the [SqlSerializer](./src/server/Conductor.Services/Sql/SqlSerializer.cs) Service.

* [Demonstration](#demonstration)
* [Requirements](#requirements)
* [Running](#running)
    * [Conductor Server](#conductor-server)
    * [Conductor App](#conductor-app)
* [Samples](#samples)
    * [ConsoleQuery](#consolequery)
    * [Personify](#personify)
* [Project Layout](#project-layout)
* [Features](#features)

## Demonstration
[Back to Top](#data-conductor)

> The demonstrations and samples throughout this repository use the OLTP version of the [AdventureWorks 2019 sample database](https://learn.microsoft.com/en-us/sql/samples/adventureworks-install-configure?view=sql-server-ver16&tabs=ssms).

https://user-images.githubusercontent.com/14102723/195953543-fd0bc1bd-d39f-4fa7-8b51-0c7bf0a5ebd8.mp4

In the above video, the [Connector](./src/server/Conductor.Models/Entities/Connector.cs) that is [seeded](./src/server/Conductor.DbCli/Seed/ConnectorSeeder.cs) by default [tests its connection](./src/server/Conductor.Api/Controllers/ConnectorController.cs#L21) to the database. Once successful, it then navigates to the [connector route](./src/app/src/app/routes/connector/) in the [Angular app](./src/app/src/app/).

In the connector route, a list of [Query](./src/server/Conductor.Models/Entities/Query.cs) records associated with the Connector are rendered. The [Get People](./src/server/Conductor.DbCli/Seed/ConnectorSeeder.cs#L27) query is selected, and it is [executed](./src/server/Conductor.Api/Controllers/QueryController.cs#L47) with the interpolated properties `skip:15034/size:200`. These values replace the `{{skip}}` and `{{size}}` values in the loaded query.

After the results are cleared, the data is retrieved directly through the API via http://localhost:5000/api/query/executeWIthProps/get-people/skip:15034/size:200 

With this query in place and functional, external applications can execute this query and interface with its data via the above API (substituting interpolated properties as desired):

https://user-images.githubusercontent.com/14102723/195955672-48e12fff-5083-425a-85f6-cc33d4ee3f07.mp4

The app demonstrated above can be found in the [personify](./samples/personify/) sample directory.

## Requirements
[Back to Top](#data-conductor)

* [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) with the [AdventureWorks 2019 OLTP](https://learn.microsoft.com/en-us/sql/samples/adventureworks-install-configure?view=sql-server-ver16&tabs=ssms) database loaded.
    * I use an instance of SQL Server 2019 Express for local development with a server name of `.\DevSql`.
* [.NET SDK](https://dotnet.microsoft.com/en-us/download) with the [dotnet-ef](https://learn.microsoft.com/en-us/ef/core/cli/dotnet) global tool installed.
* [Node.js LTS](https://nodejs.org/en/)
* [Visual Studio Code](https://code.visualstudio.com/)
    * Recommended Extensions:
        * Angular Language Services
        * C#
        * Task Explorer

## Running
[Back to Top](#data-conductor)

Once you have all of the requirements installed and configured, clone this repository and open it in code:

```bash
git clone https://github.com/JaimeStill/data-conductor

cd data-conductor

code .
```

> Note: Adjust the following connection strings as needed to match your SQL Server instance:
> * [appsettings.Development.json](./src/server/Conductor.Api/appsettings.Development.json)
> * [connections.json](./src/server/Conductor.Data/connections.json)

> Note: All of the commands illustrated below are available as VS Code Tasks:
>
> ![image](https://user-images.githubusercontent.com/14102723/195957288-e16efe91-ad3e-4528-811f-b5f79c2e9537.png)

### Conductor Server
[Back to Top](#data-conductor)

In a VS Code terminal, change directory to `./src/server` and execute the following:

```bash
# Restore NuGet dependencies and build the server
dotnet build

# Generate app database, apply migrations, and seed data
cd ./Conductor.DbCli

dotnet run

# Start the API server
cd ../Conductor.Api

dotnet watch run
```

Navigate to http://localhost:5000/swagger and you should see the API avaialble:

![image](https://user-images.githubusercontent.com/14102723/195956992-5407b9df-1b74-4e0d-8936-3c5da4f47a77.png)

### Conductor App
[Back to Top](#data-conductor)

In a VS Code terminal, change directory to `./src/app` and execute the following:

```bash
# Install node dependencies
npm i

# Make sure the API server from the above 
# steps is running in a separate terminal.
npm start
```

Navigate to http://localhost:3000 and you should see the client app:

![image](https://user-images.githubusercontent.com/14102723/195957861-6bd524bd-6f07-460b-81f5-6f0b0b4a135d.png)

## Samples
[Back to Top](#data-conductor)

The following sections illustrate how to build and run the [samples](/samples) provided in this repository.

### [ConsoleQuery](./samples/ConsoleQuery/)
[Back to Top](#data-conductor)

This sample was written to test the [Connector](./src/server/Conductor.Models/Entities/Connector.cs), [Query](./src/server/Conductor.Models/Entities/Query.cs), [SqlConnector](./src/server/Conductor.Services/Sql/SqlConnector.cs), and [SqlSerializer](./src/server//Conductor.Services/Sql/SqlSerializer.cs) interactions at the lowest level.

> Adjust the Server property in [Program](./samples/ConsoleQuery/Program.cs#L8) to match your SQL Server instance.

To run, simply execute the following from a terminal:

```bash
cd ./samples/ConsoleQuery

dotnet run
```

You should see the console app output:

![image](https://user-images.githubusercontent.com/14102723/195958885-95df53fe-7f6e-4710-9fd6-595ceefb07f7.png)

### [Personify](./samples/personify/)
[Back to Top](#data-conductor)

> Note: Adjust the connection string in [appsettings.Development.json](./samples/personify/server/Personify.Api/appsettings.Development.json) to match your SQL Server instance.

**Prerequisites** - Ensure you've followed all of the steps in [Conductor Server](#conductor-server) and have the Conductor API server running in its own terminal.

Open the `./samples/personify` workspace in a VS Code workspace:

```bash
cd ./samples/personify

code .
```

#### Personify Server
[Back to Top](#data-conductor)

In a VS Code terminal, change directory to `./server` and execute the following:

```bash
# Restore NuGet dependencies and build the server
dotnet build

# Generate app database and apply migrations
cd ./Personify.Data

dotnet ef database update ../Personify.Api

# Start the API server
cd ../Personify.Api

dotnet watch run
```

Navigate to http://localhost:5555/swagger and you should see the API avaialble:

![image](https://user-images.githubusercontent.com/14102723/195959491-e72be4e8-2ab8-4c19-98ea-ce8173bb5603.png)

#### Personify App
[Back to Top](#data-conductor)

In a VS Code terminal, change directory to `./app` and execute the following:

```bash
# Install node dependencies
npm i

# Make sure the API server from the above 
# steps is running in a separate terminal.
npm start
```

Navigate to http://localhost:3333 and you should see the client app:

![image](https://user-images.githubusercontent.com/14102723/195959742-ffbec37a-7ff3-4854-9f19-227f7e408332.png)

## Project Layout
[Back to Top](#data-conductor)

Coming soon.

## Features
[Back to Top](#data-conductor)

Coming soon.