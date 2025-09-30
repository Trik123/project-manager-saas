# Roadmap

## Sprint 1 (Auth & Setup)

Goal: Running repo with API + Web + Auth + Workspaces.

### Tasks

- #1 schema: User model (Prisma)
- #2 feat(api): register/login + /me
- #3 feat(web): login/register pages + protected dashboard
- #4 schema: Workspace & Membership
- #5 feat(api): workspaces CRUD
- #6 feat(web): dashboard lists/creates workspaces

### Assignment

- Dev A → #1, #3, #5
- Dev B → #2, #4, #6  
  _(Review each other’s PRs — both touch backend & frontend)_

---

## Sprint 2 (Projects & Tasks)

Goal: Workspaces contain projects; projects contain columns + tasks with drag & drop.

### Tasks

- #7 schema: Project, Column, Task
- #8 feat(api): projects CRUD
- #9 feat(api): columns & tasks CRUD
- #10 feat(web): project board UI (kanban with DnD)
- #11 test(e2e): happy path auth → workspace → project → task

### Assignment

- Dev A → #7, #10
- Dev B → #8, #9  
  _(Both → #11 E2E tests)_

---

## Sprint 3 (Realtime & Polish)

Goal: Comments + activity feed + realtime.

### Tasks

- #12 schema: Comment model
- #13 feat(api): comments CRUD
- #14 feat(api): Socket.IO realtime for comments
- #15 feat(web): task drawer with comments feed
- #16 test(e2e): realtime comment scenario

### Assignment

- Swap focus:
  - Dev A → #12, #13
  - Dev B → #14, #15  
    _(Pair on #16 tests)_

---

## Sprint 4 (Stretch Features)

Goal: Nice-to-have but not required for MVP.

- File uploads (MinIO/S3)
- Search + filters
- Notifications (in-app + email)
