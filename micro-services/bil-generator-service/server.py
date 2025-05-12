from flask import Flask
from flask_cors import CORS
from routes.bilRoutes import bil_routes
import os

app = Flask(__name__)
CORS(app)

app.register_blueprint(bil_routes)

# Criar pasta de PDFs se não existir
if not os.path.exists("boletos"):
    os.makedirs("boletos")

@app.route("/")
def home():
    return {"mensagem": "Serviço de Boletos Ativo"}

if __name__ == "__main__":
    app.run(debug=True, port=5010)