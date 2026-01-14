const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'admin@123';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  
  console.log('========================================');
  console.log('Password: admin@123');
  console.log('Hash to copy:', hash);
  console.log('========================================');
}

generateHash();