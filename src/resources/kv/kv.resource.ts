import { ManageRequestBody } from "@middlewares/manageRequest";

const kvResource = {
    put: async ({ data, manageError }: ManageRequestBody) => {
        try {
          
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    }
};

export default kvResource;