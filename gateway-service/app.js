// app.js

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL;
const CART_SERVICE_URL = process.env.CART_SERVICE_URL;
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Test endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Gateway-service running!' });
});

// Helper function for forwarding requests using native fetch
async function forwardRequest(serviceUrl, req, customPath = '') {
  const targetUrl =
    serviceUrl +
    (customPath ? customPath : req.originalUrl.replace(/^\/api\/[a-z]+/, ''));

  // Buat header baru yang lebih aman untuk forwarding
  const headers = {
    'Content-Type': 'application/json', // pastikan konsisten
    ...(req.headers.authorization && { Authorization: req.headers.authorization }),
  };

  // Untuk GET, jangan kirim body
  const fetchOptions = {
    method: req.method,
    headers,
  };

  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    fetchOptions.body = JSON.stringify(req.body);
  }

  const response = await fetch(targetUrl, fetchOptions);

  const contentType = response.headers.get('content-type');
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  return { status: response.status, data };
}


// async function forwardRequest(serviceUrl, req, customPath = '') {
//   const targetUrl =
//     serviceUrl +
//     (customPath ? customPath : req.originalUrl.replace(/^\/api\/[a-z]+/, ''));

//   // Copy all headers, kecuali host (untuk keamanan/compatibility)
//   const headers = { ...req.headers };
//   delete headers.host;

//   // Untuk GET, jangan kirim body
//   const fetchOptions = {
//     method: req.method,
//     headers,
//   };

//   if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
//     fetchOptions.body = JSON.stringify(req.body);
//     if (!headers['content-type']) {
//       fetchOptions.headers['content-type'] = 'application/json';
//     }
//   }

//   // Call downstream service
//   const response = await fetch(targetUrl, fetchOptions);

//   // Handle non-JSON response gracefully
//   const contentType = response.headers.get('content-type');
//   let data;
//   if (contentType && contentType.includes('application/json')) {
//     data = await response.json();
//   } else {
//     data = await response.text();
//   }

//   return { status: response.status, data };
// }

// === PRODUCT SERVICE ENDPOINT ===
app.use('/api/products', async (req, res, next) => {
  try {
    const result = await forwardRequest(PRODUCT_SERVICE_URL, req);
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

// app.get('/api/products', async (req, res, next) => {
//   try {
//     const response = await fetch(`${PRODUCT_SERVICE_URL}/products`);
//     const data = await response.json();
//     res.status(response.status).json(data);
//   } catch (error) {
//     next(error); // Lanjut ke error handler
//   }
// });

// === CART SERVICE ENDPOINT ===
// Gateway - mapping path ke cart-service
app.use('/api/cart', async (req, res, next) => {
  try {
    // Buang prefix '/api' saja, agar hasilnya '/cart/items', '/cart/remove', dll
    const path = req.originalUrl.replace('/api', '');
    const result = await forwardRequest(CART_SERVICE_URL, req, path);
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

// app.use('/api/cart', async (req, res, next) => {
//   try {
//     const url = `${CART_SERVICE_URL}${req.originalUrl.replace('/api/cart', '')}`;
//     const response = await fetch(url, {
//       method: req.method,
//       headers: {
//         'Content-Type': 'application/json',
//         ...(req.headers.authorization && { Authorization: req.headers.authorization })
//       },
//       body: req.method === 'GET' ? undefined : JSON.stringify(req.body)
//     });
//     const data = await response.json();
//     res.status(response.status).json(data);
//   } catch (error) {
//     next(error);
//   }
// });




// === AUTH SERVICE ENDPOINT ===
app.post('/api/login', async (req, res, next) => {
  try {
    const result = await forwardRequest(AUTH_SERVICE_URL, req, '/auth/login');
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

// app.post('/api/login', async (req, res, next) => {
//   try {
//     const response = await fetch(`${AUTH_SERVICE_URL}/login`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(req.body)
//     });
//     const data = await response.json();
//     res.status(response.status).json(data);
//   } catch (error) {
//     next(error);
//   }
// });



app.post('/api/register', async (req, res, next) => {
  try {
    const result = await forwardRequest(AUTH_SERVICE_URL, req, '/auth/register');
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

// === Error Handler (Fallback) ===
app.use((err, req, res, next) => {
  console.error('Gateway error:', err);
  res
    .status(503)
    .json({ error: 'Service Unavailable. Please try again later.' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Gateway service listening at http://localhost:${PORT}`);
});


