import express from "express";
import { prisma } from "./lib/prisma";

const app = express();
app.use(express.json());

const tarefas = [
  { id: 1, titulo: "Estudar", concluida: false },
  { id: 2, titulo: "Trabalhar", concluida: true },
  { id: 3, titulo: "Ir para a natação", concluida: true },
];

let proximoId = 4;

app.get("/", (req, res) => {
  res.json({ mensagem: "API de tarefas funcionando! ✅" });
});

app.get("/tarefas", async (req, res) => {
  const tarefas = await prisma.tarefa.findMany();
  res.json(tarefas);
});

app.get("/tarefas/:id", (req, res) => {
  const id = Number(req.params.id);
  const tarefa = tarefas.find((tarefa) => tarefa.id === id);
  if (!tarefa) {
    return res.status(404).json({ erro: "Tarefa não encontrada" });
  }
  res.json(tarefa);
});

app.post("/tarefas", async (req, res) => {
  const { titulo } = req.body;
  if (!titulo) {
    return res.status(400).json({ erro: "O título é obrigatório" });
  }
  const novaTarefa = await prisma.tarefa.create({ data: { titulo } });
  res.status(201).json(novaTarefa);
});

app.put("/tarefas/:id", (req, res) => {
  const id = Number(req.params.id);
  const indice = tarefas.findIndex((tarefa) => tarefa.id === id);
  if (indice === -1) {
    return res.status(404).json({ erro: "Tarefa não encontrada" });
  }
  tarefas[indice] = { ...tarefas[indice], ...req.body, id };
  res.json(tarefas[indice]);
});

app.delete("/tarefas/:id", (req, res) => {
  const id = Number(req.params.id);
  const indice = tarefas.findIndex((tarefa) => tarefa.id === id);
  if (indice === -1) {
    return res.status(404).json({ erro: "Tarefa não encontrada" });
  }
  tarefas.splice(indice, 1);
  res.status(204).send();
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000/");
});
