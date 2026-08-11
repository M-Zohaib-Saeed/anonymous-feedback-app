import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from "next-auth";
import mongoose from "mongoose";

export async function DELETE(request: Request, { params }: { params: Promise<{ messageid: string }> }) {
    const { messageid } = await params;
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user;

    if (!session || !session.user) {
        return Response.json(
            { success: false, message: "Not authenticated" },
            { status: 401 }
        );
    }

    try {
        const updatedResult = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageid } } }
        )

        if (updatedResult.modifiedCount == 0) {
            return Response.json(
                { message: 'Message not found or already deleted', success: false },
                { status: 404 }
            );
        }

        return Response.json(
            { message: 'Message deleted', success: true },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error in message delete route", error)
        return Response.json(
            { message: 'Error deleting message', success: false },
            { status: 500 }
        );
    }
}