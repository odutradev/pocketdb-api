import { Router } from "express";

import manageRequest from "@middlewares/manageRequest";
import kvResource from "@resources/kv/kv.resource";

const kvRouter = Router();

kvRouter.delete("/:collection/delete-all", manageRequest(kvResource.deleteCollection));
kvRouter.delete("/:collection/delete/:id", manageRequest(kvResource.deleteById));
kvRouter.patch("/:collection/update/:id", manageRequest(kvResource.updateById));
kvRouter.delete("/project/delete-all", manageRequest(kvResource.deleteProject));
kvRouter.get("/:collection/get/:id", manageRequest(kvResource.getById));
kvRouter.post("/:collection/create", manageRequest(kvResource.create));

export default kvRouter;