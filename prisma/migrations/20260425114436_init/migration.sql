-- CreateTable
CREATE TABLE "truck" (
    "id" SERIAL NOT NULL,
    "truck_id" TEXT NOT NULL,

    CONSTRAINT "truck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facility_location" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "facility_location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_records" (
    "id" SERIAL NOT NULL,
    "maintenance_date" DATE NOT NULL,
    "odometer_reading" INTEGER NOT NULL,
    "labor_hours" DECIMAL(10,2) NOT NULL,
    "labor_cost" DECIMAL(10,2) NOT NULL,
    "part_cost" DECIMAL(10,2) NOT NULL,
    "total_cost" DECIMAL(10,2) NOT NULL,
    "downtime_hours" DECIMAL(10,2) NOT NULL,
    "maintenance_type" TEXT NOT NULL,
    "service_description" TEXT NOT NULL,
    "truckId" INTEGER NOT NULL,
    "facilityLocationId" INTEGER NOT NULL,

    CONSTRAINT "maintenance_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "truck_truck_id_key" ON "truck"("truck_id");

-- CreateIndex
CREATE UNIQUE INDEX "facility_location_name_key" ON "facility_location"("name");

-- AddForeignKey
ALTER TABLE "maintenance_records" ADD CONSTRAINT "maintenance_records_truckId_fkey" FOREIGN KEY ("truckId") REFERENCES "truck"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_records" ADD CONSTRAINT "maintenance_records_facilityLocationId_fkey" FOREIGN KEY ("facilityLocationId") REFERENCES "facility_location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
