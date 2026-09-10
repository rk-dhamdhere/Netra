import psycopg2
import os
from dotenv import load_dotenv
from pgvector.psycopg2 import register_vector

load_dotenv()

# Load PostgreSQL credentials from your .env
PG_HOST = os.getenv("PG_HOST", "localhost")
PG_PORT = os.getenv("PG_PORT", "5432")
PG_DB = os.getenv("PG_DB", "investigraph_db")
PG_USER = os.getenv("PG_USER", "dev_user")
PG_PASSWORD = os.getenv("PG_PASSWORD", "dev_password")

def get_db_connection():
    """Establishes a connection to PostgreSQL and registers the pgvector type."""
    conn = psycopg2.connect(
        host=PG_HOST,
        port=PG_PORT,
        dbname=PG_DB,
        user=PG_USER,
        password=PG_PASSWORD
    )
    # This securely registers pgvector's custom vector data type to the connection
    register_vector(conn)
    return conn

def insert_facial_embedding(entity_id: str, embedding: list[float]):
    """Inserts a 768-dimensional facial embedding into the vector store."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO facial_embeddings (entity_id, embedding) VALUES (%s, %s)",
                (entity_id, embedding)
            )
        conn.commit()
        print(f"✅ Embedding for {entity_id} successfully saved to pgvector.")
    except Exception as e:
        print(f"Error inserting vector: {e}")
        conn.rollback()
    finally:
        conn.close()

def search_nearest_faces(target_embedding: list[float], limit: int = 5):
    """
    Performs an approximate nearest neighbor (ANN) search using Cosine Similarity.
    """
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            # The <=> operator computes cosine distance.
            # Cosine similarity is calculated as 1 - cosine_distance.
            cur.execute("""
                SELECT entity_id, 1 - (embedding <=> %s::vector) AS similarity
                FROM facial_embeddings
                ORDER BY embedding <=> %s::vector
                LIMIT %s
            """, (target_embedding, target_embedding, limit))
            
            results = cur.fetchall()
            return [{"entity_id": row[0], "similarity_score": row[1]} for row in results]
    except Exception as e:
        print(f"Error during vector search: {e}")
        return []
    finally:
        conn.close()