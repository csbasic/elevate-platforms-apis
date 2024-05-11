



const post = async ( req, res ) => {
   res.status(200).json({status: true, message: "State is true!"})
}

module.exports = {post}