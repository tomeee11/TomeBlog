const jwt = require("jsonwebtoken")
const User = require("../schemas/user.js")

module.exports = async (req, res, next) => {
    const {Authorization} = req.cookies;
    const [authType, authToken] = (Authorization ?? "").split(" ")
    if(authType !== "Bearer" || !authToken){
        res.status(400).json({
            errorMessage: "로그인 후에 이용할 수 있는 기능입니다."
        })
        return
    }
    try{
        const {userId} = jwt.verify(authToken, "customzied-secret-key")

        const user = User.findById(userId)
        
        res.locals.user = user
        next();
    } catch (error){
        console.error(error)
        res.staus(400).json({errorMessage : "로그인 후에 이용할 수 있는 기능입니다."})
        return
    }
}