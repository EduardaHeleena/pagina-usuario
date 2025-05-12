const db = require("../config/database");

const getAllUsers = async () => {
  try {
    const [results] = await db.query("SELECT * FROM users");
    return results;
  } catch (err) {
    throw err;
  }
};

const getUserById = async (id) => {
  try {
    const [results] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    var result= results[0]; // Só pega o primeiro resultado (1 único usuário)
    
    if (result.profile_picture) {
      // Converte o buffer da imagem em base64
      result.profile_picture_base64 = `data:${getMimeType(result.image_type)};base64,${result.profile_picture.toString('base64')}`;
    }

    return result;
  } catch (err) {
    throw err;
  }
};

const updateUser = async (id, name, profile_picture_base64) => {
  try {
    let imageBuffer = null;
    let mimeType = null;
    let ext = "";

    if (profile_picture_base64) {
      // Se vier no formato "data:image/png;base64,xxx", precisamos separar
      const matches = profile_picture_base64.match(/^data:(.+);base64,(.+)$/);

      if (!matches) {
        throw new Error("Formato de imagem inválido.");
      }

      mimeType = matches[1]; // exemplo: "image/png"
      const base64Data = matches[2]; // só a parte pura do base64

      imageBuffer = Buffer.from(base64Data, 'base64');

      ext = mimeType.split('/')[1]
    }

    await db.query(`
      UPDATE users 
      SET name = ?, profile_picture = ?, image_type = ?
      WHERE id = ?
    `, [
      name,
      imageBuffer,
      ext,
      id
    ]);

    console.log("Usuário atualizado com sucesso.");
  } catch (err) {
    console.error("Erro ao atualizar usuário:", err);
    throw err;
  }
};

// Função para obter o tipo MIME da imagem a partir da base64
function getMimeTypeFromBase64(base64) {
  const mime = base64.split(';')[0].split(':')[1].split('/')[1];
  return mime;
}


// Função para obter o tipo MIME com base na extensão do arquivo
function getMimeType(ext) {
  const mimeTypes = {
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png"
  };

  return mimeTypes[ext] || "application/octet-stream"; // Retorna um tipo padrão se não encontrar
}

module.exports = {
  getAllUsers,
  getUserById,
  updateUser
};
