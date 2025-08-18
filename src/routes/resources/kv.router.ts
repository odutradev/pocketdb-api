import { Router } from "express";

import manageRequest from "@middlewares/manageRequest";
import kvResource from "@resources/kv/kv.resource";

const kvRouter = Router();

kvRouter.delete("/:collection/delete", manageRequest(kvResource.deleteCollection));
kvRouter.delete("/project/delete", manageRequest(kvResource.deleteProject));
kvRouter.delete("/:collection/:id", manageRequest(kvResource.deleteById));
kvRouter.get("/:collection/get/:id", manageRequest(kvResource.getById));
kvRouter.post("/:collection/create", manageRequest(kvResource.create));

export default kvRouter;