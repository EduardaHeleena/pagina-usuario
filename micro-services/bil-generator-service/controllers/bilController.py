from flask import jsonify, send_file
from config.database import get_db_connection
from utils.pdf_generator import gerar_boleto_pdf
import os
import traceback
from decimal import Decimal
from datetime import timedelta

PDF_DIR = "boletos"

def buscar_dados_completos(invoice_number):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Buscar fatura
        cursor.execute("SELECT * FROM invoices WHERE invoice_number = %s", (invoice_number,))
        fatura = cursor.fetchone()
        if not fatura:
            return None

        # Buscar dados complementares da nota fiscal
        cursor.execute("SELECT * FROM nota_fiscal WHERE id = %s", (fatura["id"],))
        nota = cursor.fetchone()

        if nota:
            fatura.update(nota)

        return fatura
    finally:
        cursor.close()
        conn.close()

def visualizar_boleto(invoice_number):
    try:
        fatura = buscar_dados_completos(invoice_number)
        if not fatura:
            return jsonify({"erro": "Fatura não encontrada"}), 404

        caminho_pdf = os.path.join(PDF_DIR, f"boleto_{invoice_number}.pdf")
        gerar_boleto_pdf(fatura, caminho_pdf)

        return send_file(caminho_pdf, mimetype="application/pdf")
    except Exception as e:
        print("Erro ao visualizar boleto:", e)
        traceback.print_exc()
        return jsonify({"erro": "Erro ao gerar boleto"}), 500

def download_boleto(invoice_number):
    try:
        fatura = buscar_dados_completos(invoice_number)
        if not fatura:
            return jsonify({"erro": "Fatura não encontrada"}), 404

        caminho_pdf = os.path.join(PDF_DIR, f"boleto_{invoice_number}.pdf")
        gerar_boleto_pdf(fatura, caminho_pdf)

        return send_file(caminho_pdf, as_attachment=True, download_name=f"boleto_{invoice_number}.pdf")
    except Exception as e:
        print("Erro ao fazer download do boleto:", e)
        traceback.print_exc()
        return jsonify({"erro": "Erro ao gerar boleto"}), 500

def convert_types(obj):
    for k, v in obj.items():
        if isinstance(v, timedelta):
            obj[k] = str(v)
        elif isinstance(v, Decimal):
            obj[k] = float(v)
    return obj
