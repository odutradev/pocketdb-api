import type { ManageRequestBody } from "@middlewares/manageRequest";
import genericModel from "@database/model/generic";

const kvResource = {
    create: async ({ data, manageError }: ManageRequestBody) => {
        try {
            if (!data) return manageError({ code: "no_data_sent" });
            
            const { projectID, collection, data: recordData, expiresInDays, expiresAt} = data;
            
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
    }
};

export default kvResource;