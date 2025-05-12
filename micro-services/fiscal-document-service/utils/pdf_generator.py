from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors


def gerar_pdf_nota_fiscal(dados, caminho_arquivo):
    c = canvas.Canvas(caminho_arquivo, pagesize=A4)
    width, height = A4
    margin = 40
    y = height - margin

    def titulo(texto):
        c.setFont("Helvetica-Bold", 16)
        c.drawCentredString(width / 2, y, texto)

    def secao_titulo(titulo_texto):
        nonlocal y
        y -= 20
        c.setFont("Helvetica-Bold", 11)
        c.drawString(margin, y, titulo_texto)
        y -= 5
        c.line(margin, y, width - margin, y)
        y -= 10

    def campo(label, valor):
        nonlocal y
        c.setFont("Helvetica-Bold", 9)
        c.drawString(margin, y, f"{label}:")
        c.setFont("Helvetica", 9)
        c.drawString(margin + 100, y, str(valor))
        y -= 15

    # Título principal
    titulo("DANFSe v1.0 - Nota Fiscal de Serviços")
    y -= 30

    # Chave de acesso
    c.setFont("Helvetica", 9)
    c.setStrokeColor(colors.black)
    c.rect(margin, y - 20, width - 2 * margin, 20)
    c.drawCentredString(width / 2, y - 15, f"Chave de Acesso: {str(dados.get('id')).zfill(14)}")
    y -= 40

    # Data e hora
    campo("Data de Emissão", dados["data_emissao"])
    campo("Hora de Emissão", dados["hora_emissao"])

    # Seção Emitente
    secao_titulo("Emitente")
    campo("Nome", dados["emitente_nome"])
    campo("CNPJ", dados["emitente_cnpj"])
    campo("Endereço", dados["emitente_endereco"])

    # Seção Tomador
    secao_titulo("Tomador")
    campo("Nome", dados["tomador_nome"])
    campo("CNPJ", dados["tomador_cnpj"])
    campo("Endereço", dados["tomador_endereco"])

    # Seção Serviço
    secao_titulo("Serviço")
    campo("Descrição", dados["descricao_servico"])
    campo("Valor do Serviço", f"R$ {dados['valor_servico']:.2f}")

    # Seção Tributos
    secao_titulo("Tributos")
    campo("ISS Retido", "Sim" if dados["iss_retido"] else "Não")
    campo("IRRF", f"R$ {dados['irrf']:.2f}")
    campo("CSLL", f"R$ {dados['csll']:.2f}")
    campo("PIS", f"R$ {dados['pis']:.2f}")
    campo("COFINS", f"R$ {dados['cofins']:.2f}")

    # Seção Totais
    secao_titulo("Total")
    campo("Valor Líquido", f"R$ {dados['valor_liquido']:.2f}")

    # Rodapé
    c.setFont("Helvetica-Oblique", 8)
    c.drawString(margin, 40, "Documento gerado automaticamente pelo sistema.")

    c.showPage()
    c.save()
