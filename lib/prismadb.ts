// import {PrismaClient} from "@prisma/client";

// declare global{
//     var prisma: PrismaClient | undefined
// }

// const prismadb = global.prisma || new PrismaClient();
// if(process.env.NODE_ENV !== 'production') global.prisma = prismadb;

// export default prismadb;


import { PrismaClient } from "@prisma/client";

declare global {
	var prismadb: PrismaClient | undefined;
}

const prismadb = global.prismadb || new PrismaClient({ log: ["info"] });
if (process.env.NODE_ENV !== "production") global.prismadb = prismadb;

export default prismadb;