import express from "express";
import { prisma } from "./lib/prisma";
import {
  criarTarefaSchema,
  idSchema,
  atualizarTarefaSchema,
} from "./schemas/tarefa";

const app = express();
app.use(express.json());

// Rota inicial: confirma que a API está no ar
app.get("/", (req, res) => {
  res.json({ mensagem: "API de tarefas funcionando! ✅" });
});

// Rota que lista todas as tarefas do banco
app.get("/tarefas", async (req, res) => {
  const tarefas = await prisma.tarefa.findMany();
  res.json(tarefas);
});

// Rota que busca uma tarefa pelo id.
// Responde 400 se o id for inválido, e 404 se a tarefa não existir.
app.get("/tarefas/:id", async (req, res) => {
  const resultadoId = idSchema.safeParse(req.params.id);
  if (!resultadoId.success) {
    return res
      .status(400)
      .json({ erro: "O id deve ser um número inteiro positivo" });
  }
  const id = resultadoId.data;
  const tarefa = await prisma.tarefa.findUnique({ where: { id } });
  if (!tarefa) {
    return res.status(404).json({ erro: "Tarefa não encontrada" });
  }
  res.json(tarefa);
});

// Rota que cria uma tarefa.
// Responde 400 se o título for inválido, e 201 com a tarefa criada.
app.post("/tarefas", async (req, res) => {
  const resultado = criarTarefaSchema.safeParse(req.body);
  if (!resultado.success) {
    return res.status(400).json({ erro: resultado.error.issues[0].message });
  }
  const { titulo } = resultado.data;
  const novaTarefa = await prisma.tarefa.create({ data: { titulo } });
  res.status(201).json(novaTarefa);
});

// Rota que atualiza o título e/ou a conclusão de uma tarefa.
// Responde 400 se o id ou os dados forem inválidos, e 404 se a tarefa não existir.
app.put("/tarefas/:id", async (req, res) => {
  const resultadoId = idSchema.safeParse(req.params.id);
  if (!resultadoId.success) {
    return res
      .status(400)
      .json({ erro: "O id deve ser um número inteiro positivo" });
  }
  const id = resultadoId.data;
  const resultado = atualizarTarefaSchema.safeParse(req.body);
  if (!resultado.success) {
    return res.status(400).json({ erro: resultado.error.issues[0].message });
  }
  const tarefa = await prisma.tarefa.findUnique({ where: { id } });
  if (!tarefa) {
    return res.status(404).json({ erro: "Tarefa não encontrada" });
  }
  const { titulo, concluida } = resultado.data;
  const tarefaAtualizada = await prisma.tarefa.update({
    where: { id },
    data: { titulo, concluida },
  });
  res.json(tarefaAtualizada);
});

// Rota que apaga uma tarefa.
// Responde 400 se o id for inválido, 404 se a tarefa não existir, e 204 se apagar.
// Busca antes de apagar porque o delete do Prisma dá erro (500) se a tarefa não existir.
app.delete("/tarefas/:id", async (req, res) => {
  const resultadoId = idSchema.safeParse(req.params.id);
  if (!resultadoId.success) {
    return res
      .status(400)
      .json({ erro: "O id deve ser um número inteiro positivo" });
  }
  const id = resultadoId.data;
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
