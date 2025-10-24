-- CreateTable
CREATE TABLE "distritos" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "distritos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daimokus" (
    "id" TEXT NOT NULL,
    "memberCode" TEXT,
    "memberName" TEXT,
    "distritoId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "minutes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daimokus_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "daimokus" ADD CONSTRAINT "daimokus_distritoId_fkey" FOREIGN KEY ("distritoId") REFERENCES "distritos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
