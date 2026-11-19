# NovaMart E-Commerce Platform
### Enterprise Full-Stack E-Commerce System (FastAPI + React Vite + PostgreSQL / Neon + Docker)

> **College Examination DevOps & Cloud Systems Project**  
> Complete modern full-stack web application integrating an existing Python FastAPI REST API with a responsive React (Vite + Tailwind CSS) client, containerized via Docker and configured for Render + Neon PostgreSQL deployment.

---

## 1. Project Overview & Architecture

```
                                  +---------------------------------------+
                                  |            Client Browser             |
                                  |    (React 19 + Vite + Tailwind CSS)   |
                                  +---------------------------------------+
                                                      |
                                                      | HTTP / JSON & Form
                                                      | Bearer JWT Tokens
                                                      v
                                  +---------------------------------------+
                                  |       FastAPI Application ASGI        |
                                  |   (Uvicorn, Pydantic, OAuth2 Form)    |
                                  +---------------------------------------+
                                         |                         |
                                         | SQLAlchemy 2.0 ORM      |
                                         v                         v
                       +-------------------------------+  +-------------------------------+
                       | Local SQLite (ecommerce.db)   |  | Cloud PostgreSQL (Neon.tech)  |
                       | Default Zero-Config Dev       |  | Production Managed DB (SSL)   |
                       +-------------------------------+  +-------------------------------+
```

---

## 2. Codebase Organization

```
CloudCart_DevOps/
├── backend/                             # Python FastAPI Backend Application
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py                # Environment settings & DB URLs
│   │   │   └── security.py              # Bcrypt, JWT tokens, RBAC roles
│   │   ├── db/
│   │   │   └── database.py              # SQLAlchemy engine & session manager
│   │   ├── models/
│   │   │   └── models.py                # User, Cart, CartItem, Category, Product
│   │   ├── routers/
│   │   │   ├── accounts.py              # /me/ endpoints
│   │   │   ├── auth.py                  # /auth/ endpoints
│   │   │   ├── carts.py                 # /carts/ endpoints
│   │   │   ├── categories.py            # /categories/ endpoints
│   │   │   ├── products.py              # /products/ endpoints
│   │   │   └── users.py                 # /users/ endpoints (Admin)
│   │   ├── schemas/                     # Pydantic input/output schemas
│   │   ├── services/                    # Business logic services
│   │   ├── utils/responses.py           # Standardized response wrappers
│   │   └── main.py                      # FastAPI instance with CORS middleware
│   ├── alembic/                         # Database schema migrations
│   ├── tests/
│   │   ├── conftest.py                  # Test configuration & path setup
│   │   └── test_api_integration.py      # Automated pytest integration suite
│   ├── alembic.ini                      # Alembic migration config
│   ├── ecommerce.db                     # Local SQLite database
│   ├── main.py                          # Top-level ASGI entry point
│   ├── migrate.py                       # Alembic migration runner
│   ├── run.py                           # Development server launcher
│   ├── seed.py                          # Database seeder (categories, products, demo users)
│   ├── Dockerfile                       # Multi-stage Python backend containerfile
│   ├── requirements.txt                 # Backend Python dependencies
│   ├── .env.example                     # Backend environment template
│   └── README.md                        # Backend documentation
│
├── frontend/                            # React + Vite Client Application
│   ├── public/
│   │   └── images/                      # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/                  # Navbar, Footer, Loader, ErrorMessage, ProtectedRoute, ConfirmDialog
│   │   │   ├── products/                # ProductCard, ProductGrid, ProductFilters, ProductSearch
│   │   │   ├── cart/                    # CartItem, CartSummary
│   │   │   └── forms/                   # LoginForm, RegisterForm
│   │   ├── context/
│   │   │   ├── AuthContext.jsx          # JWT token persistence, login/signup/logout, profile refresh
│   │   │   └── CartContext.jsx          # Real-time backend cart synchronization & local fallback
│   │   ├── hooks/
│   │   │   └── useAuth.js               # Authentication hook
│   │   ├── layouts/
│   │   │   ├── MainLayout.jsx           # Customer storefront layout
│   │   │   └── AdminLayout.jsx          # Protected administration layout
│   │   ├── pages/
│   │   │   ├── Home.jsx                 # Hero banner, trust badges, featured categories & products
│   │   │   ├── Products.jsx             # Catalog browsing, search query, category filter, sorting, pagination
│   │   │   ├── ProductDetails.jsx       # Image gallery, stock status, ratings, price breakdown, add-to-cart
│   │   │   ├── Categories.jsx           # All product departments & direct category links
│   │   │   ├── Cart.jsx                 # Active user cart, item counters, clear cart, checkout simulation
│   │   │   ├── Login.jsx                # OAuth2 login with quick-fill evaluation credentials
│   │   │   ├── Register.jsx             # User signup form
│   │   │   ├── Profile.jsx              # Customer account details, edit credentials, delete account
│   │   │   ├── AdminDashboard.jsx       # Overview statistics, recent user accounts, architecture status
│   │   │   ├── AdminProducts.jsx        # Full Product CRUD (create modal, edit modal, delete dialog)
│   │   │   ├── AdminCategories.jsx      # Full Category CRUD (create modal, edit modal, delete dialog)
│   │   │   ├── NotFound.jsx             # 404 handler
│   │   │   └── Unauthorized.jsx         # 403 access control handler
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx            # Declarative route configuration
│   │   ├── services/
│   │   │   ├── api.js                   # Central Axios instance with JWT interceptor & refresh queue
│   │   │   ├── authService.js           # Auth endpoints (/auth/signup, /auth/login, /auth/refresh)
│   │   │   ├── productService.js        # Products endpoints
│   │   │   ├── categoryService.js       # Categories endpoints
│   │   │   ├── cartService.js           # Carts endpoints
│   │   │   └── userService.js           # Account (/me/) and Admin users (/users/) endpoints
│   │   ├── utils/
│   │   │   ├── formatCurrency.js        # Currency & discount formatting utilities
│   │   │   └── errorHandler.js          # Pydantic 422 & status code user-friendly error extractor
│   │   ├── App.jsx                      # Top-level providers and toaster configuration
│   │   ├── main.jsx                     # Vite React entry point
│   │   └── index.css                    # Tailwind CSS directives & theme styles
│   ├── tailwind.config.js               # Tailwind design system configuration
│   ├── postcss.config.js                # PostCSS configuration
│   ├── nginx.conf                       # Production Nginx SPA configuration
│   ├── Dockerfile                       # Multi-stage production frontend containerfile
│   ├── .env.example                     # Frontend environment template
│   ├── package.json                     # Frontend dependencies & scripts
│   └── README.md                        # Frontend documentation
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml                    # Automated GitHub Actions CI/CD pipeline
├── docker-compose.yml                   # Unified multi-container deployment
├── pytest.ini                           # Monorepo pytest configuration
├── .gitignore                           # Comprehensive git ignore rules
└── README.md                            # Complete documentation & examination guide
```

---

## 3. Preserved Backend & Minimal Non-Breaking Enhancements

### Strict Backend Preservation Rule
The existing FastAPI backend was **100% preserved**:
- No endpoint URLs were modified or removed.
- No HTTP methods were altered.
- No request/response schemas were changed.
- No existing database models or tables were altered.

### Single Non-Breaking Integration Enhancement
- **CORS Middleware (`app/main.py`)**: Added standard `CORSMiddleware` reading allowed origins from `CORS_ORIGINS` environment variable (with fallback to `http://localhost:5173`, `http://127.0.0.1:5173`, `http://localhost:3000`). This allows browser clients to make cross-origin API requests without CORS blocks.

---

## 4. Complete API Integration Matrix (All 22 Endpoints Integrated)

| Group | Method | Endpoint | Access Level | Request Body / Schema | Response Schema | Frontend Integration |
|---|---|---|---|---|---|---|
| **Auth** | `POST` | `/auth/signup` | Public | JSON: `Signup` (`full_name`, `username`, `email`, `password`) | `UserOut` | Register page (`RegisterForm`) |
| **Auth** | `POST` | `/auth/login` | Public | Form: `OAuth2PasswordRequestForm` (`username`, `password`) | `TokenResponse` | Login page (`LoginForm`) |
| **Auth** | `POST` | `/auth/refresh` | Public | Header: `refresh-token: <token>` | `TokenResponse` | Silent Axios interceptor token refresh |
| **Account** | `GET` | `/me/` | Bearer Token | None | `AccountOut` | Navbar badge, Profile page, AuthContext |
| **Account** | `PUT` | `/me/` | Bearer Token | JSON: `AccountUpdate` (`username`, `email`, `full_name`) | `AccountOut` | Profile page (edit profile) |
| **Account** | `DELETE`| `/me/` | Bearer Token | None | `AccountOut` | Profile page (delete account with confirmation) |
| **Products** | `GET` | `/products/` | Public | None (Query: `page`, `limit`, `search`) | `ProductsOut` | Home, Catalog, Search, Filters |
| **Products** | `GET` | `/products/{product_id}` | Public | None (Path: `product_id`) | `ProductOut` | ProductDetails page |
| **Products** | `POST` | `/products/` | Admin Bearer | JSON: `ProductCreate` | `ProductOut` | Admin Products (Create Product modal) |
| **Products** | `PUT` | `/products/{product_id}` | Admin Bearer | JSON: `ProductUpdate` | `ProductOut` | Admin Products (Edit Product modal) |
| **Products** | `DELETE`| `/products/{product_id}` | Admin Bearer | None (Path: `product_id`) | `ProductOutDelete` | Admin Products (Delete Product) |
| **Categories** | `GET` | `/categories/` | Public | None (Query: `page`, `limit`, `search`) | `CategoriesOut` | Navbar, Home, Filters, Categories page |
| **Categories** | `GET` | `/categories/{category_id}`| Public | None (Path: `category_id`) | `CategoryOut` | Category filter & detail view |
| **Categories** | `POST` | `/categories/` | Admin Bearer | JSON: `CategoryCreate` (`name`) | `CategoryOut` | Admin Categories (Create Category modal) |
| **Categories** | `PUT` | `/categories/{category_id}`| Admin Bearer | JSON: `CategoryUpdate` (`name`) | `CategoryOut` | Admin Categories (Edit Category modal) |
| **Categories** | `DELETE`| `/categories/{category_id}`| Admin Bearer | None (Path: `category_id`) | `CategoryOutDelete` | Admin Categories (Delete Category) |
| **Carts** | `GET` | `/carts/` | Bearer Token | None (Query: `page`, `limit`) | `CartsOutList` | Cart page, CartContext sync |
| **Carts** | `GET` | `/carts/{cart_id}` | Bearer Token | None (Path: `cart_id`) | `CartOut` | Cart page (active cart view) |
| **Carts** | `POST` | `/carts/` | Bearer Token | JSON: `CartCreate` (`cart_items`) | `CartOut` | Add to Cart / Create session |
| **Carts** | `PUT` | `/carts/{cart_id}` | Bearer Token | JSON: `CartUpdate` (`cart_items`) | `CartOut` | Quantity stepper & Item removal |
| **Carts** | `DELETE`| `/carts/{cart_id}` | Bearer Token | None (Path: `cart_id`) | `CartOutDelete` | Clear Cart operation |
| **Users** | `GET` | `/users/` | Admin Bearer | None (Query: `page`, `limit`, `search`, `role`) | `UsersOut` | Admin Dashboard (User accounts table) |
| **Users** | `GET` | `/users/{user_id}` | Admin Bearer | None (Path: `user_id`) | `UserOut` | Admin user inspector |
| **Users** | `POST` | `/users/` | Admin Bearer | JSON: `UserCreate` | `UserOut` | Admin user creation |
| **Users** | `PUT` | `/users/{user_id}` | Admin Bearer | JSON: `UserUpdate` | `UserOut` | Admin user update |
| **Users** | `DELETE`| `/users/{user_id}` | Admin Bearer | None (Path: `user_id`) | `UserOutDelete` | Admin user deletion |

---

## 5. Local Setup & Startup Instructions

### Prerequisites
- Python 3.10+ (Python 3.11 / 3.13 tested)
- Node.js 18+ (Node.js 20 / 24 tested) & npm

---

### Step 1: Backend Setup & Seeding

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. (Optional) Create and activate a Python virtual environment:
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # Linux/macOS:
   source .venv/bin/activate
   ```

3. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Populate initial demonstration data (5 categories, 8 products, admin & demo users):
   ```bash
   python seed.py
   ```

5. Start the FastAPI backend server:
   ```bash
   python run.py
   ```
   *The backend will be running at [http://127.0.0.1:8000](http://127.0.0.1:8000).*  
   *Interactive Swagger Documentation: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).*

---

### Step 2: Frontend Setup & Startup

1. In a new terminal, navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Ensure environment variables are configured in `frontend/.env`:
   ```env
   VITE_API_BASE_URL=http://127.0.0.1:8000
   ```

4. Launch the Vite development server:
   ```bash
   npm run dev
   ```
   *The React frontend will be accessible at [http://localhost:5173](http://localhost:5173).*

---

### Step 3: Run Automated Tests

To execute the backend integration test suite:
```bash
# From workspace root:
python -m pytest -v

# Or from backend folder:
cd backend
python -m pytest tests/test_api_integration.py -v
```
*(Result: 5 passed in 1.5s)*

To execute the frontend production build test:
```bash
cd frontend
npm run build
```
*(Result: Built in 600ms, 2227 modules transformed cleanly)*

---

## 6. Demo Accounts for Examination Evaluation

The database seeder automatically configures two test accounts:

| Role | Username | Password | Access Privileges |
|---|---|---|---|
| **Administrator** | `admin` | `AdminPass123!` | Full store access + Admin Dashboard (`/admin`), Product CRUD (`/admin/products`), Category CRUD (`/admin/categories`), User management |
| **Standard Customer** | `demouser` | `UserPass123!` | Storefront browsing, Cart synchronization, Profile management (`/profile`), Account deletion |

*Tip: The Sign In page includes one-click "Fill Admin" and "Fill Customer" buttons for convenient evaluation during demonstration.*

---

## 7. Docker & Containerized Deployment

Run both backend and frontend simultaneously with zero manual dependency installation using Docker Compose:

```bash
docker compose up --build
```

- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

To stop the containers:
```bash
docker compose down
```

---

## 8. Cloud Deployment Guide (Render + Neon PostgreSQL)

### A. Neon Managed PostgreSQL Configuration
1. Sign up / log in to [Neon.tech](https://neon.tech) and create a project (e.g., `ecommerce-db`).
2. Copy the PostgreSQL connection string from the Neon dashboard.
3. Replace the protocol with `postgresql+psycopg2`:
   ```
   postgresql+psycopg2://<user>:<password>@<endpoint>.neon.tech/<dbname>?sslmode=require
   ```
4. Set this as the `DATABASE_URL` environment variable in your backend deployment. The backend's SQLAlchemy engine will automatically connect and create tables upon startup.

### B. Render Deployment
1. **Backend Web Service**:
   - Environment: `Python` (or `Docker`)
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Environment Variables:
     - `DATABASE_URL`: *(Your Neon PostgreSQL connection string)*
     - `SECRET_KEY`: *(Generate a secure random string)*
     - `CORS_ORIGINS`: `https://your-frontend-app.onrender.com`
     - `ACCESS_TOKEN_EXPIRE_MINUTES`: `30`

2. **Frontend Static Site**:
   - Environment: `Static Site`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Environment Variables:
     - `VITE_API_BASE_URL`: `https://your-backend-app.onrender.com`

---

## 9. Verification & Acceptance Checklist

- [x] Existing FastAPI backend remains functional.
- [x] Existing API endpoints remain unchanged.
- [x] Frontend has a proper modular structure.
- [x] React application starts and builds cleanly (`npm run build` succeeds).
- [x] Frontend connects to FastAPI backend via centralized Axios instance.
- [x] All 22 operational backend endpoints are integrated.
- [x] User registration works (`POST /auth/signup`).
- [x] User login works with OAuth2 form data (`POST /auth/login`).
- [x] JWT token persistence, refresh rotation, and 401 handling work.
- [x] Product listing, category filtering, search, and details work.
- [x] Real-time cart synchronization (create, add, quantity change, clear) works.
- [x] Customer profile view, update (`PUT /me/`), and account deletion work.
- [x] Admin dashboard, product CRUD, and category CRUD work.
- [x] Responsive layout tested for mobile, tablet, and desktop screens.
- [x] Dockerfile and Docker Compose configurations ready.
- [x] GitHub Actions CI/CD pipeline configured.
- [x] No secrets or credentials committed.
