-- CreateTable
CREATE TABLE "tarefas" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "concluida" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tarefas_pkey" PRIMARY KEY ("id")
);
