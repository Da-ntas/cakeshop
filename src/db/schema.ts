import { pgTable, serial, text, boolean, integer, numeric, varchar, timestamp } from "drizzle-orm/pg-core";

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

export const status = pgTable('status', {
    codStatus: varchar('codStatus', { length: 8 }).primaryKey(),
    nomStatus: varchar("nomStatus", {length: 25}).notNull().unique(),
    nomStatusMaster: varchar("nomStatusMaster", {length: 25}).notNull(),
    createdBy: integer('createdBy').references(() => user.codUser),
    dtaCrated: timestamp('dtaCrated', { withTimezone: true }).notNull().defaultNow(),
    updatedBy: integer('updatedBy').references(() => user.codUser),
    dtaUpdated: timestamp('dtaUpdated', { withTimezone: true })
})

export const order = pgTable('order', {
    codOrder: serial('codOrder').primaryKey(),
    codUser: integer('codUser').references(() => user.codUser),
    codStatus: varchar('codStatus', {length: 8}).references(() => status.codStatus),
    vlrTotalOrder: numeric('vlrTotalOrder', {precision: 15, scale: 3}).notNull(),
    dtaToDeliver: timestamp('dtaToDeliver', {withTimezone: true}).notNull(),
    createdBy: integer('createdBy').references(() => user.codUser),
    dtaCrated: timestamp('dtaCrated', { withTimezone: true }).notNull().defaultNow(),
    updatedBy: integer('updatedBy').references(() => user.codUser),
    dtaUpdated: timestamp('dtaUpdated', { withTimezone: true })
})