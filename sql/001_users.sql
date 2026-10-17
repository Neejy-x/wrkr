CREATE TABLE IF NOT EXISTS users(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'USER' CHECK(role IN ('ADMIN', 'USER')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)