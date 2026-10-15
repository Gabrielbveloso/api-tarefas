import express from "express";

const app = express();

const tarefas = [
  { id: 1, titulo: "Estudar", concluida: false },
  { id: 2, titulo: "Trabalhar", concluida: true },
  { id: 3, titulo: "Ir para a natação", concluida: true },
];

app.get("/", (req, res) => {
  res.json({ mensagem: "API de tarefas funcionando! 🚀" });
});

app.get("/tarefas", (req, res) => {
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

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000/");
});
