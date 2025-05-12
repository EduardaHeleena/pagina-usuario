from flask import Flask
from flask_cors import CORS
from routes.fiscalRoutes import fiscal_routes
import os

app = Flask(__name__)
CORS(app)

app.register_blueprint(fiscal_routes)

# Criar pasta de PDFs se não existir
if not os.path.exists("pdfs"):
    os.makedirs("pdfs")

@app.route("/")
def home():
    return {"mensagem": "Serviço de Nota Fiscal Ativo"}

if __name__ == "__main__":
    app.run(debug=True, port=5005)
