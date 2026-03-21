CREATE TABLE admin_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token VARCHAR(255) NOT NULL UNIQUE,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);
CREATE INDEX idx_admin_tokens_token ON admin_tokens(token);
ALTER TABLE admin_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin tokens solo sistema" ON admin_tokens FOR ALL USING (FALSE);
