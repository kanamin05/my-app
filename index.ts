import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as PrismaModule from "./generated/prisma/client";

const { PrismaClient, ListingCondition, MarkingType, TransactionStatus } = PrismaModule;
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set.");
}

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter }) as any;
const app = express();
const PORT = Number(process.env.PORT || 8888);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const listingConditions = Object.values(ListingCondition);
const markingTypes = Object.values(MarkingType);
const transactionStatuses = Object.values(TransactionStatus);
const sortOptions = [
  { value: "newest", label: "新着順" },
  { value: "price_asc", label: "価格が安い順" },
  { value: "price_desc", label: "価格が高い順" },
];

const seedUsers = [
  {
    name: "佐藤 花",
    email: "hana.sato@keio.jp",
    faculty: "商学部",
    campus: "日吉",
    freePeriods: "月3, 火4, 木2",
  },
  {
    name: "田中 湊",
    email: "minato.tanaka@keio.jp",
    faculty: "理工学部",
    campus: "矢上",
    freePeriods: "水2, 木3, 金4",
  },
  {
    name: "高橋 凛",
    email: "rin.takahashi@keio.jp",
    faculty: "経済学部",
    campus: "三田",
    freePeriods: "月5, 水3, 金2",
  },
  {
    name: "山口 碧",
    email: "aoi.yamaguchi@keio.jp",
    faculty: "法学部",
    campus: "三田",
    freePeriods: "火3, 木4, 金3",
  },
  {
    name: "小林 悠真",
    email: "yuma.kobayashi@keio.jp",
    faculty: "理工学部",
    campus: "矢上",
    freePeriods: "月2, 水4, 金5",
  },
  {
    name: "中島 芽衣",
    email: "mei.nakashima@keio.jp",
    faculty: "文学部",
    campus: "三田",
    freePeriods: "火2, 水5, 木3",
  },
  {
    name: "藤井 蒼",
    email: "ao.fujii@keio.jp",
    faculty: "経済学部",
    campus: "日吉",
    freePeriods: "月4, 火5, 木2",
  },
  {
    name: "清水 結衣",
    email: "yui.shimizu@keio.jp",
    faculty: "商学部",
    campus: "三田",
    freePeriods: "水2, 木5, 金2",
  },
  {
    name: "森 大地",
    email: "daichi.mori@keio.jp",
    faculty: "理工学部",
    campus: "矢上",
    freePeriods: "火4, 木3, 金1",
  },
  {
    name: "岡田 紬",
    email: "tsumugi.okada@keio.jp",
    faculty: "環境情報学部",
    campus: "湘南藤沢",
    freePeriods: "月3, 水1, 金4",
  },
  {
    name: "井上 陽菜",
    email: "hina.inoue@keio.jp",
    faculty: "総合政策学部",
    campus: "湘南藤沢",
    freePeriods: "火1, 木2, 金3",
  },
  {
    name: "石田 陸",
    email: "riku.ishida@keio.jp",
    faculty: "法学部",
    campus: "日吉",
    freePeriods: "月1, 水3, 木5",
  },
  {
    name: "松本 彩音",
    email: "ayane.matsumoto@keio.jp",
    faculty: "看護医療学部",
    campus: "信濃町",
    freePeriods: "火5, 木1, 金4",
  },
  {
    name: "西村 颯太",
    email: "sota.nishimura@keio.jp",
    faculty: "薬学部",
    campus: "芝共立",
    freePeriods: "月5, 水2, 金2",
  },
];

const seedListings = [
  {
    title: "ミクロ経済学入門",
    courseName: "ミクロ経済学A",
    instructorName: "伊藤教授",
    description: "カバーあり。重要箇所に鉛筆で薄い書き込みあり。",
    price: 1800,
    condition: ListingCondition.GOOD,
    markingType: MarkingType.PENCIL,
    sellerEmail: "rin.takahashi@keio.jp",
    meetingPlace: "三田キャンパス南館前",
    campus: "三田",
    requiredLevel: 5,
    requiredComment: "毎週の講義で頻繁に参照。期末対策でも必須だった。",
  },
  {
    title: "線形代数キャンパス・ゼミ",
    courseName: "線形代数1",
    instructorName: "中村教授",
    description: "書き込みなし。数回だけ使用。",
    price: 2200,
    condition: ListingCondition.GOOD,
    markingType: MarkingType.NONE,
    sellerEmail: "minato.tanaka@keio.jp",
    meetingPlace: "矢上キャンパス食堂前",
    campus: "矢上",
    requiredLevel: 2,
    requiredComment: "演習プリント中心で、教科書は参照程度だった。",
  },
  {
    title: "統計学入門",
    courseName: "統計学Ⅰ",
    instructorName: "赤林 由雄",
    description: "授業で扱った章に付箋あり。表紙に少し使用感あり。",
    price: 1600,
    condition: ListingCondition.FAIR,
    markingType: MarkingType.PENCIL,
    sellerEmail: "ao.fujii@keio.jp",
    meetingPlace: "日吉キャンパス来往舎前",
    campus: "日吉",
    requiredLevel: 5,
    requiredComment: "講義と演習の両方でかなり使った。試験前にも役立つ。",
  },
  {
    title: "Bayesian Data Analysis",
    courseName: "ベイズ統計学ａ",
    instructorName: "星野 崇宏",
    description: "英語版。数式メモが数ページだけあるが全体的にきれい。",
    price: 3400,
    condition: ListingCondition.GOOD,
    markingType: MarkingType.PENCIL,
    sellerEmail: "yui.shimizu@keio.jp",
    meetingPlace: "三田キャンパス図書館前",
    campus: "三田",
    requiredLevel: 4,
    requiredComment: "毎回の講義資料とあわせて使うと理解しやすかった。",
  },
  {
    title: "環境経済学をつかむ",
    courseName: "環境経済論ａ",
    instructorName: "阿部 景太",
    description: "書き込みなし。レポート課題に役立つ章へ付箋だけあり。",
    price: 1900,
    condition: ListingCondition.GOOD,
    markingType: MarkingType.NONE,
    sellerEmail: "hana.sato@keio.jp",
    meetingPlace: "三田キャンパス西校舎前",
    campus: "三田",
    requiredLevel: 3,
    requiredComment: "授業スライド中心だが、参考書として持っておくと安心。",
  },
  {
    title: "コンピュータアーキテクチャの基礎",
    courseName: "計算機基礎",
    instructorName: "松谷 宏紀",
    description: "演習で使った箇所に鉛筆の書き込みあり。カバー付き。",
    price: 2500,
    condition: ListingCondition.GOOD,
    markingType: MarkingType.PENCIL,
    sellerEmail: "daichi.mori@keio.jp",
    meetingPlace: "矢上キャンパス厚生棟前",
    campus: "矢上",
    requiredLevel: 4,
    requiredComment: "演習問題を解くときに便利で、試験前も見返した。",
  },
  {
    title: "確率論講義",
    courseName: "確率[DS1]",
    instructorName: "担当者は公開ページ参照",
    description: "確率分布の章にだけペンで少量のメモあり。",
    price: 2100,
    condition: ListingCondition.FAIR,
    markingType: MarkingType.PEN,
    sellerEmail: "tsumugi.okada@keio.jp",
    meetingPlace: "SFC Ω館前",
    campus: "湘南藤沢",
    requiredLevel: 4,
    requiredComment: "講義資料だけでも進むが、体系的に復習するには本が便利。",
  },
  {
    title: "Statistics for the Humanities",
    courseName: "教養のための確率・統計入門",
    instructorName: "バナ， ゲルゲイ I.",
    description: "英語授業向け。状態良好、ハイライトなし。",
    price: 2800,
    condition: ListingCondition.GOOD,
    markingType: MarkingType.NONE,
    sellerEmail: "mei.nakashima@keio.jp",
    meetingPlace: "三田キャンパス北館前",
    campus: "三田",
    requiredLevel: 3,
    requiredComment: "教科書必須ではないが、英語での説明補強にかなり助かった。",
  },
  {
    title: "Mostly Harmless Econometrics",
    courseName: "計量経済学各論（入門：分析手法の仕組みと解釈）",
    instructorName: "山本 勲",
    description: "オンライン授業の補助で使用。端に鉛筆メモが少し。",
    price: 3000,
    condition: ListingCondition.GOOD,
    markingType: MarkingType.PENCIL,
    sellerEmail: "hana.sato@keio.jp",
    meetingPlace: "三田キャンパス研究室棟入口",
    campus: "三田",
    requiredLevel: 4,
    requiredComment: "講義内容の背景理解にかなり効いた。数式に抵抗がなければおすすめ。",
  },
  {
    title: "マクロ経済学 第3版",
    courseName: "マクロ経済学A",
    instructorName: "公開シラバスに準拠した想定データ",
    description: "授業で頻出の章に付箋あり。本文への書き込みはほぼなし。",
    price: 1700,
    condition: ListingCondition.GOOD,
    markingType: MarkingType.NONE,
    sellerEmail: "rin.takahashi@keio.jp",
    meetingPlace: "三田キャンパス東館前",
    campus: "三田",
    requiredLevel: 4,
    requiredComment: "講義資料だけでも追えるが、モデル整理に本が役立った。",
  },
  {
    title: "民法総則",
    courseName: "民法総則",
    instructorName: "公開シラバスに準拠した想定データ",
    description: "六法参照の書き込みあり。カバーに少し折れ。",
    price: 1500,
    condition: ListingCondition.FAIR,
    markingType: MarkingType.BOTH,
    sellerEmail: "aoi.yamaguchi@keio.jp",
    meetingPlace: "三田キャンパス南校舎前",
    campus: "三田",
    requiredLevel: 5,
    requiredComment: "条文と判例の対応を整理するのにかなり使った。",
  },
  {
    title: "フランス文学概説",
    courseName: "フランス文学研究入門",
    instructorName: "公開シラバスに準拠した想定データ",
    description: "マーカーなし。購入後ほとんど使わず保管していた。",
    price: 1200,
    condition: ListingCondition.GOOD,
    markingType: MarkingType.NONE,
    sellerEmail: "mei.nakashima@keio.jp",
    meetingPlace: "三田キャンパスメディアセンター前",
    campus: "三田",
    requiredLevel: 2,
    requiredComment: "授業では配布資料中心で、なくても何とかなる回が多かった。",
  },
  {
    title: "Pythonではじめるデータサイエンス",
    courseName: "データサイエンス基礎",
    instructorName: "公開シラバスに準拠した想定データ",
    description: "演習コードのメモが少し。比較的きれい。",
    price: 2300,
    condition: ListingCondition.GOOD,
    markingType: MarkingType.PENCIL,
    sellerEmail: "hina.inoue@keio.jp",
    meetingPlace: "SFC メディアセンター入口",
    campus: "湘南藤沢",
    requiredLevel: 4,
    requiredComment: "演習の進みが速いので、手元にあるとかなり楽だった。",
  },
];

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

function assertKeioEmail(email: string) {
  return email.toLowerCase().endsWith("@keio.jp");
}

function isListingCondition(value: unknown): value is string {
  return typeof value === "string" && listingConditions.includes(value as never);
}

function isMarkingType(value: unknown): value is string {
  return typeof value === "string" && markingTypes.includes(value as never);
}

function isTransactionStatus(value: unknown): value is string {
  return typeof value === "string" && transactionStatuses.includes(value as never);
}

function parsePositiveInt(value: unknown) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : null;
}

function buildListingPayload(body: Record<string, unknown>, seller: { id: number; name: string; campus: string }) {
  const price = parsePositiveInt(body.price);
  const requiredLevel = parsePositiveInt(body.requiredLevel);

  if (!body.title || !body.courseName || !body.instructorName || !body.description || price === null || !body.condition || !body.markingType || !body.meetingPlace) {
    return { error: "出品に必要な項目が不足しています。" };
  }

  if (!isListingCondition(body.condition)) {
    return { error: "condition の値が不正です。" };
  }

  if (!isMarkingType(body.markingType)) {
    return { error: "markingType の値が不正です。" };
  }

  return {
    data: {
      title: String(body.title),
      price,
      description: String(body.description),
      courseName: String(body.courseName),
      instructorName: String(body.instructorName),
      condition: body.condition,
      markingType: body.markingType,
      sellerName: seller.name,
      meetingPlace: String(body.meetingPlace),
      campus: typeof body.campus === "string" && body.campus.trim() ? body.campus : seller.campus,
      requiredLevel: requiredLevel ?? 3,
      requiredComment: typeof body.requiredComment === "string" ? body.requiredComment : "",
      sellerId: seller.id,
    },
  };
}

function buildListingWhere(query: Record<string, unknown>) {
  const q = typeof query.q === "string" ? query.q.trim() : "";
  const courseName = typeof query.courseName === "string" ? query.courseName.trim() : "";
  const instructorName = typeof query.instructorName === "string" ? query.instructorName.trim() : "";
  const status = typeof query.status === "string" ? query.status : "";
  const faculty = typeof query.faculty === "string" ? query.faculty.trim() : "";
  const campus = typeof query.campus === "string" ? query.campus.trim() : "";

  return {
    AND: [
      q
        ? {
            OR: [
              { title: { contains: q } },
              { description: { contains: q } },
              { courseName: { contains: q } },
            ],
          }
        : {},
      courseName ? { courseName: { contains: courseName } } : {},
      instructorName ? { instructorName: { contains: instructorName } } : {},
      isTransactionStatus(status) ? { status } : {},
      campus ? { campus: { contains: campus } } : {},
      faculty ? { seller: { faculty: { contains: faculty } } } : {},
    ],
  };
}

function buildListingOrderBy(sort: unknown) {
  if (sort === "price_asc") {
    return { price: "asc" };
  }
  if (sort === "price_desc") {
    return { price: "desc" };
  }
  return { createdAt: "desc" };
}

async function fetchListings(query: Record<string, unknown> = {}) {
  const sort = typeof query.sort === "string" ? query.sort : "newest";

  return prisma.listing.findMany({
    where: buildListingWhere(query),
    include: { seller: true },
    orderBy: buildListingOrderBy(sort),
  });
}

async function seedDatabase() {
  for (const user of seedUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        faculty: user.faculty,
        campus: user.campus,
        freePeriods: user.freePeriods,
      },
      create: user,
    });
  }

  for (const listing of seedListings) {
    const seller = await prisma.user.findUniqueOrThrow({
      where: { email: listing.sellerEmail },
    });

    const existingListing = await prisma.listing.findFirst({
      where: {
        title: listing.title,
        courseName: listing.courseName,
        sellerId: seller.id,
      },
    });

    if (!existingListing) {
      await prisma.listing.create({
        data: {
          title: listing.title,
          price: listing.price,
          description: listing.description,
          courseName: listing.courseName,
          instructorName: listing.instructorName,
          condition: listing.condition,
          markingType: listing.markingType,
          sellerName: seller.name,
          meetingPlace: listing.meetingPlace,
          campus: listing.campus,
          requiredLevel: listing.requiredLevel,
          requiredComment: listing.requiredComment,
          sellerId: seller.id,
        },
      });
    }
  }

  const listing = await prisma.listing.findFirstOrThrow({
    where: { title: "ミクロ経済学入門" },
  });
  const buyer = await prisma.user.findUniqueOrThrow({
    where: { email: "hana.sato@keio.jp" },
  });

  const existingTransaction = await prisma.transaction.findFirst({
    where: {
      listingId: listing.id,
      buyerId: buyer.id,
    },
  });

  if (!existingTransaction) {
    const transaction = await prisma.transaction.create({
      data: {
        listingId: listing.id,
        buyerId: buyer.id,
        sellerId: listing.sellerId,
        status: TransactionStatus.RESERVED,
        meetingPlan: "木曜2限後に三田キャンパス南館前で受け渡し予定",
      },
    });

    await prisma.listing.update({
      where: { id: listing.id },
      data: { status: TransactionStatus.RESERVED },
    });

    await prisma.message.createMany({
      data: [
        {
          transactionId: transaction.id,
          senderId: buyer.id,
          body: "購入希望です。木曜2限後は空いていますか？",
        },
        {
          transactionId: transaction.id,
          senderId: listing.sellerId,
          body: "空いています。南館前なら受け渡ししやすいです。",
        },
      ],
    });
  }
}

app.get("/", async (req, res) => {
  const [users, listings, transactions] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "asc" } }),
    fetchListings(req.query),
    prisma.transaction.findMany({
      include: {
        listing: true,
        buyer: true,
        seller: true,
        messages: {
          include: { sender: true },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  const faculties = Array.from(new Set(users.map((user: any) => user.faculty)));
  const campuses = Array.from(new Set(users.map((user: any) => user.campus)));

  res.render("index", {
    users,
    listings,
    transactions,
    listingConditions,
    markingTypes,
    transactionStatuses,
    sortOptions,
    faculties,
    campuses,
    filters: {
      q: typeof req.query.q === "string" ? req.query.q : "",
      courseName: typeof req.query.courseName === "string" ? req.query.courseName : "",
      instructorName: typeof req.query.instructorName === "string" ? req.query.instructorName : "",
      status: typeof req.query.status === "string" ? req.query.status : "",
      faculty: typeof req.query.faculty === "string" ? req.query.faculty : "",
      campus: typeof req.query.campus === "string" ? req.query.campus : "",
      sort: typeof req.query.sort === "string" ? req.query.sort : "newest",
    },
  });
});

app.get("/listings/:id", async (req, res) => {
  const listingId = Number(req.params.id);

  if (!Number.isInteger(listingId)) {
    res.status(400).send("Invalid listing id");
    return;
  }

  const [listing, users] = await Promise.all([
    prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        seller: true,
        transactions: {
          include: {
            buyer: true,
            messages: {
              include: { sender: true },
              orderBy: { createdAt: "asc" },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    prisma.user.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!listing) {
    res.status(404).send("Listing not found");
    return;
  }

  res.render("listing-detail", {
    listing,
    users,
    listingConditions,
    markingTypes,
    transactionStatuses,
  });
});

app.get("/api/users", async (_req, res) => {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });
  res.json(users);
});

app.post("/api/users", async (req, res) => {
  const { name, email, faculty, campus, freePeriods } = req.body;

  if (!name || !email || !faculty || !campus || !freePeriods) {
    res.status(400).json({ error: "name, email, faculty, campus, freePeriods は必須です。" });
    return;
  }

  if (!assertKeioEmail(String(email))) {
    res.status(400).json({ error: "@keio.jp のメールアドレスのみ登録できます。" });
    return;
  }

  try {
    const user = await prisma.user.create({
      data: {
        name: String(name),
        email: String(email).toLowerCase(),
        faculty: String(faculty),
        campus: String(campus),
        freePeriods: String(freePeriods),
      },
    });

    res.status(201).json(user);
  } catch {
    res.status(409).json({ error: "同じメールアドレスのユーザーが既に存在します。" });
  }
});

app.get("/api/listings", async (req, res) => {
  const listings = await fetchListings(req.query);
  res.json(listings);
});

app.get("/api/listings/:id", async (req, res) => {
  const listing = await prisma.listing.findUnique({
    where: { id: Number(req.params.id) },
    include: {
      seller: true,
      transactions: {
        include: {
          buyer: true,
          messages: {
            include: { sender: true },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!listing) {
    res.status(404).json({ error: "出品が見つかりません。" });
    return;
  }

  res.json(listing);
});

app.post("/api/listings", async (req, res) => {
  const seller = await prisma.user.findUnique({ where: { id: Number(req.body.sellerId) } });
  if (!seller) {
    res.status(404).json({ error: "sellerId に対応するユーザーが見つかりません。" });
    return;
  }

  const payload = buildListingPayload(req.body, seller);
  if ("error" in payload) {
    res.status(400).json(payload);
    return;
  }

  const listing = await prisma.listing.create({
    data: payload.data,
    include: { seller: true },
  });

  res.status(201).json(listing);
});

app.put("/api/listings/:id", async (req, res) => {
  const current = await prisma.listing.findUnique({
    where: { id: Number(req.params.id) },
    include: { seller: true },
  });

  if (!current) {
    res.status(404).json({ error: "更新対象の出品が見つかりません。" });
    return;
  }

  const sellerId = Number(req.body.sellerId || current.sellerId);
  const seller = await prisma.user.findUnique({ where: { id: sellerId } });
  if (!seller) {
    res.status(404).json({ error: "sellerId に対応するユーザーが見つかりません。" });
    return;
  }

  const payload = buildListingPayload({ ...current, ...req.body, sellerId }, seller);
  if ("error" in payload) {
    res.status(400).json(payload);
    return;
  }

  const nextStatus = req.body.status;
  if (nextStatus && !isTransactionStatus(nextStatus)) {
    res.status(400).json({ error: "status の値が不正です。" });
    return;
  }

  const listing = await prisma.listing.update({
    where: { id: current.id },
    data: {
      ...payload.data,
      status: isTransactionStatus(nextStatus) ? nextStatus : current.status,
    },
    include: { seller: true },
  });

  res.json(listing);
});

app.delete("/api/listings/:id", async (req, res) => {
  const listingId = Number(req.params.id);
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: { transactions: true },
  });

  if (!listing) {
    res.status(404).json({ error: "削除対象の出品が見つかりません。" });
    return;
  }

  const transactionIds = listing.transactions.map((transaction: any) => transaction.id);
  if (transactionIds.length > 0) {
    await prisma.message.deleteMany({
      where: { transactionId: { in: transactionIds } },
    });
    await prisma.transaction.deleteMany({
      where: { id: { in: transactionIds } },
    });
  }

  await prisma.listing.delete({ where: { id: listingId } });
  res.status(204).send();
});

app.patch("/api/listings/:id/status", async (req, res) => {
  const status = req.body.status;
  if (!isTransactionStatus(status)) {
    res.status(400).json({ error: "status の値が不正です。" });
    return;
  }

  const listing = await prisma.listing.update({
    where: { id: Number(req.params.id) },
    data: { status },
    include: { seller: true },
  });

  await prisma.transaction.updateMany({
    where: { listingId: listing.id },
    data: { status },
  });

  res.json(listing);
});

app.get("/api/transactions", async (_req, res) => {
  const transactions = await prisma.transaction.findMany({
    include: {
      listing: true,
      buyer: true,
      seller: true,
      messages: {
        include: { sender: true },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
  res.json(transactions);
});

app.post("/api/transactions", async (req, res) => {
  const { listingId, buyerId, meetingPlan } = req.body;

  if (!listingId || !buyerId || !meetingPlan) {
    res.status(400).json({ error: "listingId, buyerId, meetingPlan は必須です。" });
    return;
  }

  const listing = await prisma.listing.findUnique({ where: { id: Number(listingId) } });
  if (!listing) {
    res.status(404).json({ error: "指定された listing が存在しません。" });
    return;
  }

  if (listing.status !== TransactionStatus.OPEN) {
    res.status(409).json({ error: "この出品は既に取引中です。" });
    return;
  }

  const buyer = await prisma.user.findUnique({ where: { id: Number(buyerId) } });
  if (!buyer) {
    res.status(404).json({ error: "指定された buyer が存在しません。" });
    return;
  }

  const transaction = await prisma.transaction.create({
    data: {
      listingId: listing.id,
      buyerId: buyer.id,
      sellerId: listing.sellerId,
      status: TransactionStatus.RESERVED,
      meetingPlan: String(meetingPlan),
    },
    include: {
      listing: true,
      buyer: true,
      seller: true,
    },
  });

  await prisma.listing.update({
    where: { id: listing.id },
    data: { status: TransactionStatus.RESERVED },
  });

  res.status(201).json(transaction);
});

app.post("/api/messages", async (req, res) => {
  const { transactionId, senderId, body } = req.body;

  if (!transactionId || !senderId || !body) {
    res.status(400).json({ error: "transactionId, senderId, body は必須です。" });
    return;
  }

  const message = await prisma.message.create({
    data: {
      transactionId: Number(transactionId),
      senderId: Number(senderId),
      body: String(body),
    },
    include: { sender: true },
  });

  await prisma.transaction.update({
    where: { id: Number(transactionId) },
    data: { updatedAt: new Date() },
  });

  res.status(201).json(message);
});

seedDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
