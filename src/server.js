import express from "express";

const app = express();
app.use(express.json());

const tarefas = [
  { id: 1, titulo: "Estudar", concluida: false },
  { id: 2, titulo: "Trabalhar", concluida: true },
  { id: 3, titulo: "Ir para a natação", concluida: true },
];

let proximoId = 4;

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

app.post("/tarefas", (req, res) => {
  const { titulo } = req.body;
  if (!titulo) {
    return res.status(400).json({ erro: "O título é obrigatório" });
  }
  const novaTarefa = { id: proximoId, titulo, concluida: false };
  proximoId++;
  tarefas.push(novaTarefa);
  res.status(201).json(novaTarefa);
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000/");
});
