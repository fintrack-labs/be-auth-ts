CREATE TABLE "fintrack-labs".users (
    user_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by VARCHAR(50),
    updated_at TIMESTAMP WITH TIME ZONE,
    updated_by VARCHAR(50),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by VARCHAR(50),
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL
);