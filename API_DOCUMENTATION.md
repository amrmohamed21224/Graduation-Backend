# 🚀 توثيق الـ API الخاص بنظام إدارة المستندات (Document Management System)

## 🌟 Overview (نظرة عامة)
المشروع ده عبارة عن نظام باك إند متكامل لمساعدة المستخدمين يرفعوا ويديروا مستنداتهم الرسمية (زي الباسبور، البطاقة، إلخ). النظام بيحسب تلقائياً حالة المستند (ساري VALID، قرب ينتهي ABOUT_TO_EXPIRE، أو منتهي EXPIRED). كمان فيه نظام تنبيهات (Notifications) بيشتغل في الخلفية وبيبعت إشعارات للمستخدم لو المستند بتاعه قرب يخلص عشان يلحق يجدده.

---

## 🏃‍♂️ Quick Start for Frontend (البداية السريعة)
عشان تبدأ تربط الواجهة الأمامية (Frontend) مع الباك إند صح، امشي على الـ 4 خطوات دي بالترتيب:
1. **Register (حساب جديد)**: ابعت بيانات المستخدم لمسار الـ `/auth/register`.
2. **Login (تسجيل الدخول)**: لو المستخدم عنده حساب، ابعته لمسار الـ `/auth/login`.
3. **خد التوكن**: أول ما الـ Login أو الـ Register ينجح، الباك إند هيرجعلك `token`. احفظ التوكن ده عندك (في الـ LocalStorage أو Cookies).
4. **استخدمه**: أي مسار تلاقيه هنا مكتوب جنبه **[PROTECTED 🔒]**، معناه إنه محمي ولازم تبعت التوكن ده مع الـ Request في الـ Headers عشان الباك إند يرضى يرد عليك.

---

## 🔗 Base URL (الرابط الأساسي)
كل الـ Endpoints اللي تحت بتبدأ بالرابط الأساسي ده:
`http://localhost:3000/api/v1`

---

## 🛡️ Authentication (نظام التوكن والمصادقة)
الـ مسارات المحمية **[PROTECTED 🔒]** بتطلب منك تبعت الـ JWT Token مع كل طلب بتعمله بالشكل ده جوة الـ `Headers`:

* **Key:** `Authorization`
* **Value:** `Bearer <YOUR_JWT_TOKEN_HERE>` *(ماتنساش كلمة Bearer وبعدها مسافة)*

> ⚠️ **ملاحظة مهمة:** لو نسيت تبعت التوكن، أو بعت توكن منتهي الصلاحية، الباك إند هيرفض الطلب وهيرجعلك خطأ `401 Unauthorized`.

---

## ❌ Error Handling (شكل الأخطاء الموحد)
عشان نسهل عليك الشغل، الباك إند متبرمج إنه دايماً يرجع الأخطاء بشكل موحد وثابت، سواء كان الخطأ في الـ Validation، أو الداتابيز، أو الـ Auth. شكل استجابة الخطأ دايماً بيكون كده:

```json
{
  "success": false,
  "message": "رسالة خطأ واضحة (زي: الإيميل أو الباسورد غلط)",
  "error": {} // لو الخطأ بسبب الـ Validation (زي نسيان حقل)، الخانة دي هيكون جواها تفاصيل الحقول الناقصة.
}
```

---

## 📄 Pagination (ترقيم الصفحات)
أي مسار بيرجع قائمة (List) زي عرض المستندات أو التنبيهات، بيدعم الـ Pagination عن طريق الـ `Query Params` دي:
* `page` (رقم الصفحة اللي عايز تعرضها - الديفولت `1`)
* `limit` (عدد العناصر في الصفحة الواحدة - الديفولت `10`)

*مثال للاستخدام:* `?page=2&limit=5`

---

# 📦 Modules (وحدات النظام)

## 1️⃣ Auth Module (وحدة المصادقة والدخول)

### A. إنشاء حساب جديد (Register)
* **الاسم:** Register New User
* **Method:** `POST`
* **URL:** `/auth/register`
* **الحماية:** غير محمي 🌐
* **شرح بسيط:** بيعمل حساب جديد للمستخدم في الداتابيز ويرجعلك بياناته مع التوكن بتاعه عشان يدخل علطول.
* **Headers المطلوبة:** 
  * `Content-Type: application/json`

**📝 Request Body (JSON):**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "SecurePassword123"
}
```

**✅ Example Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "60d0fe4f5311236168a109ca",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "createdAt": "2024-03-09T20:20:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### B. تسجيل الدخول (Login)
* **الاسم:** Login User
* **Method:** `POST`
* **URL:** `/auth/login`
* **الحماية:** غير محمي 🌐
* **شرح بسيط:** بيتأكد من الإيميل والباسورد، ولو صح بيرجعلك بيانات المستخدم والـ JWT Token الجديد.
* **Headers المطلوبة:** 
  * `Content-Type: application/json`

**📝 Request Body (JSON):**
```json
{
  "email": "jane@example.com",
  "password": "SecurePassword123"
}
```

**✅ Example Response (200 OK):**
```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "user": {
      "id": "60d0fe4f5311236168a109ca",
      "name": "Jane Doe",
      "email": "jane@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

## 2️⃣ Users Module (وحدة المستخدمين)

### A. جلب بيانات حسابي (Get Current Profile)
* **الاسم:** Get My Profile
* **Method:** `GET`
* **URL:** `/users/me`
* **الحماية:** **[PROTECTED 🔒]**
* **شرح بسيط:** بيستخدم التوكن اللي مبعوت في الـ Headers عشان يعرف مين المستخدم ويرجع بيانات البروفايل بتاعه.
* **Headers المطلوبة:** 
  * `Authorization: Bearer <token>`

**✅ Example Response (200 OK):**
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "user": {
      "id": "60d0fe4f5311236168a109ca",
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  }
}
```

---

## 3️⃣ Documents Module (وحدة المستندات)

### A. إضافة مستند جديد (Create New Document)
* **الاسم:** Create Document
* **Method:** `POST`
* **URL:** `/documents`
* **الحماية:** **[PROTECTED 🔒]**
* **شرح بسيط:** بيضيف مستند جديد لليوزر. الباك إند بيحسب أوتوماتيك الحالة (`status`) بتاعة المستند بناءً على تواريخ الإصدار والانتهاء اللي هتبعتها.
* **Headers المطلوبة:** 
  * `Authorization: Bearer <token>`
  * `Content-Type: application/json`

**📝 Request Body (JSON):**
```json
{
  "title": "US Passport",
  "documentId": "PASS-999231",
  "issueDate": "2020-05-15T00:00:00.000Z",
  "expiryDate": "2030-05-15T00:00:00.000Z"
}
```

**✅ Example Response (201 Created):**
```json
{
  "success": true,
  "message": "Document created successfully",
  "data": {
    "document": {
      "_id": "60d0fe4f5311236168a109cb",
      "title": "US Passport",
      "documentId": "PASS-999231",
      "status": "VALID",
      "issueDate": "2020-05-15T00:00:00.000Z",
      "expiryDate": "2030-05-15T00:00:00.000Z",
      "userId": "60d0fe4f5311236168a109ca"
    }
  }
}
```

### B. عرض مستندات المستخدم (List User Documents)
* **الاسم:** Get My Documents
* **Method:** `GET`
* **URL:** `/documents`
* **الحماية:** **[PROTECTED 🔒]**
* **شرح بسيط:** بيرجع كل المستندات الخاصة باليوزر الحالي. تقدر تنظمهم وتقسمهم باستخدام الـ Query params.
* **Headers المطلوبة:** 
  * `Authorization: Bearer <token>`
* **Query Params (اختياري):**
  * `page`: رقم الصفحة (مثال: `1`)
  * `limit`: عدد المستندات (مثال: `10`)
  * `status`: فلترة بحالة المستند (مثال: `VALID`, `EXPIRED`)

**✅ Example Response (200 OK):**
```json
{
  "success": true,
  "message": "Documents retrieved successfully",
  "data": {
    "documents": [
       {
         "_id": "60d0fe4f5311236168a109cb",
         "title": "US Passport",
         "status": "VALID",
         "expiryDate": "2030-05-15T00:00:00.000Z"
       }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

### C. تعديل مستند (Update a Document)
* **الاسم:** Update Document
* **Method:** `PATCH`
* **URL:** `/documents/:id`
* **الحماية:** **[PROTECTED 🔒]**
* **شرح بسيط:** بيعدل بيانات مستند موجود. لو عدلت تاريخ الانتهاء، الباك إند هيحدث حالة المستند (`status`) أوتوماتيك. ابعت بس الحقول اللي عايز تغيرها.
* **Headers المطلوبة:** 
  * `Authorization: Bearer <token>`
  * `Content-Type: application/json`
* **URL Params:**
  * `id`: الـ Mongo ObjectId بتاع المستند.

**📝 Request Body (JSON):**
```json
{
  "title": "US Passport (Renewed)",
  "expiryDate": "2040-05-15T00:00:00.000Z"
}
```

**✅ Example Response (200 OK):**
```json
{
  "success": true,
  "message": "Document updated successfully",
  "data": {
     "document": { 
       "_id": "60d0fe4f5311236168a109cb",
       "title": "US Passport (Renewed)",
       "status": "VALID",
       "expiryDate": "2040-05-15T00:00:00.000Z"
     }
  }
}
```

### D. حذف مستند (Delete a Document)
* **الاسم:** Delete Document
* **Method:** `DELETE`
* **URL:** `/documents/:id`
* **الحماية:** **[PROTECTED 🔒]**
* **شرح بسيط:** بيمسح المستند من الداتابيز نهائياً.
* **Headers المطلوبة:** 
  * `Authorization: Bearer <token>`
* **URL Params:**
  * `id`: الـ Mongo ObjectId بتاع المستند.

**✅ Example Response (200 OK):**
```json
{
  "success": true,
  "message": "Document deleted successfully",
  "data": null
}
```

---

## 🔔 4️⃣ Notifications Module (وحدة التنبيهات)

### A. عرض قائمة التنبيهات (List User Notifications)
* **الاسم:** Get My Notifications
* **Method:** `GET`
* **URL:** `/notifications`
* **الحماية:** **[PROTECTED 🔒]**
* **شرح بسيط:** بيرجع كل الإشعارات والتنبيهات اللي اتولدت أوتوماتيك من نظام الخلفية (Cron Job) واللي بتنبه اليوزر إن مستنداته قربت تنتهي.
* **Headers المطلوبة:** 
  * `Authorization: Bearer <token>`
* **Query Params (اختياري):**
  * `page`: رقم الصفحة (مثال: `1`)
  * `limit`: عدد الإشعارات (مثال: `10`)
  * `unreadOnly`: ابعتها كـ `true` لو عايز الإشعارات اللي لسه متقرتش بس (`isRead: false`).

**✅ Example Response (200 OK):**
```json
{
  "success": true,
  "message": "Notifications retrieved successfully",
  "data": {
    "notifications": [
       {
         "_id": "60d0fe4f5311236168a109cc",
         "message": "ACTION REQUIRED: Your document 'US Passport' expires in just 7 days!",
         "type": "email",
         "isRead": false,
         "sentAt": "2024-03-09T20:20:00.000Z",
         "documentId": {
             "title": "US Passport",
             "status": "ABOUT_TO_EXPIRE"
         }
       }
    ],
    "total": 1,
    "page": 1,
    "limit": 10,
    "unreadCount": 1
  }
}
```

### B. تحديد التنبيه كمقروء (Mark Notification as Read)
* **الاسم:** Mark as Read
* **Method:** `PATCH`
* **URL:** `/notifications/:id/read`
* **الحماية:** **[PROTECTED 🔒]**
* **شرح بسيط:** بيخلي حالة الإشعار "مقروء" عشان لو عندك رقم Badges بلون أحمر في الواجهة ينقص منه واحد.
* **Headers المطلوبة:** 
  * `Authorization: Bearer <token>`
* **URL Params:**
  * `id`: الـ Mongo ObjectId بتاع الإشعار نفسه (مش المستند).

**✅ Example Response (200 OK):**
```json
{
  "success": true,
  "message": "Notification marked as read successfully",
  "data": {
    "notification": {
         "_id": "60d0fe4f5311236168a109cc",
         "isRead": true
    }
  }
}
```

---

# ☁️ Deployment Guide — رفع المشروع على Render

## 📋 المتطلبات قبل الرفع
- حساب على [GitHub](https://github.com)
- حساب على [Render](https://render.com)
- حساب على [MongoDB Atlas](https://www.mongodb.com/atlas) (قاعدة البيانات السحابية المجانية)

---

## الخطوة 1️⃣ — ارفع المشروع على GitHub

افتح الـ Terminal جوه مجلد المشروع وشغّل الأوامر دي بالترتيب:

```bash
git init
git add .
git commit -m "Initial commit - Document Management System"
```

بعدين روح على **GitHub.com**:
1. اضغط **New Repository**
2. سمّيه `grad-project`
3. **لا تضيف** README أو `.gitignore` من GitHub (موجودين عندك فعلاً)
4. انسخ رابط الـ Repository الجديد وشغّل:

```bash
git remote add origin https://github.com/YOUR_USERNAME/grad-project.git
git branch -M main
git push -u origin main
```

---

## الخطوة 2️⃣ — اعمل قاعدة بيانات على MongoDB Atlas

Render مش بيوفر MongoDB، فلازم تستخدم **MongoDB Atlas** (مجاناً):

1. روح على [mongodb.com/atlas](https://www.mongodb.com/atlas) وسجّل دخول.
2. اعمل **Cluster** جديد واختار **Free Tier (M0)**.
3. اعمل **Database User** (اسم + باسورد — احفظهم كويس).
4. في **Network Access** اضغط **"Allow Access from Anywhere"** وحط `0.0.0.0/0`.
5. اضغط **Connect** → **Connect your application** → انسخ الـ Connection String:

```
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/grad-project
```

> ⚠️ استبدل `USERNAME` و `PASSWORD` بالبيانات اللي عملتها في الخطوة 3.

---

## الخطوة 3️⃣ — اعمل Web Service على Render

1. روح على [dashboard.render.com](https://dashboard.render.com) واضغط **"New Web Service"**.
2. اربط حسابك بـ GitHub واختار الـ Repository بتاع `grad-project`.
3. **في صفحة الإعدادات (Configure)، حط القيم دي:**

| الإعداد | القيمة |
|---------|--------|
| **Name** | `grad-project-api` |
| **Region** | Frankfurt EU (أو الأقرب ليك) |
| **Branch** | `main` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

---

## الخطوة 4️⃣ — ضيف Environment Variables على Render

**ده أهم خطوة!** في نفس صفحة الإعدادات، انزل لقسم **"Environment Variables"** واضغط **"Add Environment Variable"** وضيف الـ Variables دي واحد واحد:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `MONGODB_URI` | الـ Connection String اللي نسخته من Atlas |
| `JWT_SECRET` | كلمة سر طويلة وقوية (مثال: `mY$up3r$ecr3tK3y2024!`) |
| `JWT_EXPIRES_IN` | `90d` |

---

## الخطوة 5️⃣ — اضغط Deploy وانتظر

اضغط **"Create Web Service"** وستنى Render يعمل Build و Deploy (بياخد 2-3 دقايق).

لما يخلص، Render هيديك **رابط عام** شبه كده:

```
https://grad-project-api.onrender.com
```

### 🔗 روابط مشروعك بعد الرفع

| الغرض | الرابط |
|-------|--------|
| Base API URL | `https://grad-project-api.onrender.com/api/v1` |
| Swagger Documentation | `https://grad-project-api.onrender.com/api-docs` |
| Health Check | `https://grad-project-api.onrender.com/` |

---

## ⚠️ ملاحظات مهمة عن الـ Free Tier

> **السبات التلقائي (Sleep Mode):** سيرفر Render المجاني بيدخل في وضع "سبات" لو ماحدش استخدمه لمدة **15 دقيقة**. أول Request بعد السبات بياخد **30-50 ثانية** للاستجابة. ده طبيعي تماماً في الخطة المجانية.

> **الـ Logs:** تقدر تشوف لوجات السيرفر من لوحة تحكم Render في تاب **"Logs"** عشان تتأكد إن كل حاجة شغالة صح.

> **الـ Redeploy:** أي Push جديد على GitHub هياخد Render يعمل Redeploy أوتوماتيك.
