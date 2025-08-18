import { Router } from "express";

import manageRequest from "@middlewares/manageRequest";
import kvResource from "@resources/kv/kv.resource";

const kvRouter = Router();

kvRouter.get("/:collection/get/:id", manageRequest(kvResource.getById));
kvRouter.post("/:collection/create", manageRequest(kvResource.create));

export default kvRouter;