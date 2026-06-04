export function errorHandler(error, req, res, next) {
  console.error(error)

  if (error.name === "ZodError") {
    return res.status(400).json({
      error: "Dados invalidos",
      details: error.issues,
    })
  }

  if (error.code === "P2025") {
    return res.status(404).json({ error: "Recurso nao encontrado" })
  }

  if (error.code === "P2002") {
    return res.status(409).json({ error: "Registro duplicado" })
  }

  if (error.code === "P2003") {
    return res.status(400).json({
      error: "Recurso em uso por outro registro",
    })
  }

  res.status(500).json({ error: "Erro interno do servidor" })
}
