import "dotenv/config";
import express from "express";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

// データベース接続の準備（Part 4 と同じじゃ）
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter, log: ["query"] });

const app = express();
const PORT = process.env.PORT || 8888;

// EJS を使う設定
app.set("view engine", "ejs");
app.set("views", "./views");
// フォームから送られてきたデータを受け取るための設定
app.use(express.urlencoded({ extended: true }));

// メイン画面：ユーザー一覧を表示する
app.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.render("index", { users });
});

// ユーザー追加処理：フォームから送信された時に動く
app.post("/users", async (req, res) => {
  const name = req.body.name;
  if (name) {
    const newUser = await prisma.user.create({ data: { name } });
    console.log("DBに追加したぞ:", newUser);
  }
  res.redirect("/"); // 追加し終わったらメイン画面に戻る
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
