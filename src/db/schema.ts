import { pgTable, serial, text, boolean, integer, numeric, varchar, timestamp } from "drizzle-orm/pg-core";

const defaultColumnsIdentity = {
    createdBy: integer('createdBy').references(() => user.codUser),
    dtaCrated: timestamp('dtaCrated', { withTimezone: true }).notNull().defaultNow(),
    updatedBy: integer('updatedBy').references(() => user.codUser),
    dtaUpdated: timestamp('dtaUpdated', { withTimezone: true })
}

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
    ...defaultColumnsIdentity
})

export const paymentType = pgTable('paymentType', {
    codPaymentType: varchar('codPaymentType', { length: 6 }).primaryKey(),
    nomPaymentType: text('nomPaymentType').notNull().unique(),
    flagParcel: boolean('flagParcel').notNull().default(false),
    vlrQtdMaxParcel: integer('vlrQtdMaxParcel'),
    fees: numeric('fees', {precision: 3, scale: 3}).notNull(),
    ...defaultColumnsIdentity
})

export const orderPayment = pgTable('orderPayment', {
    codOrderPayment: serial('codOrderPayment').primaryKey(),
    codPaymentType: varchar('codPaymentType', { length: 6 }).references(() => paymentType.codPaymentType).notNull(),
    qtdParcels: integer('qtdParcels'),
    vlrTotalOrder: numeric('vlrTotalOrder', {precision: 15, scale: 3}).notNull(),
    ...defaultColumnsIdentity
})

export const order = pgTable('order', {
    codOrder: serial('codOrder').primaryKey(),
    codUser: integer('codUser').references(() => user.codUser).notNull(),
    codStatus: varchar('codStatus', {length: 8}).references(() => status.codStatus).notNull(),
    codOrderPayment: integer('codOrderPayment').references(() => orderPayment.codOrderPayment).notNull(),
    dtaToDeliver: timestamp('dtaToDeliver', {withTimezone: true}).notNull(),
    ...defaultColumnsIdentity
})

export const product = pgTable('product', {
    codProduct: serial('codProduct').primaryKey(),
    nomPruduct: varchar('nomPruduct', { length: 50 }).notNull(),
    dscDescription: text('dscDescription').notNull(),
    ...defaultColumnsIdentity
})

export const flavour = pgTable('flavour', {
    codFlavour: serial('codFlavour').primaryKey(),
    nomFlavour: varchar('dscDescription', { length: 50 }).notNull(),
})

export const orderItem = pgTable('orderItem', {
    codOrderItem: serial('codOrderItem').primaryKey(),
    codOrder: integer('codOrder').references(() => order.codOrder).notNull(),
    codProduct: integer('codProduct').references(() => product.codProduct).notNull(),
    codFlavour: varchar('codSize', { length: 6 }).references(() => flavour.codFlavour).notNull(),
    dscDescription: text('dscDescription').notNull(),
    ...defaultColumnsIdentity
})