import { db } from "../db";
import type { PgTable, PgView as PView, SelectedFields } from "drizzle-orm/pg-core";
import { PgView } from "drizzle-orm/pg-core";
import { and, getTableColumns, type SQL } from "drizzle-orm";
import { generateGenericFilter } from "../helper";
import { ViewBaseConfig } from 'drizzle-orm'

interface DefaultPropsGetAll<TSchema extends PgTable, TSView extends PView, TSelection extends SelectedFields> {
    fieldsToSelect?: TSelection;
    schema: TSchema | TSView;
    params?: object;
}

interface DefaultPropsGetById<TSchema extends PgTable, TSelection extends SelectedFields> {
    fieldsToSelect?: TSelection;
    schema: TSchema;
    params: object;
}

interface DefaultPropsCreate<T> {
    schema: PgTable;
    data: T;
}

interface DefaultPropsUpdate<T> {
    schema: PgTable;
    data: Partial<T>;
    params: object;
}

interface DefaultPropsDelete {
    schema: PgTable;
    params: object
}

export const defaultQuery = {
    async defaultGetAll<TSchema extends PgTable, TSView extends PView, TSelection extends SelectedFields>({
        schema,
        fieldsToSelect,
        params,
    }: DefaultPropsGetAll<TSchema, TSView, TSelection>) {
        const filters: Array<SQL> = generateGenericFilter(schema, params);

        const records = await db
            .select(!fieldsToSelect ? 
                    schema instanceof PgView
                    //@ts-ignore
                    ? schema[ViewBaseConfig].selectedFields
                    : getTableColumns(schema) 
                : 
                fieldsToSelect
            )
            .from(schema)
            .where(
                and (
                    ...filters
                )
            );;

        return { data: records };
    },

    async defaultGetWithFilters<TSchema extends PgTable, TSelection extends SelectedFields>({
        fieldsToSelect,
        schema,
        params
    }: DefaultPropsGetById<TSchema, TSelection>) {
        const filters: Array<SQL> = generateGenericFilter(schema, params);
        const record = await db
            .select(!fieldsToSelect ? getTableColumns(schema) : fieldsToSelect)
            .from(schema)
            .where(
                and (
                    ...filters
                )
            );

        return { data: record };
    },

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    async defaultCreate<T extends Record<string, any>>({
        schema,
        data
    }: DefaultPropsCreate<T>) {
        const [newRecord] = await db
            .insert(schema)
            .values(data)
            .returning();

        return { data: newRecord };
    },

    async defaultUpdate<T>({
        schema,
        data,
        params
    }: DefaultPropsUpdate<T>) {
        const filters: Array<SQL> = generateGenericFilter(schema, params);
        const [updatedRecord] = await db
            .update(schema)
            .set(data)
            .where(
                and (
                    ...filters
                )
            )
            .returning();

        return { data: updatedRecord };
    },

    async defaultDelete({
        schema,
        params
    }: DefaultPropsDelete) {
        const filters: Array<SQL> = generateGenericFilter(schema, params);
        const [deletedRecord] = await db
            .delete(schema)
            .where(
                and (
                    ...filters
                )
            )
            .returning();

        return { data: deletedRecord };
    }
};
