from config.database import get_db_connection
from datetime import date
from pyboleto.bank.santander import Santander
from pyboleto.pdf import BoletoPDF
import os

def buscar_dados_completos(invoice_number):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # Buscar fatura
        cursor.execute("SELECT * FROM invoices WHERE invoice_number = %s", (invoice_number,))
        fatura = cursor.fetchone()
        if not fatura:
            return None

        # Buscar nota fiscal vinculada
        cursor.execute("SELECT * FROM nota_fiscal WHERE id = %s", (fatura["id"],))
        nota = cursor.fetchone()

        if nota:
            fatura.update(nota)

        return fatura
    finally:
        cursor.close()
        conn.close()

def gerar_boleto_pdf(fatura, caminho_pdf):
    os.makedirs(os.path.dirname(caminho_pdf), exist_ok=True)

    boleto = BoletoSantander()
    boleto.cedente = fatura.get('emitente_nome', 'Empresa Exemplo LTDA')
    boleto.cedente_documento = fatura.get('emitente_cnpj', '00.000.000/0001-00')
    boleto.cedente_endereco = fatura.get('emitente_endereco', 'Endereço não informado')

    boleto.agencia = '1234'
    boleto.conta = '56789'
    boleto.convenio = 1234567

    boleto.nosso_numero = str(fatura['invoice_number'])
    boleto.numero_documento = str(fatura['invoice_number'])
    boleto.data_vencimento = date.fromisoformat(str(fatura['due_date']))
    boleto.data_documento = date.fromisoformat(str(fatura['issue_date']))
    boleto.data_processamento = boleto.data_documento
    boleto.valor_documento = float(fatura['amount']) + float(fatura.get('fees', 0.0))

    boleto.sacado = [
        fatura.get("tomador_nome", f"Cliente #{fatura['id_client']}"),
        fatura.get("tomador_endereco", "Endereço não informado"),
        fatura.get("tomador_cnpj", "00.000.000/0000-00")
    ]

    with open(caminho_pdf, 'wb') as f:
        boleto_pdf = BoletoPDF(f)
        boleto_pdf.drawBoleto(boleto)
        boleto_pdf.save()
