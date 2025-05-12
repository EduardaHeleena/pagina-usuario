from flask import jsonify, send_file
from config.database import get_db_connection
from utils.pdf_generator import gerar_pdf_nota_fiscal
from datetime import timedelta, datetime
from decimal import Decimal
import traceback
import os

PDF_DIR = "pdfs"

def buscar_dados_fatura_por_invoice_number(invoice_number):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM invoices WHERE invoice_number = %s", (invoice_number,))
        fatura = cursor.fetchone()
        return fatura
    finally:
        cursor.close()
        conn.close()

def gerar_dados_pdf(fatura):
    return {
        "id": fatura["id"],
        "data_emissao": fatura["issue_date"],
        "hora_emissao": "10:00:00",
        "emitente_nome": "Empresa Exemplo LTDA",
        "emitente_cnpj": "00.000.000/0001-00",
        "emitente_endereco": "Rua das Notas, 123 - Cidade",
        "tomador_nome": f"Cliente #{fatura['id_client']}",
        "tomador_cnpj": "11.111.111/1111-11",
        "tomador_endereco": "Av. do Cliente, 456 - Bairro",
        "descricao_servico": f"Serviço referente à fatura {fatura['invoice_number']}",
        "valor_servico": float(fatura["amount"]),
        "iss_retido": 0.00,
        "irrf": 0.00,
        "csll": 0.00,
        "pis": 0.00,
        "cofins": 0.00,
        "valor_liquido": float(fatura["amount"]),
    }

def visualizar_pdf(invoice_number):
    fatura = buscar_dados_fatura_por_invoice_number(invoice_number)
    if not fatura:
        return jsonify({"erro": "Fatura não encontrada"}), 404

    dados_pdf = gerar_dados_pdf(fatura)
    caminho_pdf = os.path.join(PDF_DIR, f"nota_{invoice_number}.pdf")
    gerar_pdf_nota_fiscal(dados_pdf, caminho_pdf)

    return send_file(caminho_pdf, mimetype="application/pdf")

def download_pdf(invoice_number):
    fatura = buscar_dados_fatura_por_invoice_number(invoice_number)
    if not fatura:
        return jsonify({"erro": "Fatura não encontrada"}), 404

    dados_pdf = gerar_dados_pdf(fatura)
    caminho_pdf = os.path.join(PDF_DIR, f"nota_{invoice_number}.pdf")
    gerar_pdf_nota_fiscal(dados_pdf, caminho_pdf)

    return send_file(caminho_pdf, as_attachment=True, download_name=f"nota_fiscal_{invoice_number}.pdf")

def convert_types(obj):
    for k, v in obj.items():
        if isinstance(v, timedelta):
            obj[k] = str(v)
        elif isinstance(v, Decimal):
            obj[k] = float(v)

    if "data_emissao" in obj and "hora_emissao" in obj:
        try:
            dt_str = f"{obj['data_emissao']} {obj['hora_emissao']}"
            obj["data_emissao_completa"] = datetime.strptime(dt_str, "%Y-%m-%d %H:%M:%S").isoformat()
        except Exception as e:
            print("Erro ao compor data_emissao_completa:", e)

    return obj

def listar_notas_fiscais():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM nota_fiscal")
        notas = cursor.fetchall()
        cursor.close()
        conn.close()

        notas_serializaveis = [convert_types(nota) for nota in notas]

        return jsonify(notas_serializaveis)
    except Exception as e:
        print("Erro ao listar notas fiscais:", e)
        traceback.print_exc()
        return jsonify({"erro": "Erro ao buscar notas fiscais"}), 500
