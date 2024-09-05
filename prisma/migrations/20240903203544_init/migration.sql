-- CreateEnum
CREATE TYPE "Blockchain" AS ENUM ('SOLANA', 'BITCOIN', 'ETHERIUM', 'LEGEND');

-- CreateTable
CREATE TABLE "User" (
    "password" TEXT NOT NULL,
    "seedPhrase" TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("password")
);

-- CreateTable
CREATE TABLE "Accounts" (
    "id" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,

    CONSTRAINT "Accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockchainWallet" (
    "id" TEXT NOT NULL,
    "name" "Blockchain" NOT NULL,
    "privateKey" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "balance" TEXT NOT NULL,

    CONSTRAINT "BlockchainWallet_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Accounts" ADD CONSTRAINT "Accounts_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("password") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockchainWallet" ADD CONSTRAINT "BlockchainWallet_id_fkey" FOREIGN KEY ("id") REFERENCES "Accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
