ALTER TABLE users
    ALTER COLUMN status SET DEFAULT 'REGISTERED',
    ADD COLUMN activation_token_hash VARCHAR(64),
    ADD COLUMN activation_token_expires_at TIMESTAMP WITH TIME ZONE;