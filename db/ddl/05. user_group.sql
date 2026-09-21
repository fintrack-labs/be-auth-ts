CREATE TABLE "fintrack-labs".user_groups (
    user_id VARCHAR(50) REFERENCES "fintrack-labs".users(user_id) ON DELETE CASCADE,
    group_id VARCHAR(50) REFERENCES "fintrack-labs".groups(group_id) ON DELETE CASCADE,
    
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    assigned_by VARCHAR(50),
    
    PRIMARY KEY (user_id, group_id)
);