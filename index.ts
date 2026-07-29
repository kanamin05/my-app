import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

// 1. PostgreSQL への接続準備
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter, log: ["query"] });

async function main() {
  console.log("--- データベース操作開始 ---");

  // 2. ユーザーを 1 人作成してみる
  const newUser = await prisma.user.create({
    data: { name: `修行者 ${new Date().toLocaleTimeString()}` },
  });
  console.log("新しいユーザーを登録したぞ:", newUser);

  // 3. 全ユーザーを表示してみる
  const allUsers = await prisma.user.findMany();
  console.log("現在のユーザー一覧:", allUsers);

  console.log("--- 操作完了 ---");
}

main()
  .catch((e) => {
    console.error("エラーが発生したぞ:", e);
    process.exit(1);
  })
  .finally(async () => {
    // 最後にしっかり接続を閉じるのじゃ
    await prisma.$disconnect();
    await pool.end();
  });
