const express = require("express");
const { nanoid } = require("nanoid");
const app = express();
const port = 3000;
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
let users = [];
let goods = [
  // Массив данных для выдачи
  {
    id: nanoid(6),
    name: "фен",
    category: "Электроника",
    description: "Профессиональный фен с ионизацией, 3 режима скорости",
    price: 400,
    stock: 15,
    imageUrl:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fresizer.mail.ru%2Fp%2Ff7dbf9d0-9cad-52d5-8b20-d781ff94eed0%2Fdpr%3A200%2FAQAKnVH6jzwBg8vAku3M8x6FeMJWePfffIknABV7JwCe1HYQq8gAWlXnQyyLxoRumnvrNI_atyPEB7nN0MrLWVv7UJ8.png&f=1&nofb=1&ipt=ca03c8ec7afdda8947ef7b3647d949090320e6d6c45f567fbe41d5a16d6a31c4",
  },
  {
    id: nanoid(6),
    name: "отвертка",
    category: "Инструменты",
    description: "Набор отверток 6в1 с магнитными наконечниками",
    price: 30,
    stock: 42,
    imageUrl:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fsmistroy.ru%2Fimages%2Fnews%2F1386205699remes1.jpg&f=1&nofb=1&ipt=8b2a48b4ad5eabe409706cd01832d16b3bcee7dcd9970c0374e6ed76f1ec0886",
  },
  {
    id: nanoid(6),
    name: "шахматы",
    category: "Игры",
    description: "Деревянные шахматы, доска 50х50см, фигуры ручной работы",
    price: 140,
    stock: 8,
    imageUrl:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Famiel.club%2Fuploads%2Fposts%2F2022-03%2F1647749838_65-amiel-club-p-kartinki-s-shakhmatami-70.jpg&f=1&nofb=1&ipt=6bcce582c5d0e67ee8eb2a170f304ef861f8306db0c5da50d12dd42bfd55bd82",
  },
  {
    id: nanoid(6),
    name: "ноутбук",
    category: "Электроника",
    description: "15.6 дюймов, Intel i5, 8GB RAM, 512GB SSD",
    price: 1200,
    stock: 5,
    imageUrl:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ffikiwiki.com%2Fuploads%2Fposts%2F2022-02%2F1644973544_5-fikiwiki-com-p-kartinki-noutbuki-5.jpg&f=1&nofb=1&ipt=86577a4e2b71be2cd7dd19dc68227fa0e2e2eabcdaa0dd7c7495d2a316a6458e",
  },
  {
    id: nanoid(6),
    name: "молоток",
    category: "Инструменты",
    description: "Слесарный молоток 500г с фиберглассовой рукояткой",
    price: 25,
    stock: 30,
    imageUrl:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fthumbs.dreamstime.com%2Fb%2F%25D0%25BC%25D0%25BE%25D0%25BB%25D0%25BE%25D1%2582%25D0%25BE%25D0%25BA-26813535.jpg&f=1&nofb=1&ipt=d492c1396af5fa0956496ece2d73f9bad28a3473f997c5adf42e928b12cd08be",
  },
  {
    id: nanoid(6),
    name: "плед",
    category: "Дом",
    description: "Мягкий флисовый плед 150х200см, серый",
    price: 60,
    stock: 12,
    imageUrl:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fir.ozone.ru%2Fs3%2Fmultimedia-1-9%2Fc1000%2F7043761485.jpg&f=1&nofb=1&ipt=14fb5e6e6ba76b32a900e90bb504eb0c52e16fe5de3834171eb53ce89272590b",
  },
  {
    id: nanoid(6),
    name: "наушники",
    category: "Электроника",
    description: "Беспроводные наушники с шумоподавлением, 20ч работы",
    price: 85,
    stock: 20,
    imageUrl:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.comfy.ua%2Fmedia%2Fcatalog%2Fproduct%2Fa%2Fk%2Fakeneo_gbjmlp-optimized_original.jpg&f=1&nofb=1&ipt=07bb538ad973c40fbbf5bcfab78167d7b70b4bdc7cf562821f8c9c878225dfea",
  },
  {
    id: nanoid(6),
    name: "кружка",
    category: "Посуда",
    description: "Керамическая кружка 350мл, подарок",
    price: 15,
    stock: 50,
    imageUrl:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.freepik.com%2Fpremium-vector%2Fwhite-mug-isolated-white-background-top-view-vector-mock-up_212036-322.jpg%3Fw%3D1380&f=1&nofb=1&ipt=d7ef0872686fc0990489f05ddfc5d2f1d4e728a225f808d839726598b79ce9e0",
  },
  {
    id: nanoid(6),
    name: "рюкзак",
    category: "Сумки",
    description: "Городской рюкзак 25л, водонепроницаемый",
    price: 90,
    stock: 7,
    imageUrl:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcs2.livemaster.ru%2Fstorage%2Fb1%2Fc8%2F160a67204a87a45636ae1d62ca82--sumki-i-aksessuary-muzhskoj-ryukzak-kozhanyj-dazzler-temno-ko.jpg&f=1&nofb=1&ipt=dafbb4f8ea6192e47437020e32d6f06e125c0e2b96729b12bdc4e05b27e87030",
  },
  {
    id: nanoid(6),
    name: "кроссовки",
    category: "Обувь",
    description: "Беговые кроссовки, размеры 39-45",
    price: 110,
    stock: 14,
    imageUrl:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%2Fid%2FOIP.JAshWHUeDtEbuKrOiaho7QHaEy%3Fpid%3DApi&f=1&ipt=4005afef4dcacf0f39b1c6ef1c1fb2e57a0d2d6f470709ea0b9a926b645fe26c",
  },
]; //добавление сваггера
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API управления товарами",
      version: "1.0.0",
      description: "API для управления списком товаров",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: "Локальный сервер",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./app.js"],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * components:
 *   schemas:
 *     Good:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - price
 *         - stock
 *       properties:
 *         id:
 *           type: string
 *           description: Уникальный ID товара
 *         name:
 *           type: string
 *           description: Название товара
 *         category:
 *           type: string
 *           description: Категория товара
 *         description:
 *           type: string
 *           description: Описание товара
 *         price:
 *           type: number
 *           description: Цена товара
 *         stock:
 *           type: integer
 *           description: Количество на складе
 *       example:
 *         id: "abc123"
 *         name: "фен"
 *         category: "Электроника"
 *         description: "Профессиональный фен"
 *         price: 400
 *         stock: 15
 */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
app.use(express.json()); //мидлвейр(логгеры, джсон конвертеры)
function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";

  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      error: "Missing or invalid Authorization header",
    });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({
      error: "Invalid or expired token",
    });
  }
}
const JWT_SECRET = "access_secret";
const ACCESS_EXPIRES_IN = "15m";

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

app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
function findGoodsItemOr404(id, res) {
  //функция для проверки наличия предмета
  const item = goods.find((u) => u.id === id);
  if (!item) {
    res.status(404).json({ error: "Item not found" });
    return null;
  }
  return item;
}
/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Получить информацию о текущем пользователе
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Информация о пользователе
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *       401:
 *         description: Отсутствует или невалидный токен
 *       404:
 *         description: Пользователь не найден
 */
app.get("/api/auth/me", authMiddleware, (req, res) => { // эндпоинт возврата профиля 
  const userId = req.user.sub;
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({
      error: "User not found",
    });
  }

  res.json({
    id: user.id,
    username: user.username,
  });
});
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "ivan123"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "secret123"
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "1"
 *                 username:
 *                   type: string
 *                   example: "ivan123"
 *       400:
 *         description: Не указаны username или password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "username and password are required"
 */
app.post("/api/auth/register", async (req, res) => { // эндпоинт регистрации 
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      error: "username and password are required",
    });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: String(users.length + 1),
    username,
    passwordHash,
  };
  users.push(user);
  res.status(201).json({
    id: user.id,
    username: user.username,
  });
});
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Вход в систему
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "ivan123"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "secret123"
 *     responses:
 *       200:
 *         description: Успешный вход, возвращается JWT токен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Не указаны username или password
 *       401:
 *         description: Неверные учетные данные
 */
app.post("/api/auth/login", async (req, res) => { //эндпоинт аутентификации 
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      error: "username and password are required",
    });
  }
  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(401).json({
      error: "Invalid credentials",
    });
  }
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({
      error: "Invalid credentials",
    });
  }
  // Создание access-токена
  const accessToken = jwt.sign(
    {
      sub: user.id,
      username: user.username,
    },
    JWT_SECRET,
    {
      expiresIn: ACCESS_EXPIRES_IN,
    },
  );
  res.json({
    accessToken,
  });
});

app.get("/", (req, res) => {
  // эндпоинт по адресу /
  res.send("Страница товаров");
});
/**
 * @swagger
 * /api/goods:
 *   post:
 *     summary: Создает новый товар
 *     tags: [Товары]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Товар успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Good'
 *       400:
 *         description: Ошибка в теле запроса
 */
app.post("/api/goods", (req, res) => {
  //пост эндпоинт по адресу /api/goods
  const { name, category, description, price, stock, imageUrl } = req.body;
  if (
    !name ||
    !category ||
    price === undefined ||
    stock === undefined ||
    description === undefined ||
    imageUrl === undefined
  ) {
    return res.status(400).json({
      error:
        "Имя, категория, цена, фотография, описание и наличие являются необходимыми.",
    });
  }
  const newGoods = {
    id: nanoid(6),
    name,
    category,
    description,
    price,
    stock,
    imageUrl,
  };
  goods.push(newGoods);
  res.status(201).json(newGoods);
});
/**
 * @swagger
 * /api/goods:
 *   get:
 *     summary: Возвращает список всех товаров
 *     tags: [Товары]
 *     responses:
 *       200:
 *         description: Список товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Good'
 */
app.get("/api/goods", (req, res) => {
  //гет эндпоинт по адресу /api/goods
  res.json(goods);
});
/**
 * @swagger
 * /api/goods/{id}:
 *   get:
 *     summary: Получить товар по ID
 *     description: Возвращает один товар по его уникальному идентификатору
 *     tags: [Товары]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID товара
 *         example: "abc123"
 *     responses:
 *       200:
 *         description: Товар найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Good'
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Item not found"
 */
app.get("/api/goods/:id", (req, res) => {
  //гет эндпоинт по адресу /api/goods (конкетный товар)
  const id = req.params.id;
  const item = findGoodsItemOr404(id, res);
  if (!item) return;
  res.json(item);
});
/**
 * @swagger
 * /api/goods/{id}:
 *   patch:
 *     summary: Обновить товар
 *     description: Обновляет одно или несколько полей существующего товара
 *     tags: [Товары]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID товара
 *         example: "abc123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Новое название
 *                 example: "фен профессиональный"
 *               category:
 *                 type: string
 *                 description: Новая категория
 *                 example: "Бытовая техника"
 *               description:
 *                 type: string
 *                 description: Новое описание
 *                 example: "Мощный фен для салонов красоты"
 *               price:
 *                 type: number
 *                 description: Новая цена
 *                 example: 450
 *               stock:
 *                 type: integer
 *                 description: Новое количество на складе
 *                 example: 10
 *     responses:
 *       200:
 *         description: Товар успешно обновлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Good'
 *       400:
 *         description: Нет данных для обновления
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Nothing to update"
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Item not found"
 */
app.patch("/api/goods/:id", (req, res) => {
  //обновление эндпоинт по адресу /api/goods (конкетный товар)
  const id = req.params.id;
  const item = findGoodsItemOr404(id, res);
  if (!item) return;
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Nothing to update" });
  }

  const { name, category, description, price, stock, imageUrl } = req.body;

  if (name !== undefined) item.name = name.trim();
  if (category !== undefined) item.category = category.trim();
  if (description !== undefined) item.description = description.trim();
  if (price !== undefined) item.price = Number(price);
  if (stock !== undefined) item.stock = Number(stock);
  if (imageUrl !== undefined) item.imageUrl = imageUrl;

  res.json(item);
});
/**
 * @swagger
 * /api/goods/{id}:
 *   delete:
 *     summary: Удалить товар
 *     description: Удаляет товар по ID
 *     tags: [Товары]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID товара
 *         example: "abc123"
 *     responses:
 *       204:
 *         description: Товар успешно удален (нет содержимого)
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Item not found"
 */
app.delete("/api/goods/:id", (req, res) => {
  //удаление эндпоинт по адресу /api/goods (конкетный товар)
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
  // обработчик ошибок
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});
app.listen(port, () => {
  console.log("Сервер запущен на порту 3000 локального хоста.");
});
