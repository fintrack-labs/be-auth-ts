CREATE TABLE "fintrack-labs".groups (
    group_id VARCHAR(50) PRIMARY KEY,
    group_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by VARCHAR(50),
    updated_at TIMESTAMP WITH TIME ZONE,
    updated_by VARCHAR(50),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by VARCHAR(50),
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL
);