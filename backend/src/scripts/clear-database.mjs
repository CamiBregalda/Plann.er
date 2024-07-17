import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearDatabase() {
    await prisma.activity.deleteMany({});

    await prisma.participant.deleteMany({});

    await prisma.link.deleteMany({});

    await prisma.trip.deleteMany({});
    
    console.log('Database cleared successfully');
    await prisma.$disconnect();
}

clearDatabase().catch(e => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
});
