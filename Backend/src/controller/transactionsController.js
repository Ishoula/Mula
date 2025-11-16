import { sql } from "../config/db.js";
export async function getTransactionsByUSerId(req, res) {
  try {
    const { userId } = req.params;
    const transactions =
      await sql`SELECT * FROM transactions WHERE user_id=${userId} ORDER BY created_at DESC`;
    console.log(transactions);
    res.status(200).json(transactions);
  } catch (error) {
    console.error("error retrieving transactions,", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function createTransaction(req, res) {
  try {
    const { user_id, title, amount, category } = req.body;
    if (!user_id || !title || !category || amount == undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const transactions = await sql`
            INSERT INTO transactions(user_id,title,amount,category)
            VALUES(${user_id},${title},${amount},${category})
            RETURNING *
            `;
    console.log(transactions);
    res.status(201).json(transactions[0]);
  } catch (error) {
    console.log("Error creating transaction", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
      res.status(400).json({ message: "Invalid transaction ID" });
    }
    const result =
      await sql`DELETE FROM transactions WHERE id=${id} RETURNING *`;
    if (result.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("error retrieving transactions,", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function getTransactionSummary(req, res) {
  const { userId } = req.params;
  const balanceResult = await sql` 
    SELECT COALESCE(SUM(amount),0) as balance FROM transactions WHERE user_id=${userId}
    `;
  const incomeResult = await sql`
    SELECT COALESCE(SUM(amount),0) as income FROM transactions 
    WHERE user_id=${userId} AND amount>0
    `;

  const expensesResult = await sql`
    SELECT COALESCE(SUM(amount),0) as expenses FROM transactions 
    WHERE user_id=${userId} AND amount<0
    `;

  res.status(200).json({
    balance: parseFloat(balanceResult[0].balance) || 0,
    income: parseFloat(incomeResult[0].income) || 0,
    expenses: parseFloat(expensesResult[0].expenses) || 0,
  });
}
