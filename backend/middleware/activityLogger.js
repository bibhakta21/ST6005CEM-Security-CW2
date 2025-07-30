const ActivityLog = require("../model/ActivityLog");
const logger = require("./logger");
const useragent = require("useragent");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

const logActivity = async (req, res, next) => {
    try {

        const auth = req.headers["authorization"];
        if (auth?.startsWith("Bearer ")) {
            const decoded = jwt.verify(auth.split(" ")[1], process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select("_id username email");
            if (user) req.user = user;
        }

        const ip =
            req.headers["x-forwarded-for"]?.split(",")[0] || 
            req.connection?.remoteAddress ||                
            req.socket?.remoteAddress ||                    
            req.ip ||                                      
            "::1";                                          

        const userAgentStr = req.headers["user-agent"];
        const agent = useragent.parse(userAgentStr);

        const log = new ActivityLog({
            user: req.user?._id || null,
            action: `${req.method} ${req.originalUrl}`,
            ip,
            userAgent: agent.toString(),
            severity: req.method === "GET" ? "info" :
                req.method === "POST" ? "info" :
                    req.method === "PUT" ? "warn" :
                        req.method === "DELETE" ? "error" : "info"
        });


        await log.save();
        logger.info({
            user: req.user?.email || "Guest",
            ip,
            userAgent: agent.toString(),
            action: log.action,
        });
    } catch (err) {
        console.error("Activity log error:", err);
    }
    next();
};

module.exports = logActivity;
