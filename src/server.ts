import express from "express";
import { prisma } from "./lib/prisma";
import { criarTarefaSchema } from "./schemas/tarefa";
import { string } from "zod";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensagem: "API de tarefas funcionando! ✅" });
});

app.get("/tarefas", async (req, res) => {
  const tarefas = await prisma.tarefa.findMany();
  res.json(tarefas);
});

app.get("/tarefas/:id", async (req, res) => {
  const id = Number(req.params.id);
  const tarefa = await prisma.tarefa.findUnique({ where: { id } });
  if (!tarefa) {
    return res.status(404).json({ erro: "Tarefa não encontrada" });
  }
  res.json(tarefa);
});

app.post("/tarefas", async (req, res) => {
  const resultado = criarTarefaSchema.safeParse(req.body);
  if (!resultado.success) {
    return res.status(400).json({ erro: resultado.error.issues[0].message });
  }
  const { titulo } = resultado.data;
  const novaTarefa = await prisma.tarefa.create({ data: { titulo } });
  res.status(201).json(novaTarefa);
});

app.put("/tarefas/:id", async (req, res) => {
  const id = Number(req.params.id);
  const tarefa = await prisma.tarefa.findUnique({ where: { id } });
  if (!tarefa) {
    return res.status(404).json({ erro: "Tarefa não encontrada" });
  }
  const { titulo, concluida } = req.body;
  const tarefaAtualizada = await prisma.tarefa.update({
    where: { id },
    data: { titulo, concluida },
  });
  res.json(tarefaAtualizada);
});

app.delete("/tarefas/:id", async (req, res) => {
  const id = Number(req.params.id);
  const tarefa = await prisma.tarefa.findUnique({ where: { id } });
  if (!tarefa) {
    return res.status(404).json({ erro: "Tarefa não encontrada" });
  }
  await prisma.tarefa.delete({ where: { id } });
  res.status(204).send();
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000/");
});
