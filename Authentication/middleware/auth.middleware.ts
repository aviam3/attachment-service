import { Response, NextFunction, Request } from "express"
import { validateParameter } from "../../Attachment/helper";

function auth_required(req: Request, res: Response, next: NextFunction) {
    const {user_id, vendor_id} = req.headers
    
    if (!user_id || !vendor_id) {
        res.status(404).json({ error: "Authentication error", message: "Missing user ID or vendor ID." })
    }
    if(!validateParameter(user_id) || !validateParameter(vendor_id) ){
        return res.status(400).json({ error: "Authentication error", message: "Invalid user ID or vendor ID." });
    }
    next();
}

export default auth_required
