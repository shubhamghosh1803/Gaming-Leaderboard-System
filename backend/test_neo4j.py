
from neo4j_database import verify_connection, close_connection

try:
    message = verify_connection()
    print(message)

except Exception as error:
    print(f"Neo4j connection failed: {error}")

finally:
    close_connection()
