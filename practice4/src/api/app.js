const express = require("express");
const { nanoid } = require("nanoid");
const app = express();
const port = 3000;

let goods = [
  { 
    id: nanoid(6), 
    name: "фен", 
    category: "Электроника",
    description: "Профессиональный фен с ионизацией, 3 режима скорости",
    price: 400,
    stock: 15
  },
  { 
    id: nanoid(6), 
    name: "отвертка", 
    category: "Инструменты",
    description: "Набор отверток 6в1 с магнитными наконечниками",
    price: 30,
    stock: 42
  },
  { 
    id: nanoid(6), 
    name: "шахматы", 
    category: "Игры",
    description: "Деревянные шахматы, доска 50х50см, фигуры ручной работы",
    price: 140,
    stock: 8
  },
  { 
    id: nanoid(6), 
    name: "ноутбук", 
    category: "Электроника",
    description: "15.6 дюймов, Intel i5, 8GB RAM, 512GB SSD",
    price: 1200,
    stock: 5
  },
  { 
    id: nanoid(6), 
    name: "молоток", 
    category: "Инструменты",
    description: "Слесарный молоток 500г с фиберглассовой рукояткой",
    price: 25,
    stock: 30
  },
  { 
    id: nanoid(6), 
    name: "плед", 
    category: "Дом",
    description: "Мягкий флисовый плед 150х200см, серый",
    price: 60,
    stock: 12
  },
  { 
    id: nanoid(6), 
    name: "наушники", 
    category: "Электроника",
    description: "Беспроводные наушники с шумоподавлением, 20ч работы",
    price: 85,
    stock: 20
  },
  { 
    id: nanoid(6), 
    name: "кружка", 
    category: "Посуда",
    description: "Керамическая кружка 350мл, подарок",
    price: 15,
    stock: 50
  },
  { 
    id: nanoid(6), 
    name: "рюкзак", 
    category: "Сумки",
    description: "Городской рюкзак 25л, водонепроницаемый",
    price: 90,
    stock: 7
  },
  { 
    id: nanoid(6), 
    name: "кроссовки", 
    category: "Обувь",
    description: "Беговые кроссовки, размеры 39-45",
    price: 110,
    stock: 14
  }
];
app.use(express.json());
app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(`[${new Date().toISOString()}] [${req.method}]
    ${res.statusCode} ${req.path}`);
    if (
      req.method === "POST" ||
      req.method === "PUT" ||
      req.method === "PATCH"
    ) {
      console.log("Body:", req.body);
    }
  });
  next();
});
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
function findGoodsItemOr404(id, res) {
  const item = goods.find((u) => u.id === id);
  if (!item) {
    res.status(404).json({ error: "Item not found" });
    return null;
  }
  return item;
}
app.get("/", (req, res) => {
  res.send("Страница товаров");
});

app.post("/api/goods", (req, res) => {
  const { name, category, description, price, stock } = req.body;  // все поля!
  const newGoods = {
    id: nanoid(6),
    name,
    category,
    description,
    price,
    stock,
  };
  goods.push(newGoods);
  res.status(201).json(newGoods);
});
app.get("/api/goods", (req, res) => {
  res.json(goods);
});
app.get("/api/goods/:id", (req, res) => {
  const id = req.params.id;
  const item = findGoodsItemOr404(id, res);
  if (!item) return;
  res.json(item);
});
app.patch("/api/goods/:id", (req, res) => {
  const id = req.params.id;
  const item = findGoodsItemOr404(id, res);
  if (!item) return;
  
  const { name, category, description, price, stock } = req.body;
  
  if (name !== undefined) item.name = name.trim();
  if (category !== undefined) item.category = category.trim();
  if (description !== undefined) item.description = description.trim();
  if (price !== undefined) item.price = Number(price);
  if (stock !== undefined) item.stock = Number(stock);
  
  res.json(item);
});
app.delete("/api/goods/:id", (req, res) => {
  const id = req.params.id;
  const exists = goods.some((u) => u.id === id);
  if (!exists) return res.status(404).json({ error: "Item not found" });

  goods = goods.filter((u) => u.id !== req.params.id);
  res.status(204).send();
});
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});
app.listen(port, () => {
  console.log("Сервер запущен на порту 3000 локального хоста.");
});
