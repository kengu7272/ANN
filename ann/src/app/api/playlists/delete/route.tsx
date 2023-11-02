// delete song from playlist - api endpoint

export async function POST(req: Request) {
    try {
        return Response.json({
            status: 207,
            message: "success"
        })
    }
    catch(error) {
        if(error instanceof Error) {
            return Response.json({
                status: 500,
                error: error.message
            });
        } 
    }
}