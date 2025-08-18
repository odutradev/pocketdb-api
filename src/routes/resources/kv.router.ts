import { Router } from "express";

import kvResource from "@resources/kv/kv.resource";
import manageRequest from "@middlewares/manageRequest";
import controlAccess from "@middlewares/controlAccess";

const kvRouter = Router();

kvRouter.post("/create", manageRequest(kvResource.create));

export default kvRouter;