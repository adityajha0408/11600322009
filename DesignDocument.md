# URL Shortener Microservice - Design Document

## 1. Technology Choices

* **Runtime Environment:** Node.js
* **Framework:** Express.js
* **Language:** TypeScript
* **Database:** In-Memory `Map`
* **Unique ID Generation:** `nanoid` library
* **Geolocation:** `geoip-lite` library

## 2. Justifications

* **Node.js & Express.js:** Chosen for their high performance in I/O-bound operations and the vast ecosystem of middleware, making it ideal for a lightweight API-centric microservice.
* **TypeScript:** Selected to ensure code quality, maintainability, and robust type-safety, which is critical for production-grade applications.
* **In-Memory Storage:** For this 2-hour evaluation, an in-memory JavaScript `Map` is used as the database to ensure rapid development and eliminate external dependencies. For a production system, this would be replaced with a persistent database like Redis (for speed and expiry features) or PostgreSQL.
* **`nanoid`:** Chosen for generating unique, URL-friendly shortcodes. It is fast, collision-resistant, and more modern than UUIDs for this use case.
* **`geoip-lite`:** A lightweight library for coarse-grained geolocation based on IP address, sufficient for the analytics requirement.

## 3. Data Modeling

### ShortURL Object
```typescript
{
  shortcode: string;        // The unique short identifier
  originalUrl: string;      // The destination URL
  createdAt: string;        // ISO 8601 timestamp
  expiresAt: string;        // ISO 8601 timestamp
}