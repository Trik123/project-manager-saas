# DONE + DELETE BUTTON IN WORKSPACE


# Sprint 1 — Auth & Setup

**Goal:**  
Get the repo fully alive with backend + frontend + database.  
At the end of this sprint, a user can **register, login, create a workspace, and see it in the dashboard**.

---

## 🔹 Task 1 — Schema: User model

**Branch:** `schema/user`  
**Owner:** Dev A

### Details

- Add `User` model in Prisma schema.
- Fields: `id (cuid)`, `email (unique)`, `name?`, `passwordHash`, `createdAt`, `updatedAt`.
- Run `npx prisma migrate dev -n init_user`.
- Create seed script to add one dummy user.

### Acceptance Criteria

- `prisma migrate dev` runs without errors.
- Prisma Studio shows seeded user.

---

## 🔹 Task 2 — API: Auth (register, login, me)

**Branch:** `feat/api-auth`  
**Owner:** Dev B

### Details

- `POST /auth/register {email, password, name?}` → hash password with bcrypt, return `{id,email,name}`.
- `POST /auth/login {email, password}` → validate credentials, set JWT in httpOnly cookie `token`.
- `GET /me` → verify JWT, return user info.

### Acceptance Criteria

- Successful register/login cycle works.
- Passwords stored as hashes.
- Invalid login returns 401.

---

## 🔹 Task 3 — Web: Auth pages + protected dashboard

**Branch:** `feat/web-auth-ui`  
**Owner:** Dev A

### Details

- Create `/register` and `/login` pages with forms.
- POST to API endpoints with `credentials: 'include'`.
- On success → redirect to `/dashboard`.
- `/dashboard` page:
  - Calls `/me`.
  - Redirects to `/login` if unauthenticated.

### Acceptance Criteria

- Register → login → dashboard flow works.
- Unauthenticated users redirected to login.

---

## 🔹 Task 4 — Schema: Workspaces & Memberships

**Branch:** `schema/workspaces`  
**Owner:** Dev B

### Details

- Add models in Prisma:

  ```prisma
  model Workspace {
    id          String        @id @default(cuid())
    name        String
    memberships Membership[]
    createdAt   DateTime      @default(now())
    updatedAt   DateTime      @updatedAt
  }

  model Membership {
    id          String    @id @default(cuid())
    role        Role
    userId      String
    workspaceId String
    user        User      @relation(fields: [userId], references: [id])
    workspace   Workspace @relation(fields: [workspaceId], references: [id])
    @@unique([userId, workspaceId])
  }

  enum Role { OWNER ADMIN MEMBER VIEWER }
  ```

# Task 5 & Task 6 — Workspaces API + Dashboard

These two tasks connect the backend and frontend so that users can **create and view workspaces** from the dashboard.

---

## 🔹 Task 5 — API: Workspaces CRUD

**Branch:** `feat/api-workspaces`  
**Owner:** Dev A

### Details

- Add two endpoints:

1. **Create workspace**

   - `POST /workspaces`
   - Request body: `{ "name": "My Workspace" }`
   - Logic:
     - Create new `Workspace`.
     - Add a `Membership` entry with role = `OWNER` for the current user.
   - Response:
     ```json
     { "data": { "id": "...", "name": "My Workspace" } }
     ```

2. **List workspaces**
   - `GET /workspaces`
   - Returns all workspaces where current user has membership.
   - Response:
     ```json
     {
       "data": [
         { "id": "...", "name": "Workspace 1" },
         { "id": "...", "name": "Workspace 2" }
       ]
     }
     ```

- Protect endpoints with JWT auth middleware.
- Add middleware stub that checks if user is authenticated.

### Acceptance Criteria

- Authenticated user can create a workspace.
- Authenticated user can list their workspaces.
- Unauthenticated requests return `401 Unauthorized`.

---

## 🔹 Task 6 — Web: Dashboard workspaces list + create

**Branch:** `feat/web-dashboard-workspaces`  
**Owner:** Dev B

### Details

- Update `/dashboard` page:

1. **Show workspaces**

   - Fetch `GET /workspaces` from API (with `credentials: 'include'`).
   - Display as cards or a simple list.

2. **Create workspace**
   - Add “New Workspace” button.
   - Modal with text input for workspace name.
   - On submit → POST to `/workspaces`.
   - Optimistically update UI (add new workspace to list immediately).

- Handle errors with simple alert or toast message.

### Acceptance Criteria

- Dashboard shows real workspace list from API.
- Creating a new workspace updates the UI immediately.
- Errors are visible to the user.

---

# ✅ Definition of Done

- Backend: `POST /workspaces` and `GET /workspaces` working and protected by JWT.
- Frontend: Dashboard lists workspaces and allows creating new ones.
- Full flow tested manually:
  1. Register → Login
  2. Go to `/dashboard`
  3. Create a workspace
  4. See it appear in the list
