from flask import Blueprint
from controllers.fiscalController import listar_notas_fiscais, visualizar_pdf, download_pdf

fiscal_routes = Blueprint("fiscal_routes", __name__)

fiscal_routes.get("/nota-fiscal")(listar_notas_fiscais)
fiscal_routes.get("/nota-fiscal/<invoice_number>/visualizar")(visualizar_pdf)
fiscal_routes.get("/nota-fiscal/<invoice_number>/download")(download_pdf)

