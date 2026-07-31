# Keio Textbook Market

慶應生向けの教科書売買アプリの試作版。`Express + Prisma + PostgreSQL` の三層構成で、以下を含む。

- `Users`, `Listings`, `Transactions`, `Messages` の4テーブル
- `@keio.jp` 制約つきユーザー登録
- 出品一覧、商品詳細、編集、削除、売却済み更新
- 授業名、教員名、学部、キャンパス、状態による出品検索
- 価格順・新着順の並び替え
- 書き込み有無、学部、空きコマ、受け渡し場所、教科書必須度を含む出品情報
- 取引状況とチャット表示

## 起動

```bash
npm install
npm run db:generate
npm run db:push
npm start
```

`http://localhost:8888` を開く。

## API

- `GET /api/users`
- `POST /api/users`
- `GET /api/listings`
- `GET /api/listings/:id`
- `POST /api/listings`
- `PUT /api/listings/:id`
- `DELETE /api/listings/:id`
- `PATCH /api/listings/:id/status`
- `GET /api/transactions`
- `POST /api/transactions`
- `POST /api/messages`
