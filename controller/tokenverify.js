const jsonwebtoken = require('jsonwebtoken');

module.exports = (req,res,next)=>{
    var token;
    if ('authorization' in req.headers){
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token)
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    else {
        // jwt.verify(token, process.env.JWT_SECRET,
        //     (err, decoded) => {
        //         if (err)
        //             return res.status(500).send({ auth: false, message: 'Token authentication failed.' });
        //         else {
        //             req._id = decoded._id;
        //             next();
        //         }
        //     }
        // )
        try{
            var token = req.headers.authorization.split(" ")[1];
            const decode = jsonwebtoken.verify(token, process.env.JWT_KEY);
            //console.log(decode);
            if(decode._id == req.params.userId){
                req.userDetail = decode;
                //console.log(req.userDetail);
                next();
            }else{
                return res.status(401).json({
                    message: 'you don\'t have this permission'
                });
            }
            
        }catch(err){
            return res.status(401).json({
                message: 'Auth failed due to you aren\'t a verified user'
            });
        }
    }
}


