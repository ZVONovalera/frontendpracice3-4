const express = require("express");
const { nanoid } = require("nanoid");
const app = express();
const port = 3000;
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');
app.use(express.json());


// ========== КОНСТАНТЫ ==========
const JWT_SECRET = "access_secret";
const REFRESH_SECRET = "refresh_secret";
const ACCESS_EXPIRES_IN = "15m";
const REFRESH_EXPIRES_IN = "7d";

// Роли пользователей
const ROLES = {
  USER: 'user',
  SELLER: 'seller',
  ADMIN: 'admin'
};

// ========== ХРАНИЛИЩА ==========
let users = [];
let refreshTokens = new Set();
let goods = [
  {
    id: nanoid(6),
    name: "фен",
    category: "Электроника",
    description: "Профессиональный фен с ионизацией, 3 режима скорости",
    price: 400,
    stock: 15,
    imageUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fresizer.mail.ru%2Fp%2Ff7dbf9d0-9cad-52d5-8b20-d781ff94eed0%2Fdpr%3A200%2FAQAKnVH6jzwBg8vAku3M8x6FeMJWePfffIknABV7JwCe1HYQq8gAWlXnQyyLxoRumnvrNI_atyPEB7nN0MrLWVv7UJ8.png&f=1&nofb=1&ipt=ca03c8ec7afdda8947ef7b3647d949090320e6d6c45f567fbe41d5a16d6a31c4",
  },
  {
    id: nanoid(6),
    name: "отвертка",
    category: "Инструменты",
    description: "Набор отверток 6в1 с магнитными наконечниками",
    price: 30,
    stock: 42,
    imageUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fsmistroy.ru%2Fimages%2Fnews%2F1386205699remes1.jpg&f=1&nofb=1&ipt=8b2a48b4ad5eabe409706cd01832d16b3bcee7dcd9970c0374e6ed76f1ec0886",
  },
  {
    id: nanoid(6),
    name: "шахматы",
    category: "Игры",
    description: "Деревянные шахматы, доска 50х50см, фигуры ручной работы",
    price: 140,
    stock: 8,
    imageUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Famiel.club%2Fuploads%2Fposts%2F2022-03%2F1647749838_65-amiel-club-p-kartinki-s-shakhmatami-70.jpg&f=1&nofb=1&ipt=6bcce582c5d0e67ee8eb2a170f304ef861f8306db0c5da50d12dd42bfd55bd82",
  },
  {
    id: nanoid(6),
    name: "ноутбук",
    category: "Электроника",
    description: "15.6 дюймов, Intel i5, 8GB RAM, 512GB SSD",
    price: 1200,
    stock: 5,
    imageUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ffikiwiki.com%2Fuploads%2Fposts%2F2022-02%2F1644973544_5-fikiwiki-com-p-kartinki-noutbuki-5.jpg&f=1&nofb=1&ipt=86577a4e2b71be2cd7dd19dc68227fa0e2e2eabcdaa0dd7c7495d2a316a6458e",
  },
  {
    id: nanoid(6),
    name: "молоток",
    category: "Инструменты",
    description: "Слесарный молоток 500г с фиберглассовой рукояткой",
    price: 25,
    stock: 30,
    imageUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fthumbs.dreamstime.com%2Fb%2F%25D0%25BC%25D0%25BE%25D0%25BB%25D0%25BE%25D1%2582%25D0%25BE%25D0%25BA-26813535.jpg&f=1&nofb=1&ipt=d492c1396af5fa0956496ece2d73f9bad28a3473f997c5adf42e928b12cd08be",
  },
  {
    id: nanoid(6),
    name: "плед",
    category: "Дом",
    description: "Мягкий флисовый плед 150х200см, серый",
    price: 60,
    stock: 12,
    imageUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fir.ozone.ru%2Fs3%2Fmultimedia-1-9%2Fc1000%2F7043761485.jpg&f=1&nofb=1&ipt=14fb5e6e6ba76b32a900e90bb504eb0c52e16fe5de3834171eb53ce89272590b",
  },
  {
    id: nanoid(6),
    name: "наушники",
    category: "Электроника",
    description: "Беспроводные наушники с шумоподавлением, 20ч работы",
    price: 85,
    stock: 20,
    imageUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.comfy.ua%2Fmedia%2Fcatalog%2Fproduct%2Fa%2Fk%2Fakeneo_gbjmlp-optimized_original.jpg&f=1&nofb=1&ipt=07bb538ad973c40fbbf5bcfab78167d7b70b4bdc7cf562821f8c9c878225dfea",
  },
  {
    id: nanoid(6),
    name: "кружка",
    category: "Посуда",
    description: "Керамическая кружка 350мл, подарок",
    price: 15,
    stock: 50,
    imageUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.freepik.com%2Fpremium-vector%2Fwhite-mug-isolated-white-background-top-view-vector-mock-up_212036-322.jpg%3Fw%3D1380&f=1&nofb=1&ipt=d7ef0872686fc0990489f05ddfc5d2f1d4e728a225f808d839726598b79ce9e0",
  },
  {
    id: nanoid(6),
    name: "рюкзак",
    category: "Сумки",
    description: "Городской рюкзак 25л, водонепроницаемый",
    price: 90,
    stock: 7,
    imageUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcs2.livemaster.ru%2Fstorage%2Fb1%2Fc8%2F160a67204a87a45636ae1d62ca82--sumki-i-aksessuary-muzhskoj-ryukzak-kozhanyj-dazzler-temno-ko.jpg&f=1&nofb=1&ipt=dafbb4f8ea6192e47437020e32d6f06e125c0e2b96729b12bdc4e05b27e87030",
  },
  {
    id: nanoid(6),
    name: "кроссовки",
    category: "Обувь",
    description: "Беговые кроссовки, размеры 39-45",
    price: 110,
    stock: 14,
    imageUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%2Fid%2FOIP.JAshWHUeDtEbuKrOiaho7QHaEy%3Fpid%3DApi&f=1&ipt=4005afef4dcacf0f39b1c6ef1c1fb2e57a0d2d6f470709ea0b9a926b645fe26c",
  },
];

// ========== SWAGGER ==========
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API управления товарами",
      version: "1.0.0",
      description: "API для управления списком товаров с JWT аутентификацией и RBAC",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: "Локальный сервер",
      },
    ],
    components: {
      schemas: {
        Good: {
          type: "object",
          required: ["name", "category", "price", "stock"],
          properties: {
            id: { type: "string", description: "Уникальный ID товара" },
            name: { type: "string", description: "Название товара" },
            category: { type: "string", description: "Категория товара" },
            description: { type: "string", description: "Описание товара" },
            price: { type: "number", description: "Цена товара" },
            stock: { type: "integer", description: "Количество на складе" },
            imageUrl: { type: "string", description: "URL изображения" }
          }
        },
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            username: { type: "string" },
            role: { type: "string", enum: ["user", "seller", "admin"] },
            isActive: { type: "boolean" },
            createdAt: { type: "string" }
          }
        },
        RefreshTokenResponse: {
          type: "object",
          properties: {
            accessToken: { type: "string", description: "Новый JWT access токен" }
          }
        },
        LogoutResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Logged out successfully" }
          }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./app.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// ========== MIDDLEWARE ==========
function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }
  
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

function checkRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
    }
    
    next();
  };
}

function findGoodsItemOr404(id, res) {
  const item = goods.find((u) => u.id === id);
  if (!item) {
    res.status(404).json({ error: "Item not found" });
    return null;
  }
  return item;
}

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
function generateAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      username: user.username,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: ACCESS_EXPIRES_IN }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      username: user.username,
      role: user.role,
    },
    REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRES_IN }
  );
}

// ========== LOGGING MIDDLEWARE ==========
app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
    if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
      console.log("Body:", req.body);
    }
  });
  next();
});

app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ========== AUTH ENDPOINTS ==========

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
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *       400:
 *         description: Не указаны username или password
 *       409:
 *         description: Пользователь уже существует
 */
app.post("/api/auth/register", async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: "username and password are required" });
  }
  
  const exists = users.some((u) => u.username === username);
  if (exists) {
    return res.status(409).json({ error: "username already exists" });
  }
  
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: String(users.length + 1),
    username,
    passwordHash,
    role: ROLES.USER,
    isActive: true,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  
  res.status(201).json({
    id: user.id,
    username: user.username,
    role: user.role,
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
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успешный вход
 *       401:
 *         description: Неверные учетные данные
 */
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: "username and password are required" });
  }
  
  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  
  if (!user.isActive) {
    return res.status(401).json({ error: "Account is blocked" });
  }
  
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  refreshTokens.add(refreshToken);
  
  res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict`);
  res.json({ accessToken });
});

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Обновление access токена
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Новый access токен
 *       401:
 *         description: Невалидный refresh токен
 */
app.post("/api/auth/refresh", (req, res) => {
  const refreshToken = req.headers.cookie?.split(';')
    .find(c => c.trim().startsWith('refreshToken='))
    ?.split('=')[1];
  
  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token is required" });
  }
  
  if (!refreshTokens.has(refreshToken)) {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
  
  try {
    const payload = jwt.verify(refreshToken, REFRESH_SECRET);
    const user = users.find((u) => u.id === payload.sub);
    
    if (!user || !user.isActive) {
      return res.status(401).json({ error: "User not found or blocked" });
    }
    
    refreshTokens.delete(refreshToken);
    
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    refreshTokens.add(newRefreshToken);
    
    res.setHeader('Set-Cookie', `refreshToken=${newRefreshToken}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict`);
    res.json({ accessToken: newAccessToken });
    
  } catch (err) {
    refreshTokens.delete(refreshToken);
    res.setHeader('Set-Cookie', 'refreshToken=; HttpOnly; Path=/; Max-Age=0');
    return res.status(401).json({ error: "Invalid or expired refresh token" });
  }
});

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
 *       401:
 *         description: Не авторизован
 */
app.get("/api/auth/me", authMiddleware, (req, res) => {
  const userId = req.user.sub;
  const user = users.find((u) => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  
  res.json({
    id: user.id,
    username: user.username,
    role: user.role,
    isActive: user.isActive,
  });
});

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Выход из системы
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Успешный выход
 */
app.post("/api/auth/logout", (req, res) => {
  const refreshToken = req.headers.cookie?.split(';')
    .find(c => c.trim().startsWith('refreshToken='))
    ?.split('=')[1];
  
  if (refreshToken) {
    refreshTokens.delete(refreshToken);
  }
  
  res.setHeader('Set-Cookie', 'refreshToken=; HttpOnly; Path=/; Max-Age=0');
  res.json({ message: "Logged out successfully" });
});

// ========== USER MANAGEMENT (Администратор) ==========

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Получить список пользователей
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список пользователей
 *       403:
 *         description: Доступ запрещен
 */
app.get("/api/users", authMiddleware, checkRole(ROLES.ADMIN), (req, res) => {
  const usersList = users.map(({ passwordHash, ...user }) => user);
  res.json(usersList);
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Получить пользователя по id
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Пользователь найден
 *       404:
 *         description: Пользователь не найден
 */
app.get("/api/users/:id", authMiddleware, checkRole(ROLES.ADMIN), (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  
  const { passwordHash, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Обновить информацию пользователя
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, seller, admin]
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Пользователь обновлен
 *       404:
 *         description: Пользователь не найден
 */
app.put("/api/users/:id", authMiddleware, checkRole(ROLES.ADMIN), async (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  
  const { username, role, password } = req.body;
  
  if (username) user.username = username;
  if (role && Object.values(ROLES).includes(role)) user.role = role;
  if (password) user.passwordHash = await bcrypt.hash(password, 10);
  
  const { passwordHash, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Заблокировать пользователя
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Пользователь заблокирован
 *       404:
 *         description: Пользователь не найден
 */
app.delete("/api/users/:id", authMiddleware, checkRole(ROLES.ADMIN), (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  
  user.isActive = false;
  res.json({ message: "User blocked successfully", user: { id: user.id, username: user.username, isActive: false } });
});

// ========== PRODUCTS ENDPOINTS ==========

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создать товар
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Good'
 *     responses:
 *       201:
 *         description: Товар создан
 *       403:
 *         description: Доступ запрещен
 */
app.post("/api/products", authMiddleware, checkRole(ROLES.SELLER, ROLES.ADMIN), (req, res) => {
  const { name, category, description, price, stock, imageUrl } = req.body;
  
  if (!name || !category || price === undefined || stock === undefined || !description || !imageUrl) {
    return res.status(400).json({
      error: "name, category, description, price, stock and imageUrl are required", 
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
 * /api/products:
 *   get:
 *     summary: Получить список товаров
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список товаров
 */
app.get("/api/products",authMiddleware, (req, res) => {
  res.json(goods);
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получить товар по id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Товар найден
 *       404:
 *         description: Товар не найден
 */
app.get("/api/products/:id", authMiddleware, (req, res) => {
  const id = req.params.id;
  const item = findGoodsItemOr404(id, res);
  if (!item) return;
  res.json(item);
});

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Обновить товар
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Good'
 *     responses:
 *       200:
 *         description: Товар обновлен
 *       403:
 *         description: Доступ запрещен
 *       404:
 *         description: Товар не найден
 */
app.put("/api/products/:id", authMiddleware, checkRole(ROLES.SELLER, ROLES.ADMIN), (req, res) => {
  const id = req.params.id;
  const item = findGoodsItemOr404(id, res);
  if (!item) return;
  
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
 * /api/products/{id}:
 *   delete:
 *     summary: Удалить товар
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Товар удален
 *       403:
 *         description: Доступ запрещен
 *       404:
 *         description: Товар не найден
 */
app.delete("/api/products/:id", authMiddleware, checkRole(ROLES.ADMIN), (req, res) => {
  const id = req.params.id;
  const exists = goods.some((u) => u.id === id);
  
  if (!exists) {
    return res.status(404).json({ error: "Item not found" });
  }
  
  goods = goods.filter((u) => u.id !== id);
  res.status(204).send();
});

// ========== ERROR HANDLING ==========
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ========== START SERVER ==========
app.listen(port, async () => {
  console.log(`Сервер запущен на порту ${port} локального хоста.`);
  console.log(`Swagger документация: http://localhost:${port}/api-docs`);
  
  // Создание тестового администратора и продавца
  const adminExists = users.find(u => u.username === 'admin');
  if (!adminExists) {
    const adminHash = await bcrypt.hash('admin123', 10);
    users.push({
      id: String(users.length + 1),
      username: 'admin',
      passwordHash: adminHash,
      role: ROLES.ADMIN,
      isActive: true,
      createdAt: new Date().toISOString(),
    });
    console.log('Тестовый администратор создан: admin / admin123');
  }
  
  const sellerExists = users.find(u => u.username === 'seller');
  if (!sellerExists) {
    const sellerHash = await bcrypt.hash('seller123', 10);
    users.push({
      id: String(users.length + 1),
      username: 'seller',
      passwordHash: sellerHash,
      role: ROLES.SELLER,
      isActive: true,
      createdAt: new Date().toISOString(),
    });
    console.log('Тестовый продавец создан: seller / seller123');
  }
});