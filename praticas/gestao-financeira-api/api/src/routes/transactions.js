import { Router } from "express"
import { prisma } from "../lib/prisma.js"
import {
  createTransactionSchema,
  updateTransactionSchema,
} from "../schemas/transactionSchema.js"

const router = Router()

router.get("/", async (req, res, next) => {
  try {
    const transactions = await prisma.transaction.findMany({
      include: { category: true },
      orderBy: { date: "desc" },
    })

    res.json(transactions)
  } catch (error) {
    next(error)
  }
})

router.post("/", async (req, res, next) => {
  try {
    const data = createTransactionSchema.parse(req.body)
    const transaction = await prisma.transaction.create({
      data,
      include: { category: true },
    })

    res.status(201).json(transaction)
  } catch (error) {
    next(error)
  }
})

router.put("/:id", async (req, res, next) => {
  try {
    const data = updateTransactionSchema.parse(req.body)
    const transaction = await prisma.transaction.update({
      where: { id: req.params.id },
      data,
      include: { category: true },
    })

    res.json(transaction)
  } catch (error) {
    next(error)
  }
})

router.delete("/:id", async (req, res, next) => {
  try {
    await prisma.transaction.delete({ where: { id: req.params.id } })
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export default router
