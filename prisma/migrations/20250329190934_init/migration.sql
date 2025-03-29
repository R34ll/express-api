-- CreateTable
CREATE TABLE "Pessoa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "nascimento" TEXT NOT NULL,
    "stack" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Pessoa_username_key" ON "Pessoa"("username");
