const mysql = require("mysql2/promise");

async function seedDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  try {
    // Cria o banco se não existir
    await connection.query("CREATE DATABASE IF NOT EXISTS `" + process.env.DB_NAME + "`");

    await connection.end();

    const authDb = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME
    });

    // Cria a tabela invoices
    await authDb.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_client INT NOT NULL,
        invoice_number VARCHAR(50) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        issue_date DATE NOT NULL,
        due_date DATE NULL,
        fees DECIMAL(10,2) DEFAULT 0.00,
        payment_date DATE NULL,
        notificado BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Agora cria 6 faturas para client_id = 1
    const today = new Date();
    const formatDate = (date) => date.toISOString().split('T')[0]; // yyyy-mm-dd

    const invoices = [
      // 2 Pagas
      {
        id: 1,
        invoice_number: "INV-001",
        amount: 150.75,
        issue_date: formatDate(new Date(today.getFullYear(), today.getMonth() - 3, 10)),
        due_date: formatDate(new Date(today.getFullYear(), today.getMonth() - 2, 10)),
        fees: 0,
        payment_date: formatDate(new Date(today.getFullYear(), today.getMonth() - 2, 8)), // Pago antes do vencimento
      },
      {
        id: 2,
        invoice_number: "INV-002",
        amount: 200.00,
        issue_date: formatDate(new Date(today.getFullYear(), today.getMonth() - 2, 5)),
        due_date: formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 5)),
        fees: 10.00,
        payment_date: formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 10)), // Pago depois do vencimento
      },
      // 2 Vencidas
      {
        id: 3,
        invoice_number: "INV-003",
        amount: 300.50,
        issue_date: formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 15)),
        due_date: formatDate(new Date(today.getFullYear(), today.getMonth(), 1)),
        fees: 0,
        payment_date: null, // Não pago
      },
      {
        id: 4,
        invoice_number: "INV-004",
        amount: 400.25,
        issue_date: formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 20)),
        due_date: formatDate(new Date(today.getFullYear(), today.getMonth(), 5)),
        fees: 0,
        payment_date: null, // Não pago
      },
      // 2 Em aberto (no prazo)
      {
        id: 5,
        invoice_number: "INV-005",
        amount: 500.00,
        issue_date: formatDate(today),
        due_date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10)),
        fees: 0,
        payment_date: null, // Ainda no prazo
      },
      {
        id: 6,
        invoice_number: "INV-006",
        amount: 600.00,
        issue_date: formatDate(today),
        due_date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 15)),
        fees: 0,
        payment_date: null, // Ainda no prazo
      }
    ];

    for (const inv of invoices) {
      // Verifica se já existe o id
      const [rows] = await authDb.query(`SELECT id FROM invoices WHERE id = ?`, [inv.id]);

      if (rows.length === 0) {
        // Se não existir, insere
        await authDb.query(`
          INSERT INTO invoices (id, id_client, invoice_number, amount, issue_date, due_date, fees, payment_date)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          inv.id,
          1, // id_client
          inv.invoice_number,
          inv.amount,
          inv.issue_date,
          inv.due_date,
          inv.fees,
          inv.payment_date
        ]);

        console.log(`Invoice id ${inv.id} inserido.`);
      } else {
        console.log(`Invoice id ${inv.id} já existe, ignorando.`);
      }
    }

    console.log("Seed de invoices criada com sucesso!");

    await authDb.end();
  } catch (error) {
    console.error("Erro ao criar banco e inserir invoices:", error);
  }
}

module.exports = seedDatabase;
