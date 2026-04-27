
const client = require("prom-client");

// Collect default system metrics (CPU, memory, etc.)
client.collectDefaultMetrics();

// Normalize routes to avoid high cardinality
const normalizeRoute = (req) => {
  if (req.route && req.route.path) return req.route.path;
  return req.path.replace(/\/\d+/g, "/:id");
};

// 🔹 Total HTTP Requests
const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total HTTP Requests",
  labelNames: ["method", "route", "status"],
});

// 🔹 Request Duration
const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request latency",
  labelNames: ["method", "route", "status"],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5],
});

// 🔹 Middleware
const metricsMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const route = normalizeRoute(req);
    const duration = (Date.now() - start) / 1000;

    httpRequestsTotal.inc({
      method: req.method,
      route,
      status: res.statusCode,
    });

    httpRequestDuration.observe(
      {
        method: req.method,
        route,
        status: res.statusCode,
      },
      duration
    );
  });

  next();
};

// 🔹 Metrics endpoint handler
const metricsHandler = async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
};

module.exports = {
  metricsMiddleware,
  metricsHandler,
};