CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS facial_embeddings (
    entity_id TEXT PRIMARY KEY,
    embedding vector(128) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS facial_embeddings_embedding_idx
    ON facial_embeddings
    USING hnsw (embedding vector_cosine_ops);
