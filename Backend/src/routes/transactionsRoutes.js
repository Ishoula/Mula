import express from "express";
import {
  createTransaction,
  getTransactionsByUSerId,
  deleteTransaction,
  getTransactionSummary,
} from "../controller/transactionsController.js";

const router = express.Router();

router.get("/summary/:userId", getTransactionSummary);

router.get("/:userId", getTransactionsByUSerId);

router.post("/", createTransaction);

router.delete("/:id", deleteTransaction);

export default router;
