const express = require("express")
const cors = require("cors")
const { Pool } = require("pg")

const pool = new Pool({ connectionString })
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    origin: isProduction ? "https://blog.ass.af" : "*",
  })
)

app.get("/comments", async (req, res) => {
  const results = await pool.query("SELECT * FROM comments ORDER BY date DESC")
  res.status(200).json(results.rows)
})

app.get("/comments/:slug", async (req, res) => {
  const slug = req.params.slug

  const results = await pool.query(
    "SELECT * FROM comments WHERE slug = $1 ORDER BY date DESC",
    [slug]
  )

  res.status(200).json(results.rows)
})

app.post("/comments", async (req, res) => {
  const { name, slug, text } = request.body
  const parentCommentId = parseInt(request.body.parentCommentId)

  await pool.query(
    "INSERT INTO comments (name, slug, text, parent_comment_id) VALUES ($1, $2, $3, $4)",
    [name, slug, text, parentCommentId]
  )
  res.status(201).json({ status: "success", message: "New comment added." })
})

app.put("/comments/:id", async (req, res) => {
  const { name, slug, text } = request.body
  const id = parseInt(request.params.id)
  const parentCommentId = parseInt(request.body.parentCommentId)
  await pool.query(
    "UPDATE comments SET name = $1, slug = $2, text = $3, parent_comment_id = $4 WHERE id = $5",
    [name, slug, text, parentCommentId, id]
  )
  res
    .status(200)
    .json({ status: "success", message: `Comment modified with ID: ${id}` })
})

app.delete("/comments/:id", async (req, res) => {
  const id = parseInt(request.params.id)

  await pool.query("DELETE FROM comments WHERE id = $1", [id])
  res
    .status(200)
    .json({ status: "success", message: `Comment deleted with ID: ${id}` })
})

app.listen(3002, () => {
  console.log(`Server listening`)
})