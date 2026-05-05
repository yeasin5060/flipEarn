//controller for cheking if user is admin
export const isAdmin = async (req,res)=> {
    try {
        return res.json({isAdmin: true});
    } catch (error) {
        console.log(error);
        return res.status(400).json({message : error.message});
    }
}