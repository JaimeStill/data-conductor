# Data Conductor

Expose legacy SQL data over HTTP as JSON with custom property structures to ingest in modern apps.

Uses [Microsoft.Data.SqlClient](https://github.com/dotnet/SqlClient) via the [SqlConnector](./src/server/Conductor.Services/Sql/SqlConnector.cs) Service, and [System.Text.Json.Nodes](https://docs.microsoft.com/en-us/dotnet/api/system.text.json.nodes?view=net-6.0) via the [SqlSerializer](./src/server/Conductor.Services/Sql/SqlSerializer.cs) Service.

* [Demonstration](#demonstration)
* [Requirements](#requirements)
* [Running](#running)
* [Project Layout](#project-layout)
* [Features](#features)
* [Samples](#samples)

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

## Conductor Server

In a VS Code terminal, change directory to `src/server` and execute the following:

```bash
dotnet build

cd Conductor.Data

dotnet ef database update -s ..\Conductor.Api

cd ..\Conductor.Api

dotnet watch run
```

Navigate to http://localhost:5000/swagger and you should see the API avaialble:

![image](https://user-images.githubusercontent.com/14102723/195956992-5407b9df-1b74-4e0d-8936-3c5da4f47a77.png)

Alternatively, you can just use the provided VS Code tasks:

![image](https://user-images.githubusercontent.com/14102723/195956845-fe902b73-219b-49bd-ba43-0b447a4b61e5.png)


## Project Layout
[Back to Top](#data-conductor)

## Features
[Back to Top](#data-conductor)

## Samples
[Back to Top](#data-conductor)