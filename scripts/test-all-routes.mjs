import http from 'http';

const BASE_URL = 'http://localhost:3000';

const routes = [
  '/',
  '/catalog',
  '/cart',
  '/checkout',
  '/wishlist',
  '/about',
  '/track',
  '/contact',
  '/warranty',
  '/returns',
  '/shipping',
  '/terms',
  '/privacy',
  '/admin',
  '/admin/products',
  '/admin/orders',
  '/admin/theme',
  '/admin/users',
  '/admin/media',
  '/product/canon-ef-50mm-f-1-8-stm-standard-prime-lens-black-50-mm-2',
  '/robots.txt',
  '/sitemap.xml',
];

async function checkRoute(route) {
  return new Promise((resolve) => {
    http.get(`${BASE_URL}${route}`, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        resolve({
          route,
          status: res.statusCode,
          headers: res.headers,
          hasContent: body.length > 0,
        });
      });
    }).on('error', (err) => {
      resolve({
        route,
        status: 'ERROR',
        error: err.message,
      });
    });
  });
}

async function run() {
  console.log(`Starting automated E2E route verification on ${BASE_URL}...`);
  let passed = 0;
  let failed = 0;

  for (const route of routes) {
    const res = await checkRoute(route);
    if (res.status === 200) {
      console.log(`✓ [200 OK] ${route}`);
      passed++;
    } else {
      console.error(`✗ [${res.status}] ${route}`);
      failed++;
    }
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed across ${routes.length} total tested routes.`);
  if (failed > 0) {
    process.exit(1);
  }
}

run();
