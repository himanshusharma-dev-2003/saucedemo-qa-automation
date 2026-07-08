import { test, expect } from '@playwright/test';

/**
 * API Testing — Playwright's native APIRequestContext against JSONPlaceholder.
 *
 * Why JSONPlaceholder? (https://jsonplaceholder.typicode.com)
 *   • Free, no API key, no account, no rate-limits — runs in CI with zero setup
 *   • Mirrors real-world REST patterns: paginated lists, CRUD, 404s, auth-like
 *     error paths using the /users and /posts resources
 *   • Zero extra dependencies — Playwright's built-in `request` fixture handles it
 *
 * What recruiters check for:
 *   ✓ Status code assertions (not just "did it return something")
 *   ✓ Response body schema validation (field presence + types)
 *   ✓ Negative / error-path coverage (404 for unknown resource)
 *   ✓ POST / write-path coverage (create + response shape)
 *   ✓ Practical header assertions (Content-Type)
 *
 * Timeout: 15 s to handle occasional network latency gracefully.
 */

const API_BASE = 'https://jsonplaceholder.typicode.com';

test.describe('API — JSONPlaceholder REST endpoints @api', () => {
  test.setTimeout(15_000);

  // ─────────────────────────────────────────────────────────────────────────
  // GET — happy path: collection
  // ─────────────────────────────────────────────────────────────────────────

  test('GET /posts returns an array of 100 posts with correct shape', async ({ request }) => {
    const response = await request.get(`${API_BASE}/posts`);

    // 1. Status code
    expect(response.status(), 'GET /posts should return HTTP 200').toBe(200);

    // 2. Content-Type — always verify the contract, not just the data
    const contentType = response.headers()['content-type'];
    expect(contentType, 'Response should be JSON').toContain('application/json');

    // 3. Body — top-level is an array
    const posts = await response.json();
    expect(Array.isArray(posts), '/posts should return an array').toBe(true);
    expect(posts.length, 'JSONPlaceholder serves exactly 100 posts').toBe(100);

    // 4. Schema check on the first item — representative of all 100
    const firstPost = posts[0];
    expect(typeof firstPost.userId, 'userId should be a number').toBe('number');
    expect(typeof firstPost.id,     'id should be a number').toBe('number');
    expect(typeof firstPost.title,  'title should be a string').toBe('string');
    expect(typeof firstPost.body,   'body should be a string').toBe('string');
    expect(firstPost.title.length,  'title should be non-empty').toBeGreaterThan(0);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // GET — happy path: single resource
  // ─────────────────────────────────────────────────────────────────────────

  test('GET /posts/:id returns the correct single post', async ({ request }) => {
    const response = await request.get(`${API_BASE}/posts/1`);

    expect(response.status(), 'GET /posts/1 should return HTTP 200').toBe(200);

    const post = await response.json();
    expect(post.id,     'id should equal the requested resource id').toBe(1);
    expect(post.userId, 'userId should be present').toBeTruthy();
    expect(post.title,  'title should be a non-empty string').toBeTruthy();
    expect(post.body,   'body should be a non-empty string').toBeTruthy();
  });

  // ─────────────────────────────────────────────────────────────────────────
  // GET — query-parameter filtering
  // ─────────────────────────────────────────────────────────────────────────

  test('GET /posts?userId=1 filters posts to the specified user', async ({ request }) => {
    const response = await request.get(`${API_BASE}/posts`, {
      params: { userId: 1 },
    });

    expect(response.status()).toBe(200);

    const posts = await response.json();
    expect(posts.length, 'userId=1 should return multiple posts').toBeGreaterThan(0);

    // Every post in the filtered result must belong to userId 1
    for (const post of posts) {
      expect(post.userId, `Expected every post to have userId 1, got ${post.userId}`).toBe(1);
    }
  });

  // ─────────────────────────────────────────────────────────────────────────
  // POST — create resource (write path)
  // ─────────────────────────────────────────────────────────────────────────

  test('POST /posts creates a resource and returns 201 with the payload echoed', async ({ request }) => {
    const payload = { title: 'QA Automation Post', body: 'Created by Playwright API test', userId: 1 };

    const response = await request.post(`${API_BASE}/posts`, { data: payload });

    // JSONPlaceholder returns 201 for POST requests
    expect(response.status(), 'POST should return HTTP 201 Created').toBe(201);

    const created = await response.json();

    // Server echoes the request body plus assigns a server-generated id
    expect(created.title,  'Response should echo the title').toBe(payload.title);
    expect(created.body,   'Response should echo the body').toBe(payload.body);
    expect(created.userId, 'Response should echo the userId').toBe(payload.userId);
    expect(created.id,     'Server should assign a numeric resource id').toBeTruthy();
    expect(typeof created.id).toBe('number');
  });

  // ─────────────────────────────────────────────────────────────────────────
  // GET — error / negative path
  // ─────────────────────────────────────────────────────────────────────────

  test('GET /posts/:id returns 404 for a non-existent resource', async ({ request }) => {
    // JSONPlaceholder only has posts 1-100; ID 9999 does not exist
    const response = await request.get(`${API_BASE}/posts/9999`);

    expect(response.status(), 'Unknown post ID should return HTTP 404').toBe(404);

    // JSONPlaceholder returns {} for 404 — confirm no post data is present
    const body = await response.json();
    expect(body.id,    '404 body should not contain an id field').toBeUndefined();
    expect(body.title, '404 body should not contain a title field').toBeUndefined();
  });

  // ─────────────────────────────────────────────────────────────────────────
  // GET — nested / relational endpoint
  // ─────────────────────────────────────────────────────────────────────────

  test('GET /posts/:id/comments returns comments belonging to the post', async ({ request }) => {
    const response = await request.get(`${API_BASE}/posts/1/comments`);

    expect(response.status(), 'GET /posts/1/comments should return HTTP 200').toBe(200);

    const comments = await response.json();
    expect(Array.isArray(comments), 'comments should be an array').toBe(true);
    expect(comments.length, 'Post 1 should have comments').toBeGreaterThan(0);

    // Each comment must have the required fields and belong to the correct post
    for (const comment of comments) {
      expect(comment.postId, 'Each comment should reference postId 1').toBe(1);
      expect(typeof comment.id,    'id should be a number').toBe('number');
      expect(typeof comment.name,  'name should be a string').toBe('string');
      expect(typeof comment.email, 'email should be a string').toBe('string');
      expect(comment.email,        'email should contain @').toContain('@');
      expect(typeof comment.body,  'body should be a string').toBe('string');
    }
  });
});
