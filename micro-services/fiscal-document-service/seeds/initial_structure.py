import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

def criar_tabela_nota_fiscal():
    conn = None  # garante que a variável exista mesmo se der erro

    try:
        print("Conectando ao banco de dados...")

        conn = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME"),
            port=int(os.getenv("DB_PORT")),
            charset='utf8mb4',
            collation='utf8mb4_general_ci'
        )

        cursor = conn.cursor()

        # ⚠️ Importante: força collation manualmente
        cursor.execute("SET NAMES 'utf8mb4' COLLATE 'utf8mb4_general_ci';")

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS nota_fiscal (
            id INT PRIMARY KEY,  -- Mesmo ID da fatura
            data_emissao DATE,
            hora_emissao TIME,
            emitente_nome VARCHAR(255),
            emitente_cnpj VARCHAR(20),
            emitente_endereco VARCHAR(255),
            tomador_nome VARCHAR(255),
            tomador_cnpj VARCHAR(20),
            tomador_endereco VARCHAR(255),
            descricao_servico TEXT,
            valor_servico DECIMAL(10,2),
            iss_retido BOOLEAN,
            irrf DECIMAL(10,2),
            csll DECIMAL(10,2),
            pis DECIMAL(10,2),
            cofins DECIMAL(10,2),
            valor_liquido DECIMAL(10,2),
            FOREIGN KEY (id) REFERENCES invoices(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        """)

        conn.commit()
        print("Tabela criada com sucesso.")
    except Exception as e:
        print(f"Erro ao criar a tabela: {e}")
    finally:
        if conn is not None and conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == "__main__":
    criar_tabela_nota_fiscal()
