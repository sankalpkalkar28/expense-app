// import jwt from "jsonwebtoken";

// export const verifyTokenGuard = (req, res, next) => {
//     try {
//         const authorization = req.headers['authorization'];

//         if (!authorization)
//             return res.status(401).json({ message: "Unauthorized" });

//         const parts = authorization.split(" ");
//         if (parts.length !== 2)
//             return res.status(401).json({ message: "Unauthorized" });

//         const [type, token] = parts;

//         if (type !== "Bearer" || !token)
//             return res.status(401).json({ message: "Unauthorized" });

//         const payload = jwt.verify(token, process.env.FORGOT_TOKEN_SECRET);

//         if (!payload)
//             return res.status(401).json({ message: "Unauthorized" });

//         req.user = {
//             id: payload.id,
//             email: payload.email
//         };

//         next();
//     } catch (err) {
//         console.log("Token verification failed:", err.message);
//         return res.status(401).json({ message: "Invalid or expired token" });
//     }
// };

// const invalid = (res) => {
//     res.cookie('authToken', null, {
//         httpOnly: true,
//         secure: process.env.ENVIRONMENT !== "DEV",
//         sameSite: process.env.ENVIRONMENT === "DEV" ? "lax" : "none",
//         path: "/",
//         expires: new Date(0),
//         maxAge: 0,
//     });

//     return res.status(401).json({ message: 'Unauthorized' });
// };

// export const AdminUserGuard = (req, res, next) => {
//     try {
//         const { authToken } = req.cookies;

//         if (!authToken)
//             return invalid(res);

//         const payload = jwt.verify(authToken, process.env.AUTH_SECRET);

//         if (!payload || !["user", "admin"].includes(payload.role))
//             return invalid(res);

//         req.user = payload;

//         next();
//     } catch (err) {
//         return invalid(res);
//     }
// };

import jwt from "jsonwebtoken";

export const verifyTokenGuard = async (req,res,next) => {
    try{
        const authorization = req.headers['authorization'];
        if(!authorization)
            return res.status(400).send("Bad request");

        const [type,token] = authorization.split(" ");
        
        if(type !== "Bearer") 
            return res.status(400).send("Bad request");

        const payload = jwt.verify(token, process.env.FORGOT_TOKEN_SECRET);

        req.user = payload;
        next();
    }catch(err) {
    console.log("Token verification failed:", err.message);  // <--- Add this line
    return res.status(401).json({ message: "Invalid or expired token" });
    }
}

const invalid = async (res) => {
    res.cookie('authToken', null, {
            httpOnly : true,
            secure : process.env.ENVIRONMENT !== "DEV",
            sameSite : process.env.ENVIRONMENT === "DEV" ? "lax" : "none",
            path : "/",
            domain : undefined,
            maxAge : 0, 
        })
        res.status(400).json({message: 'Bad Request'})
}

// export const AdminUserGuard = async (req, res, next) => {
//     const { authToken } = req.cookies;
//     if(!authToken)
//         return invalid(res);

//     const payload = await jwt.verify(authToken, process.env.AUTH_SECRET);

//     if(payload.role !== "user" && payload.role !== "admin")
//         return invalid(res);

//     req.user = payload;
//     next();
// };

export const AdminUserGuard = async (req,res,next) => {
    const {authToken} = req.cookies;
    console.log(authToken);
    if(!authToken)
         return invalid(res);

    const payload = jwt.verify(authToken, process.env.AUTH_SECRET);
    console.log(payload);
    next();
}

// import jwt from "jsonwebtoken";

// export const verifyTokenGuard = async (req, res, next) => {
//     try {
//         const authorization = req.headers['authorization'];

//         if (!authorization)
//             return res.status(400).send("No token provided");

//         const [type, token] = authorization.split(" ");

//         if (type !== "Bearer" || !token)
//             return res.status(400).send("Invalid token format");

//         const payload = jwt.verify(token, process.env.AUTH_SECRET);

//         req.user = payload;
//         next();

//     } catch (err) {
//         return res.status(401).send("Invalid or expired token");
//     }
// };