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
    },

    deleteById: async ({ params, manageError, ids }: ManageRequestBody) => {
        try {
            const { projectID, collection } = ids;
            const { id } = params;
            
            if (!projectID || !collection || !id) return manageError({ code: "invalid_params" });
            
            const deletedRecord = await genericModel.findOneAndDelete({
                collection: collection,
                projectID: projectID,
                _id: id
            });
            
            if (!deletedRecord) return manageError({ code: "object_not_found" });
            return { deleted: true };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },

    deleteCollection: async ({ manageError, ids }: ManageRequestBody) => {
        try {
            const { projectID, collection } = ids;
            
            if (!projectID || !collection) return manageError({ code: "invalid_params" });
            
            const deleteResult = await genericModel.deleteMany({
                collection: collection,
                projectID: projectID
            });
            
            return { deleted: true, deletedCount: deleteResult.deletedCount };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },

    deleteProject: async ({ manageError, ids }: ManageRequestBody) => {
        try {
            const { projectID } = ids;
            
            if (!projectID) return manageError({ code: "invalid_params" });
            
            const deleteResult = await genericModel.deleteMany({
                projectID: projectID
            });
            
            return { deleted: true, deletedCount: deleteResult.deletedCount };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    }
};

export default kvResource;