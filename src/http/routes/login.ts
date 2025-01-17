import z from "zod";
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { userfn } from "../../functions/fn_user";
import { compareHashPassword, generateToken, isTokenValid, parseToken } from "../../helper";
import dayjs from "dayjs";

export const loginRoutes:FastifyPluginAsyncZod = async(app) => {
    app.post("/login", {
        schema: {
            body: z.object({
                dscLogin: z.string().min(4).max(50),
                dscPassword: z.string().min(4).max(25),
            })
        }
    }, async (request) => {
        const { dscLogin, dscPassword } = request.body;

        const { data } = await userfn.getUserByDscLogin({dscLogin});

        const user = data.length > 0 && data[0];
        if(user && compareHashPassword(user.dscPassword, dscPassword)) {
            console.log("passei")
            const payload = {
                ...user,
                expire: dayjs().add(15, "d").toDate().getTime(),
                dscPassword: undefined
            }

            return {
                authed: generateToken(payload),
                nomUser: user.nomUser
            }
        }

        return {authed: false}
    });

    app.post("/refresh-token", {
        schema: {
            headers: z.object({
                authorization: z.string()
            })
        }
    }, async (request) => {
        const { authorization } = request.headers;

        if(!isTokenValid(authorization.replace(/^(bearer)\s/gi, ""))) {
            return {
                authed: false,
                message: "Token inválido"
            }
        }
        const payload = parseToken(`${authorization}`);

        payload.expire = dayjs().add(15, "d").toDate().getTime();

        return {
            authed: generateToken(payload)
        }
    });
}

// export const login: FastifyPluginAsyncZod = async (app) => {
//     app.post("/login", {
//         schema: {
//             body: z.object({
//                 dscLogin: z.string().min(4).max(50),
//                 dscPassword: z.string().min(4).max(25),
//             })
//         }
//     }, async (request) => {
//         const { dscLogin, dscPassword } = request.body;

//         const { data } = await userfn.getUserByDscLogin({dscLogin});

//         const user = data.length > 0 && data[0];
//         if(user && compareHashPassword(user.dscPassword, dscPassword)) {
//             console.log("passei")
//             const payload = {
//                 ...user,
//                 expire: dayjs().add(15, "d").toDate().getTime(),
//                 dscPassword: undefined
//             }

//             return {
//                 authed: generateToken(payload),
//                 nomUser: user.nomUser
//             }
//         }

//         return {authed: false}
//     })
// }

// export const refreshToken: FastifyPluginAsyncZod = async (app) => {
//     app.post("/refresh-token", {
//         schema: {
//             headers: z.object({
//                 Authorization: z.string()
//             })
//         }
//     }, async (request) => {
//         const { Authorization } = request.headers;

//         const payload = parseToken(`${Authorization}`);

//         payload.expire = dayjs().add(15, "d").toDate().getTime();

//         return {
//             authed: generateToken(payload)
//         }
//     })
// }