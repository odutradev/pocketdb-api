import { Router } from "express";

import manageRequest from "@middlewares/manageRequest";
import kvResource from "@resources/kv/kv.resource";

const kvRouter = Router();

kvRouter.get("/:collection/get-all", manageRequest(kvResource.getAll));
kvRouter.get("/:collection/count", manageRequest(kvResource.count));
kvRouter.post("/:collection/create", manageRequest(kvResource.create));
kvRouter.get("/:collection/get/:id", manageRequest(kvResource.getById));
kvRouter.patch("/:collection/update/:id", manageRequest(kvResource.updateById));
kvRouter.delete("/:collection/delete/:id", manageRequest(kvResource.deleteById));
kvRouter.delete("/:collection/delete-all", manageRequest(kvResource.deleteCollection));
kvRouter.delete("/project/delete-all", manageRequest(kvResource.deleteProject));

export default kvRouter;