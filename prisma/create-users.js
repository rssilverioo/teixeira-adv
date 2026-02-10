const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
require('dotenv/config');
const prisma = new PrismaClient();

async function main() {
  const mp = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'rodrigo.silverio@inovitdigital.com.br' },
    update: { password: mp, role: 'MASTER' },
    create: { name: 'Rodrigo Silverio', email: 'rodrigo.silverio@inovitdigital.com.br', password: mp, role: 'MASTER' },
  });
  console.log('Master created: rodrigo.silverio@inovitdigital.com.br');

  const ap = await bcrypt.hash('123mudar', 10);
  await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: { password: ap, role: 'ADMIN' },
    create: { name: 'Administrador', email: 'admin@admin.com', password: ap, role: 'ADMIN' },
  });
  console.log('Admin created: admin@admin.com');

  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
