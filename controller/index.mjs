import express from 'express';
import cors from 'cors';

import Database from './database.mjs';

const app = express();
const port = 68;
const endpoint = `http://localhost:${port}/api`;
const database = new Database(
    `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASS || ''}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT}/${process.env.DB_NAME || 'postgres'}`
);

app.use(cors());
app.use(express.json());

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const ok   = (res, data)         => res.json({ success: true,  data });
const fail = (res, status, msg)  => res.status(status).json({ success: false, error: msg });

const wrap = (fn) => async (req, res) => {
    try {
        await fn(req, res);
    } catch (err) {
        console.error(err);
        fail(res, 500, 'Internal server error');
    }
};

// ─── LOCATIONS ────────────────────────────────────────────────────────────────

// GET /api/locations          → all locations
// GET /api/locations/:id      → single location
app.get('/api/locations', wrap(async (req, res) => {
    const locations = await database.getAllLocations();
    ok(res, locations);
}));

app.get('/api/locations/:id', wrap(async (req, res) => {
    const location = await database.getLocation(Number(req.params.id));
    if (!location) return fail(res, 404, 'Location not found');
    ok(res, location);
}));

// POST /api/locations         → create location
// Body: { name, country, latitude, longitude }
app.post('/api/locations', wrap(async (req, res) => {
    const { name, country, latitude, longitude } = req.body;
    if (!name || !country) return fail(res, 400, 'name and country are required');

    const location = await database.createLocation({ name, country, latitude, longitude });
    res.status(201).json({ success: true, data: location });
}));

// PUT /api/locations/:id      → update location (partial)
// Body: any subset of { name, country, latitude, longitude }
app.put('/api/locations/:id', wrap(async (req, res) => {
    const { name, country, latitude, longitude } = req.body;
    const location = await database.updateLocation(
        Number(req.params.id),
        { name, country, latitude, longitude }
    );
    if (!location) return fail(res, 404, 'Location not found');
    ok(res, location);
}));

// DELETE /api/locations/:id   → delete location
app.delete('/api/locations/:id', wrap(async (req, res) => {
    const location = await database.deleteLocation(Number(req.params.id));
    if (!location) return fail(res, 404, 'Location not found');
    ok(res, { deleted: location });
}));

// ─── IMPACTS ──────────────────────────────────────────────────────────────────

// GET /api/impacts                          → all impacts (joined with location)
// GET /api/impacts/:id                      → single impact
// GET /api/impacts?location_id=<n>          → impacts filtered by location
app.get('/api/impacts', wrap(async (req, res) => {
    const { location_id } = req.query;
    const impacts = location_id
        ? await database.getImpactsByLocation(Number(location_id))
        : await database.getAllImpacts();
    ok(res, impacts);
}));

app.get('/api/impacts/:id', wrap(async (req, res) => {
    const impact = await database.getImpact(Number(req.params.id));
    if (!impact) return fail(res, 404, 'Impact not found');
    ok(res, impact);
}));

// POST /api/impacts           → create impact
// Body: { locationId, name, year, massKg, classification, wasObserved }
app.post('/api/impacts', wrap(async (req, res) => {
    const { locationId, name, year, massKg, classification, wasObserved } = req.body;
    if (!locationId || !name) return fail(res, 400, 'locationId and name are required');

    const impact = await database.createImpact(
        { locationId, name, year, massKg, classification, wasObserved }
    );
    res.status(201).json({ success: true, data: impact });
}));

// PUT /api/impacts/:id        → update impact (partial)
// Body: any subset of { locationId, name, year, massKg, classification, wasObserved }
app.put('/api/impacts/:id', wrap(async (req, res) => {
    const { locationId, name, year, massKg, classification, wasObserved } = req.body;
    const impact = await database.updateImpact(
        Number(req.params.id),
        { locationId, name, year, massKg, classification, wasObserved }
    );
    if (!impact) return fail(res, 404, 'Impact not found');
    ok(res, impact);
}));

// DELETE /api/impacts/:id     → delete impact
app.delete('/api/impacts/:id', wrap(async (req, res) => {
    const impact = await database.deleteImpact(Number(req.params.id));
    if (!impact) return fail(res, 404, 'Impact not found');
    ok(res, { deleted: impact });
}));

// ─── ROOT ─────────────────────────────────────────────────────────────────────

app.get('/api/', (req, res) => {
    ok(res, {
        message: 'Meteor impacts API',
        routes: {
            locations: `${endpoint}/locations`,
            impacts:   `${endpoint}/impacts`,
        }
    });
});

app.listen(port, () => {
    console.log(`Listening on ${endpoint}`)
});
