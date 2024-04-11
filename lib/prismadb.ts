import {PrismaClient} from "@prisma/client";

declare global{
    var prisma: PrismaClient | undefined
}

const prismadb = global.prisma || new PrismaClient();
if(process.env.NODE_ENV !== 'production') global.prisma = prismadb;

export default prismadb;


// import { PrismaClient } from '@prisma/client';

// let prisma: PrismaClient;      // <-- you're missing this!

// if (process.env.NODE_ENV === 'production') {
//   prisma = new PrismaClient();
// } else {
//   if (!global.prisma) {
//     global.prisma = new PrismaClient();
//   }
//   prisma = global.prisma;
// }

// export default prisma;