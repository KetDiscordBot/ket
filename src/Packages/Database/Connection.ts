import { Client } from "pg";
import table from "./_Interaction";

export default async () => {
    let postgres = new Client({
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
        user: process.env.DATABASE_USER,
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        ssl: process.env.SSL_MODE == 'false' ? false : { rejectUnauthorized: false }
    })

    await postgres.connect()
        .then(() => {
            //@ts-ignore
            postgres.users = (new table('users', 'id', postgres));
            //@ts-ignore
            postgres.servers = (new table('servers', 'id', postgres));
            //@ts-ignore
            postgres.commands = (new table('commands', 'name', postgres));
            //@ts-ignore
            postgres.globalchat = (new table('globalchat', 'id', postgres));
            //@ts-ignore
            postgres.blacklist = (new table('blacklist', 'id', postgres));
            postgres.tables = ['users', 'servers', 'commands', 'globalchat', 'blacklist'];

            console.log('DATABASE', '√ Banco de dados operante', 32);
        })
        .catch((error) => console.log('DATABASE', `x Não foi possível realizar conexão ao banco de dados: ${error}`, 41))

    /* DATABASE TESTS */
    await postgres.query(`SELECT id FROM public.users;`)
        .catch(async () => {
            console.log('DATABASE', 'Criando table users', 2);
            await postgres.query(`
            CREATE TABLE "users" (
                "id" VARCHAR(20) NOT NULL,
                "prefix" VARCHAR(3),
                "lang" VARCHAR(2),
                "commands" INTEGER NOT NULL,
                "banned" TEXT,
            
                CONSTRAINT "users_pkey" PRIMARY KEY ("id")
            );`)
        })

    await postgres.query(`SELECT id FROM public.servers;`)
        .catch(async () => {
            console.log('DATABASE', 'Criando table servers', 2);
            await postgres.query(`
            CREATE TABLE "servers" (
                "id" VARCHAR(20) NOT NULL,
                "lang" VARCHAR(2),
                "globalchat" VARCHAR(20),
                "partner" BOOLEAN,
                "banned" TEXT,
            
                CONSTRAINT "servers_pkey" PRIMARY KEY ("id")
            );`)
        })

    await postgres.query(`SELECT name FROM public.commands;`)
        .catch(async () => {
            console.log('DATABASE', 'Criando table commands', 2);
            await postgres.query(`
            CREATE TABLE "commands" (
                "name" TEXT NOT NULL,
                "maintenance" BOOLEAN,
                "reason" TEXT,
            
                CONSTRAINT "commands_pkey" PRIMARY KEY ("name")
            );`)
        })

    await postgres.query(`SELECT id FROM public.globalchat;`)
        .catch(async () => {
            console.log('DATABASE', 'Criando table globalchat', 2);
            await postgres.query(`
            CREATE TABLE "globalchat" (
                "id" VARCHAR(20) NOT NULL,
                "guild" VARCHAR(20) NOT NULL,
                "author" VARCHAR(20) NOT NULL,
                "editCount" INTEGER NOT NULL DEFAULT 0,
                "messages" VARCHAR(40)[],
            
                CONSTRAINT "globalchat_pkey" PRIMARY KEY ("id")
            );`)
        })

    await postgres.query(`SELECT id FROM public.blacklist;`)
        .catch(async () => {
            console.log('DATABASE', 'Criando table blacklist', 2);
            await postgres.query(`
            CREATE TABLE "blacklist" (
                "id" VARCHAR(20) NOT NULL,
                "timeout" INTEGER NOT NULL,
                "warns" INTEGER NOT NULL DEFAULT 1,
            
                CONSTRAINT "blacklist_pkey" PRIMARY KEY ("id")
            );`)
        })
    return;
}