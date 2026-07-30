import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function POST(request : Request) {
    await dbConnect();


    try {
        const {username, code} = await request.json()

        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({username : decodedUsername})


        if(!user){
            return Response.json(
            {
                success : false ,
                message : "User not found"
            },
            {
                status : 404
            }
        )
        }

        const isCodeValid = await user.verifyCode === code

        const isCodeExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeExpired && isCodeValid){
            user.isVerified = true  
            await user.save()

            return Response.json(
            {
                success : true ,
                message : "Account Verifeid successfully"
            },
            {
                status : 200
            }
        )
        } else if(!isCodeExpired){
            return Response.json(
            {
                success : false ,
                message : "Verification code has expired, sign up again to  get a new code"
            },
            {
                status : 400
            }
        )
        } else {
            return Response.json(
            {
                success : false ,
                message : "Incorrect Verification code"
            },
            {
                status : 400
            }
        )

        }




    } catch (error) {
        console.error(" error verifing user " , error)

        return Response.json(
            {
                success : false ,
                message : "error verifing user"
            },
            {
                status : 500
            }
        )
    }

}

