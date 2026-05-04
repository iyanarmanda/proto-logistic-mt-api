<a id="readme-top"></a>

<div align="center">
  <a href="https://github.com/iyanarmanda/proto-logistic-mt-api">
    <img src="https://cdn.simpleicons.org/nestjs/E0234E" width="120" alt="NestJS Logo" />
  </a>

<h3 align="center">Main API of the AegisAI</h3>

  <p align="center">
    Digital form for logistic maintenance with AI data automation
    <br />
    <a href="https://aegiss-ai.netlify.app"><strong>View Demo »</strong></a>
    <br />
    <br />
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#how-to-use">How to Use</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
  </ol>
</details>

## About The Project

This project was developed specifically for a **Hackathon**, focusing on streamlining data entry through intelligent digital forms.

The primary challenge with traditional data input is "data noise" and human error, which often lead to corrupted datasets. This project mitigates these issues by combining rigorous client-side validation with an **AI-powered Data Cleaning** engine to sanitize and normalize inputs before they ever reach the server.

- Client repository: [https://github.com/virlyputri/lomba-hackathon](https://github.com/virlyputri/lomba-hackathon.git)
- API repository: [https://github.com/iyanarmanda/proto-logistic-mt-api](https://github.com/iyanarmanda/proto-logistic-mt-api.git)
- AI repository: [https://github.com/MrRaffs/Aegis_AI_endpoint](https://github.com/MrRaffs/Aegis_AI_endpoint.git)

### Built With

- [NestJS](https://nestjs.com/)
- [Fastify](https://fastify.dev/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Zod](https://zod.dev/)
- [TypeScript](https://www.typescriptlang.org/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

### Prerequisites

- **Node.js** (v22 recommended)
- **pnpm**
  ```sh
  npm install -g pnpm
  ```
- **VS Code extension**
  - **Prisma** by Prisma
  - **Jest** by Orta
  - **ESLint** by Microsoft
  - **Prettier - Code formatter** by Microsoft
- **Docker** (optional)

### Installation

1. Clone the repo

   ```bash
   git clone https://github.com/iyanarmanda/proto-logistic-mt-api.git
   ```

2. Install dependencies

   ```bash
   pnpm install
   ```

3. Husky preparation

   ```bash
   pnpm prepare
   ```

4. Environment variables

   Create `.env` file in project root. See environment example on `.env.example`

5. Prisma setup

   Create PostgreSQL database. If using docker, create lightweight database image with:

   ```bash
   docker compose up -d --build
   ```

   After database initiated, run these commands to setup prisma

   ```bash
   # generate prisma client
   pnpm prisma generate

   # create migration on database
   pnpm prisma migrate deploy
   ```

### How to Use

- Development Mode

  ```bash
  pnpm start:dev
  ```

- Build & production mode

  ```bash
  pnpm build
  pnpm start:prod
  ```

- Type checking

  ```bash
  pnpm check

  # or in watch mode
  pnpm check:watch
  ```

- Unit testing

  ```bash
  pnpm test
  ```

See more on `package.json` scripts

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

- Get all Trucks

  Endpoint:
  ```http
  GET /api/truck
  ```

  Response example (200 OK):
  ```json
  [
    {
      "id": 1,
      "truck_id": "TRK00001",
      "maintenanceRecords": []
    },
    {
      "id": 2,
      "truck_id": "TRK00002",
      "maintenanceRecords": []
    }
  ]
  ```

- Get all Facility Locations

  Endpoint:
  ```http
  GET /api/facility-location
  ```

  Response example (200 OK):
  ```json
  [
    {
      "id": 1,
      "name": "Los Angeles",
      "maintenanceRecords": []
    },
    {
      "id": 2,
      "name": "Las Vegas",
      "maintenanceRecords": []
    }
  ]
  ```

- Create Maintenance Record

  Endpoint:
  ```http
  POST /api/maintenance
  ```

  Payload example:
  ```json
  {
    "truckId": "TRK00001",
    "maintenanceDate": "2026-05-04",
    "maintenanceType": "Engine",
    "odometerReading": 128500,
    "laborHours": "1.00",
    "laborCost": "100.00",
    "partCost": "0.00",
    "downtimeHours": "1.50",
    "facilityLocation": "Los Angeles",
    "service_description": "Routine Engine"
  }
  ```

  Success response example:
  ```json
  {
    "message": "Maintenance recorded successfully",
    "data": {
      "id": 2,
      "maintenanceDate": "2026-05-04",
      "odometerReading": 128500,
      "laborHours": "1.00",
      "laborCost": "100.00",
      "partCost": "0.00",
      "totalCost": "100.00",
      "downtimeHours": "1.50",
      "maintenanceType": "Engine",
      "serviceDescription": "Routine Engine",
      "truckId": "TRK00001",
      "facilityLocationId": 1,
      "aiAnalysis": {
        "isAnomaly": false,
        "anomalyScore": 0.012812971230573942
      }
    }
  }
  ```

  Anomaly response example:
  ```json
  {
    "message": "Maintenance recorded is marked as an anomaly",
    "data": {
      "aiAnalysis": {
        "isAnomaly": true,
        "anomalyScore": -0.2361890419571126932
      }
    }
  }
  ```

- Get all Maintenance Record

  Endpoint:
  ```http
  GET /api/maintenance
  ```

  Response example (200 OK):
  ```json
  {
    "data": [
      {
        "id": 1,
        "maintenanceDate": "2026-05-01",
        "odometerReading": 125000,
        "laborHours": "4.50",
        "laborCost": "450.00",
        "partCost": "1200",
        "totalCost": "1650.00",
        "downtimeHours": "6.00",
        "maintenanceType": "Preventive",
        "serviceDescription": "Scheduled Preventive",
        "truckId": 1,
        "facilityLocationId": 2,
        "truck": {
          "id": 1,
          "truckId": "TRK00001"
        },
        "facility_location": {
          "id": 2,
          "name": "Las Vegas"
        }
      },
      {
        "id": 2,
        "maintenanceDate": "2026-05-04",
        "odometerReading": 128500,
        "laborHours": "1.00",
        "laborCost": "100.00",
        "partCost": "0.00",
        "totalCost": "100.00",
        "downtimeHours": "1.50",
        "maintenanceType": "Engine",
        "serviceDescription": "Routine Engine",
        "truckId": 1,
        "facilityLocationId": 1,
        "truck": {
          "id": 1,
          "truckId": "TRK00001"
        },
        "facility_location": {
          "id": 1,
          "name": "Los Angeles"
        }
      }
    ],
    "meta": {
      "totalData": 2,
      "totalPages": 1,
      "page": 1,
      "limit": 25
    }
  }
  ```

  Query schema:
  |query|type|default|
  |-----|----|-------|
  |page|string (number)|1|
  |limit|string (number)|25|
  |sort|'asc', 'desc'|'desc'|
  |filter|string|null|

- AI Service Payload

  Payload example:
  ```json
  {
    "truck_id": "TRK00001",
    "maintenance_date": "2026-05-04",
    "service_description": "Routine Engine",
    "maintenance_type": "Engine",
    "odometer_reading": 128500,
    "labor_hours": "1.00",
    "labor_cost": "100.00",
    "part_cost": "0.00",
    "total_cost": "100.00",
    "facilityLocationId": 1,
    "downtime_hours": "1.50",
    "days_since_last": 2
  }
  ```

See more on `prisma/schema.prisma` for detailed Prisma Schema.

Another data source:

|Data|path|
|----|----|
|`maintenance_type` enum|`./src/modules/maintenance-records/enums/maintenance-type.enum.ts`|
|`service_description` enum|`./src/modules/maintenance-records/enums/service-description.enum.ts`|
|`truck` data|`./src/seed/data/truck.data.ts`|
|`facility_location` data|`./src/seed/data/facility-location.data.ts`|

<p align="right">(<a href="#readme-top">back to top</a>)</p>
