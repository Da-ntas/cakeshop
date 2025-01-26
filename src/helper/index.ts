import bcrypt from "bcrypt";
import dayjs from "dayjs";
import { eq, type SQL } from "drizzle-orm";
import type { PgTable, PgView } from "drizzle-orm/pg-core";

const _secret = process.env.TOKEN_SECRET;
const _defHeader = {
    alg: "HS256",
    typ: "JWT"
}
const _salt = 10;

export function hashPassword(password: string) {
    return bcrypt.hashSync(password, _salt);
}

export function compareHashPassword(hashedPassword: string, passwordTyped: string) {
    const r = bcrypt.compareSync(passwordTyped, hashedPassword);
    console.log('r', r)
    return r;
}

function tobase64URL(input: string) {
    return Buffer.from(input).toString("base64url");
}
function frombase64URL(input: string) {
    return Buffer.from(input, "base64url").toString("ascii");
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function compareTwoObjects(obj1: any, obj2: any) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    const fl1 = keys1.every(e => keys2.includes(e));
    const fl2 = keys2.every(e => keys1.includes(e));

    if (fl1 && fl2) {
        const flv1 = keys1.every(e => obj2[e] === obj1[e]);
        if (flv1) {
            return true;
        }
    }

    return false;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function validateExpiredToken(obj: any) {
    if (!obj?.expire) return false;

    const actualDate = new Date().getTime();
    const tokenDate = obj.expire;
    if (tokenDate > actualDate) return true;

    return false;
}

export function generateToken(payload: object) {
    const b64header = tobase64URL(JSON.stringify(_defHeader));
    const b64payload = tobase64URL(JSON.stringify(payload));
    const b64signature = tobase64URL(JSON.stringify(_secret));

    return `${b64header}.${b64payload}.${b64signature}`;
}

export function parseToken(token: string) {
    const [_, b64payload] = token.split(".");
    const payload = JSON.parse(frombase64URL(b64payload));

    return payload;
}

export function isTokenValid(token: string) {
    const [b64header, b64payload, b64signature] = token.split(".");
    const header = JSON.parse(frombase64URL(b64header));
    const payload = JSON.parse(frombase64URL(b64payload));
    const signature = frombase64URL(b64signature);

    const isntExpired = validateExpiredToken(payload);

    if (signature === `"${_secret}"`
        && compareTwoObjects(_defHeader, header)
        && isntExpired
    ) {
        return true;
    }

    return false;
}

export function generateGenericFilter(schema: PgTable | PgView, params?: object) {
    const filters: SQL[] = [];
    if(params) {
        for (const [k, v] of Object.entries(params)) {
            if (k && v && k in schema) {
                // @ts-ignore
                // do not know why it gives an error, and couldn't make it right, but its working anyway
                filters.push(eq(schema[k as keyof typeof schema], v));
            }
        }
    }

    return filters;
}

function generateUUID() {
    const avaiable = "abcdefghijklmopqrstuvwxyz0123456789";

    let uuid = "";

    for (let i = 0; i < 4; i++) {

        for (let j = 0; j < 6; j++) {
            const idx = Math.floor(Math.random() * 35);
            uuid += avaiable[idx];
        }

        if (i < 3) uuid += "-";
    }

    return uuid;
}