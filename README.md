# ProjectMatch — Backend

Spring Boot REST API for the ProjectMatch collaborative platform.

---

## Setup

### Prerequisites
- **Java 17+** (recommended). The project targets Java 17; JDK 21+ is supported via the Lombok version in `pom.xml`.
- **MySQL 8+** or **MariaDB 10+**
- **Maven**

> **JDK 26 / very new JDKs:** If `mvn compile` fails with missing Lombok getters or `builder()`, use Java 17 (`export JAVA_HOME=/usr/lib/jvm/java-17-openjdk`) or keep the pinned Lombok version in `pom.xml`.

### Quick start (no database install)

Uses an in-memory H2 database — good for trying the API locally:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

Server: `http://localhost:8082`

---

### Production-like setup (MySQL / MariaDB)

#### 1. Create database and app user

**Option A — setup script (Arch Linux / MariaDB):**

```bash
chmod +x scripts/setup-mariadb.sh
./scripts/setup-mariadb.sh
```

This runs `scripts/setup-mariadb.sql` as admin and creates:

| Setting  | Value            |
|----------|------------------|
| Database | `projectmatch_db` |
| User     | `projectmatch`   |
| Password | `projectmatch`   |

**Option B — manual SQL:**

```sql
CREATE DATABASE projectmatch_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER 'projectmatch'@'localhost' IDENTIFIED BY 'projectmatch';
GRANT ALL PRIVILEGES ON projectmatch_db.* TO 'projectmatch'@'localhost';
FLUSH PRIVILEGES;
```

On Arch Linux, MariaDB’s `root` account often uses **unix_socket** auth (no password). Run SQL as admin:

```bash
sudo mariadb < scripts/setup-mariadb.sql
```

#### 2. Configuration

Default credentials are in `src/main/resources/application.properties`:

```properties
spring.datasource.username=projectmatch
spring.datasource.password=projectmatch
```

For machine-specific overrides (different password, port, or Arch Linux socket auth before running the setup script), copy the example file:

```bash
cp src/main/resources/application-local.properties.example \
   src/main/resources/application-local.properties
```

Edit `application-local.properties` — it is gitignored and imported automatically from `application.properties`.

#### 3. Run

```bash
mvn spring-boot:run
```

Default port is **8082**. To use another port:

```bash
mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8080
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login, returns JWT | Public |

### Users
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/users/me` | Get current user | Required |
| PUT | `/api/users/me` | Update profile | Required |
| GET | `/api/users/{id}` | Get user by ID | Required |
| GET | `/api/users` | Get all users | ADMIN |
| DELETE | `/api/users/{id}` | Delete user | ADMIN |

### Projects
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/projects` | Create project | Required |
| GET | `/api/projects` | Get all projects | Required |
| GET | `/api/projects/open` | Get open projects | Public |
| GET | `/api/projects/search?keyword= | Search projects | Required |
| GET | `/api/projects/{id}` | Get project | Public |
| PATCH | `/api/projects/{id}/status` | Update status | Required |
| DELETE | `/api/projects/{id}` | Delete project | Required |

### Teams
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/teams/project/{projectId}` | Get team | Required |
| POST | `/api/teams/project/{projectId}/join` | Join team | Required |
| POST | `/api/teams/project/{projectId}/leave` | Leave team | Required |

### Formations
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/formations` | Create formation | MENTOR |
| GET | `/api/formations` | Get all formations | Public |
| GET | `/api/formations/free` | Get free formations | Public |
| GET | `/api/formations/{id}` | Get formation | Public |
| GET | `/api/formations/mentor/{id}` | Get by mentor | Required |
| DELETE | `/api/formations/{id}` | Delete formation | MENTOR/ADMIN |

---

## Authentication

All protected endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

Get the token from `/api/auth/login` or `/api/auth/register`.

---

## Example Requests

### Register
```json
POST /api/auth/register
{
  "name": "Mouad",
  "email": "mouad@example.com",
  "password": "secret123",
  "role": "STUDENT"
}
```

### Login
```json
POST /api/auth/login
{
  "email": "mouad@example.com",
  "password": "secret123"
}
```

### Create Project
```json
POST /api/projects
Authorization: Bearer <token>
{
  "title": "Plant Disease Detector",
  "description": "ML app to detect diseases in plants",
  "requiredSkills": "Python, TensorFlow, React"
}
```
