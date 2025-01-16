import z from "zod";
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { userfn } from "../../functions/fn_user";
import { hashPassword } from "../../helper";

export const getUsers: FastifyPluginAsyncZod = async (app) => {
    app.get("/user", async (request) => {
        const { data } = await userfn.getUser();

        return data;
    })
}

export const getUserById: FastifyPluginAsyncZod = async (app) => {
    app.get("/user/:codUser", {
        schema: {
            params: z.object({
                codUser: z.coerce.number().int().min(1)
            })
        }
    }, async (request) => {
        const { codUser } = request.params;

        const { data } = await userfn.getUserById({codUser});
        return data;
    })
}

export const postUser: FastifyPluginAsyncZod = async (app) => {
    app.post("/user", {
        schema: {
            body: z.object({
                dscLogin: z.string().min(4).max(50),
                dscPassword: z.string().min(4).max(25),
                nomUser: z.string().min(4).max(150),
                dscRoles: z.string(),
            })
        }
    }, async (request) => {
        const {dscLogin, dscPassword, nomUser, dscRoles} = request.body;

        const encryptedPassword = hashPassword(dscPassword);
        
        const { data } = await userfn.createUser({
            dscLogin,
            dscPassword: encryptedPassword,
            nomUser, 
            dscRoles
        });

        return data;
    })
}

export const updateUser: FastifyPluginAsyncZod = async (app) => {
    app.put("/user/:codUser", {
        schema: {
            params: z.object({
                codUser: z.coerce.number().int().min(1)
            })
        }
    }, async (request) => {
        const { codUser } = request.params;

        const { data } = await userfn.updateUser({codUser});


        return data;
    })
}

export const deleteUser: FastifyPluginAsyncZod = async (app) => {
    app.delete("/user/:codUser", {
        schema: {
            params: z.object({
                codUser: z.coerce.number().int().min(1)
            })
        }
    }, async (request) => {
        const { codUser } = request.params;

        const { data } = await userfn.deleteUser({codUser});

        return data;
    })
}