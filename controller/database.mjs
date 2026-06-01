import postgres from "postgres";

export default class Database {
    #connectionString;
    #conn;

    constructor(connectionString) {
        this.#connectionString = connectionString;

        this.initiateConnection();
    }

    initiateConnection() {
        try {
            this.#conn = postgres(this.#connectionString);
            console.log(this.#conn)
        }
        catch (error) {
            console.error('Failed to connect: ', error);
        }
    }

    // ─── LOCATIONS ────────────────────────────────────────────────

    async createLocation({ name, country, latitude, longitude }) {
        const [row] = await this.#conn`
            INSERT INTO locations (name, country, latitude, longitude)
            VALUES (${name}, ${country}, ${latitude}, ${longitude})
            RETURNING *
        `;
        return row;
    }

    async getLocation(locationId) {
        const [row] = await this.#conn`
            SELECT * FROM locations
            WHERE location_id = ${locationId}
        `;
        return row ?? null;
    }

    async getAllLocations() {
        return this.#conn`
            SELECT * FROM locations
            ORDER BY location_id
        `;
    }

    async updateLocation(locationId, { name, country, latitude, longitude }) {
        const [row] = await this.#conn`
            UPDATE locations
            SET
                name      = COALESCE(${name}      ?? null, name),
                country   = COALESCE(${country}   ?? null, country),
                latitude  = COALESCE(${latitude}  ?? null, latitude),
                longitude = COALESCE(${longitude} ?? null, longitude)
            WHERE location_id = ${locationId}
            RETURNING *
        `;
        return row ?? null;
    }

    async deleteLocation(locationId) {
        const [row] = await this.#conn`
            DELETE FROM locations
            WHERE location_id = ${locationId}
            RETURNING *
        `;
        return row ?? null;
    }

    // ─── IMPACTS ──────────────────────────────────────────────────

    async createImpact({ locationId, name, year, massKg, classification, wasObserved = false }) {
        const [row] = await this.#conn`
            INSERT INTO impacts (location_id, name, year, mass_kg, classification, was_observed)
            VALUES (${locationId}, ${name}, ${year}, ${massKg}, ${classification}, ${wasObserved})
            RETURNING *
        `;
        return row;
    }

    async getImpact(impactId) {
        const [row] = await this.#conn`
            SELECT
                i.*,
                l.name    AS location_name,
                l.country AS location_country
            FROM impacts i
            JOIN locations l USING (location_id)
            WHERE i.impact_id = ${impactId}
        `;
        return row ?? null;
    }

    async getImpactsByLocation(locationId) {
        return this.#conn`
            SELECT * FROM impacts
            WHERE location_id = ${locationId}
            ORDER BY year
        `;
    }

    async getAllImpacts() {
        return this.#conn`
            SELECT
                i.*,
                l.name    AS location_name,
                l.country AS location_country
            FROM impacts i
            JOIN locations l USING (location_id)
            ORDER BY i.year
        `;
    }

    async updateImpact(impactId, { locationId, name, year, massKg, classification, wasObserved }) {
        const [row] = await this.#conn`
            UPDATE impacts
            SET
                location_id    = COALESCE(${locationId}    ?? null, location_id),
                name           = COALESCE(${name}          ?? null, name),
                year           = COALESCE(${year}          ?? null, year),
                mass_kg        = COALESCE(${massKg}        ?? null, mass_kg),
                classification = COALESCE(${classification}?? null, classification),
                was_observed   = COALESCE(${wasObserved}   ?? null, was_observed)
            WHERE impact_id = ${impactId}
            RETURNING *
        `;
        return row ?? null;
    }

    async deleteImpact(impactId) {
        const [row] = await this.#conn`
            DELETE FROM impacts
            WHERE impact_id = ${impactId}
            RETURNING *
        `;
        return row ?? null;
    }

    // ─── CLEANUP ──────────────────────────────────────────────────

    async disconnect() {
        await this.#conn.end();
    }
}