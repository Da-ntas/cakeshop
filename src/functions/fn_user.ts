import { eq } from "drizzle-orm";
import { db } from "../db";
import { user } from "../db/schema";

interface codUserInterface {
    codUser : number
}

interface createUser {
    dscLogin: string,
    dscPassword: string,
    nomUser: string,
    dscRoles: string,
}

interface UpdateUserInput {
    codUser: number; // obrigatório, para identificar o registro
    dscLogin?: string;
    dscPassword?: string;
    nomUser?: string;
    dscRoles?: string;
    flagInactive?: boolean;
}

export const userfn = {
    async getUser() {
        const users = await db
            .select({
                codUser: user.codUser,
                dscLogin: user.dscLogin,
                nomUser: user.nomUser,
                dscRoles: user.dscRoles,
            })
            .from(user);

        return {
            data: users
        };
    },

    async getUserById({
        codUser
    }: codUserInterface) {
        const userById = await db
            .select({
                codUser: user.codUser,
                dscLogin: user.dscLogin,
                nomUser: user.nomUser,
                dscRoles: user.dscRoles,
            })
            .from(user)
            .where(
                eq(user.codUser, codUser)
            );

        return {
            data: userById
        };
    },

    async getUserByDscLogin({
        dscLogin
    }: {dscLogin: string}) {
        const userById = await db
            .select({
                codUser: user.codUser,
                dscLogin: user.dscLogin,
                dscPassword: user.dscPassword,
                nomUser: user.nomUser,
                dscRoles: user.dscRoles,
            })
            .from(user)
            .where(
                eq(user.dscLogin, dscLogin)
            );

        return {
            data: userById
        };
    },

    async createUser({
        dscLogin,
        dscPassword,
        nomUser,
        dscRoles,
    }: createUser) {
        const validateExists = await db.select().from(user).where(eq(user.dscLogin, dscLogin));

        if(validateExists && validateExists.length > 0) {
            return {
                data: "Login name already exsists"
            }
        }

        const created = await db
            .insert(user)
            .values({
                dscLogin,
                dscPassword,
                nomUser,
                dscRoles,
            })
            .returning({
                codUser: user.codUser,
                dscLogin: user.dscLogin,
                nomUser: user.nomUser,
                dscRoles: user.dscRoles,
            })

        return {
            data: created
        }
    },
    
    async updateUser({
        codUser,
        ...fieldsToUpdate
    }: UpdateUserInput) {
        
        const updated = await db
            .update(user)
            .set({
                ...fieldsToUpdate,
                dtaUpdated: new Date()
            })
            .where(
                eq(user.codUser, codUser)
            )
            .returning();
        
        return {
            data: updated
        }
    },

    async deleteUser({
        codUser
    }: codUserInterface) {
        const deletedUser = await db
            .delete(user)
            .where(
                eq(user.codUser, codUser)
            );

        return {
            data: deletedUser
        };
    }
}