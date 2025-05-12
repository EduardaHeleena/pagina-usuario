from flask import Blueprint
from controllers.bilController import visualizar_boleto, download_boleto

bil_routes = Blueprint("bil_routes", __name__)

bil_routes.get("/boleto/<invoice_number>/visualizar")(visualizar_boleto)
bil_routes.get("/boleto/<invoice_number>/download")(download_boleto)
