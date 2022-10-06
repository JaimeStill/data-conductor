# Data Conductor

> Still a work in progress

Expose legacy SQL data over HTTP as JSON with custom property structure.

![image](https://user-images.githubusercontent.com/14102723/194438092-85de510e-ad10-46b4-8f43-cce6ac01b44a.png)

**App Demo**

https://user-images.githubusercontent.com/14102723/193418612-ec774bd7-6b15-451a-a658-e4e276e5bfc9.mp4

**Standard SQL Query:**

![image](https://user-images.githubusercontent.com/14102723/192172083-1a2269cd-9346-4b16-8e11-b667b61675c7.png)

**SQL Services Tested in [ConsoleQuery](./src/samples/ConsoleQuery/):**

![image](https://user-images.githubusercontent.com/14102723/194323419-4da30164-48e3-422b-8b71-2bfd8ea29886.png)

**Executing [Query](./src/server/Conductor.Models/Entities/Query.cs) over [QueryController](./src/server/Conductor.Api/Controllers/QueryController.cs) via [QueryService](./src/server/Conductor.Services/Api/QueryService.cs):**

![image](https://user-images.githubusercontent.com/14102723/192171967-3656d731-813f-49c1-a9d2-1abf3033065b.png)
