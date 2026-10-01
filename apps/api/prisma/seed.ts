import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL;
const emails: string[] = process.env.SEED_USERS
  ? JSON.parse(process.env.SEED_USERS)
  : [];

const users = emails.map((email) => ({
  email,
}));

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting database seed...');

  for (const user of users) {
    
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  console.log(`Seeded ${users.length} users`);
}

main()
  .catch((error) => {
    console.error('Database seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });