import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";

export const user = pgTable('user', {
    codUser: serial('codUser').primaryKey(),
    dscLogin: text('dscLogin').notNull().unique(),
    dscPassword: text('dscPassword').notNull(),
    nomUser: text("nomUser").notNull(),
    dscRoles: text("dscRoles").notNull().default("user"),
    flagInactive: boolean("flagInactive").notNull().default(false),
    dtaCrated: timestamp('dtaCrated', { withTimezone: true }).notNull().defaultNow(),
    dtaUpdated: timestamp('dtaUpdated', { withTimezone: true })
})
