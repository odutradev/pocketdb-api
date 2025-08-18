import type { ManageRequestBody } from "@middlewares/manageRequest";
import genericModel from "@database/model/generic";

const kvResource = {
    create: async ({ data, manageError, ids }: ManageRequestBody) => {
        try {
            if (!data) return manageError({ code: "no_data_sent" });
            
            const { data: recordData, expiresInDays, expiresAt} = data;
            const { projectID, collection } = ids;
            
            if (!projectID || !collection || !recordData) return manageError({ code: "invalid_data" });
            
            const newRecord = new genericModel({
                data: recordData,
                expiresInDays,
                projectID,
                collection,
                expiresAt,
            });
            
            const savedRecord = await newRecord.save();
            return savedRecord;
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },

    getById: async ({ params, manageError, ids }: ManageRequestBody) => {
        try {
            const { projectID, collection } = ids;
            const { id } = params
            
            if (!projectID || !collection || !id) return manageError({ code: "invalid_params" });
            
            const record = await genericModel.findOne({ 
                collection: collection,
                projectID: projectID, 
                _id: id
            });
            
            if (!record) return manageError({ code: "object_not_found" });
            return record;
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    }
};

export default kvResource;