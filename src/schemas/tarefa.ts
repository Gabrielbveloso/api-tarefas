import { z } from "zod";

const tituloSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined
        ? "O título é obrigatório"
        : "O título deve ser um texto",
  })
  .trim()
  .min(1, "O título é obrigatório");

export const criarTarefaSchema = z.object({
  titulo: tituloSchema,
});

export const atualizarTarefaSchema = z.object({
  titulo: tituloSchema.optional(),
  concluida: z
    .boolean({ error: "A conclusão deve ser verdadeiro ou falso" })
    .optional(),
});

export const idSchema = z.coerce.number().int().positive();
