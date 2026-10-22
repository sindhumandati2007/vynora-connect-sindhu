# Vynora Connect — Campus & Events API Contract

**Owner:** Sindhu (Campus & Events Module)  
**Version:** 1.0 (Week 1 Foundation)  
**Target Base URL:** `/api/v1`

---

## 1. Endpoints Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/events` | List events with optional category/date filtering | Optional |
| `GET` | `/api/v1/events/:id` | Get full details of a specific event | Optional |
| `POST` | `/api/v1/events/:id/registrations` | Register authenticated user for an event | Yes |
| `DELETE` | `/api/v1/events/:id/registrations` | Cancel registration for current user | Yes |
| `GET` | `/api/v1/campus-services` | List student campus services & contacts | Optional |

---

## 2. Event Object Schema
```json
{
  "id": "evt_001",
  "title": "Inter-University Web3 & AI Hackathon 2026",
  "description": "48-hour collaborative build across partner universities.",
  "organizer": "Vynora Tech Club & IEEE Student Chapter",
  "category": "Hackathon",
  "startAt": "2026-10-25T09:00:00Z",
  "endAt": "2026-10-27T17:00:00Z",
  "registrationDeadline": "2026-10-24T23:59:59Z",
  "isOnline": false,
  "location": "Innovation Hub, Main Campus, Block C",
  "onlineMeetingUrl": null,
  "capacity": 150,
  "registeredCount": 84,
  "status": "UPCOMING",
  "eligibility": "Open to all verified college students"
}