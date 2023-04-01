[![Preview project](https://img.shields.io/static/v1?label=Node.js&message=Preview&color=important&style=flat&logo=Node.js)][preview]

# MERN-forum

Full-stack MERN web application. [Click here to preview.][preview]

[preview]: https://djalowiecki.toadres.pl/mern-forum

### Table of contents

- [Technologies](#technologies)
- [Features](#features)
- [Setup](#setup)
- [Backend API Endpoints](#rest-api-endpoints)

---

### Technologies

- MongoDB
- Express
- React
- Redux
- NodeJS
- Formik
- Bootstrap
- Winston
- Docker

---

### Features

- [x] User login
- [x] User registration
- [x] Create new post
- [x] Add comments to post

---

### Setup

#### Clone repository

```bash
git clone https://github.com/dominikjalowiecki/MERN-forum.git
```

#### Change directory

```bash
cd ./MERN-forum
```

#### Setup .env file

```
DB_URI=<mongodb-uri>
PORT=5000
COOKIE_SECRET=secret_phrase
FRONTEND_BASE_URL=http://localhost:3000
NODE_ENV=development
```

#### Install dependencies

```bash
npm ci
cd ./client
npm ci
```

#### Run development servers

```bash
cd ..
npm run dev
```

### OR

#### Run docker-compose "production" environment

```bash
docker compose up -d
```

Application available on http://localhost for frontend and http://localhost:5000 for backend.

---

### REST API Endpoints

|        Endpoint         | Method |                      Request body                      | Authentication |
| :---------------------: | :----: | :----------------------------------------------------: | :------------: |
|    /api/users/login     | `POST` |                  email <br> password                   |       -        |
|    /api/users/logout    | `POST` |                           -                            |       -        |
|   /api/users/register   | `POST` | username <br> email <br> password <br> confirmPassword |       -        |
|      /api/users/me      | `GET`  |                           -                            |       +        |
|       /api/posts        | `GET`  |                           -                            |       -        |
|       /api/posts        | `POST` |                   title <br> content                   |       +        |
|     /api/posts/:id      | `GET`  |                           -                            |       -        |
| /api/posts/:id/comments | `POST` |                        content                         |       +        |
