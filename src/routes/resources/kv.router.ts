import { Router } from "express";

import kvResource from "@resources/kv/kv.resource";
import manageRequest from "@middlewares/manageRequest";

const kvRouter = Router();

// kvRouter.get("/",  manageRequest(usersResource.getUser));


export default kvRouter;