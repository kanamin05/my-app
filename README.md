# Keio Textbook Market

慶應義塾大学の学生向け教科書売買 Web アプリ。  
授業名、担当教員、学部、キャンパスと教科書を結び付けて、学内で受け渡ししやすい売買を想定している。

## 主な機能

- 教科書の出品
- 出品一覧の表示
- 商品詳細ページ
- 出品の編集・削除
- 売却済みへの状態変更
- キーワード検索
- 学部・キャンパス・取引状態での絞り込み
- 価格順・新着順の並び替え
- 慶應メールアドレスでのユーザー登録
- 購入希望の作成
- 取引チャットの表示
- 教科書の必須度メモ表示

## 技術構成

- Frontend: `EJS`, `CSS`, `Vanilla JavaScript`
- Backend: `Express`
- ORM: `Prisma 7`
- Database: `PostgreSQL`
- Runtime: `Node.js`

## データモデル

主要テーブルは以下の4つ。

- `User`
- `Listing`
- `Transaction`
- `Message`

`Listing` では、次のような教科書売買向けの情報を扱う。

- 教科書名
- 価格
- 説明
- 授業名
- 担当教員
- 状態
- 書き込みの有無
- 出品者名
- 受け渡し場所
- キャンパス
- 出品日時
- 取引状態
- 授業での必須度
- 必須度コメント

## ローカル起動

### 1. 依存関係をインストール

```bash
npm install
```

### 2. ローカル DB を起動

```bash
npm run db:dev
```

`Prisma dev` を使ってローカル PostgreSQL を起動する。  
このコマンドは別ターミナルで起動しっぱなしにしておく。

### 3. スキーマ反映と Prisma Client 生成

別ターミナルで:

```bash
npm run db:push
npm run db:generate
```

### 4. アプリ起動

```bash
npm start
```

ブラウザで以下を開く。

```text
http://localhost:8888
```

## 環境変数

このアプリは `DATABASE_URL` を使用する。  
ローカルでは `.env`、Render では Environment Variables に設定する。

例:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
```

## Render でのデプロイ

`Prisma 7` と現在の構成では、migration ファイルが未整備の状態でも動かせるように `db push` 前提でデプロイするのが簡単。

### Build Command

```bash
npm clean-install && npx prisma generate && npx prisma db push
```

### Start Command

```bash
npm start
```

### Environment Variable

```text
DATABASE_URL=Render の Postgres の接続 URL
```

## API

### Users

- `GET /api/users`
- `POST /api/users`

### Listings

- `GET /api/listings`
- `GET /api/listings/:id`
- `POST /api/listings`
- `PUT /api/listings/:id`
- `DELETE /api/listings/:id`
- `PATCH /api/listings/:id/status`

### Transactions

- `GET /api/transactions`
- `POST /api/transactions`

### Messages

- `POST /api/messages`

## 確認ポイント

起動後は次を確認すると全体の動作を見やすい。

- トップページで出品一覧が表示される
- 検索や絞り込みで一覧が変わる
- 新規ユーザー登録ができる
- 新規出品が追加される
- 詳細ページへ遷移できる
- 編集・削除・売却済み更新ができる
- 購入希望を送ると取引が作成される

## 補足

- 起動時に seed データが投入される
- seed には慶應の授業に寄せた講義名・教員名・キャンパス情報を含めている
- Render 上では古い DB を使い回すとスキーマ不整合が起きやすいため、新しい Postgres を使う方が安全
