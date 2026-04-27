// Controller for adding listing to database

export const listing = async (req,res)=> {
    try { 
        const {userId} = await req.auth();
    } catch (error) {
        
    }
}