// home api endpoint - get request sends back trivia question

import { headers } from "next/headers";
import jwt from 'jsonwebtoken';
import JwtPayload from "../payload";
import db from "../db";
import { RowDataPacket, FieldPacket } from "mysql2";

export async function GET(req: Request) {
    const headersList: Headers = headers();
    const token = headersList.get('token');

    // delete this later
    const data: string = await req.json() as string;

    if (!token) {
        return Response.json({
            status: 407,
            error: 'No token'
        });
    }

    const { userid } = jwt.verify(token, process.env.SECRET_KEY!) as JwtPayload;

    return Response.json({
        status: 207
    })
}