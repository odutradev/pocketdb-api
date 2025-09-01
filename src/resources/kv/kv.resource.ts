import type { ManageRequestBody } from "@middlewares/manageRequest";
import genericModel from "@database/model/generic";
import objectService from "@utils/services/objectServices";

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

    getAll: async ({ querys, manageError, ids }: ManageRequestBody) => {
        try {
            const { projectID, collection } = ids;
            if (!projectID || !collection) return manageError({ code: "invalid_params" });

            const page = parseInt(querys.page as string) || 1;
            const limit = parseInt(querys.limit as string) || 10;
            const pagination = querys.pagination !== 'false';
            const sortBy = querys.sortBy as string || 'createdAt';
            const sortOrder = querys.sortOrder as string === 'asc' ? 1 : -1;

            const reservedParams = ['page', 'limit', 'pagination', 'sortBy', 'sortOrder', 'createdAfter', 'createdBefore'];
            const dynamicParams = objectService.filterObject(querys, reservedParams);
            
            const dynamicFilters = Object.keys(dynamicParams).reduce((filters: any, key) => {
                filters[`data.${key}`] = { $regex: dynamicParams[key], $options: "i" };
                return filters;
            }, {});

            const query: any = {
                collection: collection,
                projectID: projectID,
                ...dynamicFilters
            };

            if (querys.createdAfter || querys.createdBefore) {
                query.createdAt = {};
                if (querys.createdAfter) {
                    query.createdAt.$gte = new Date(querys.createdAfter as string);
                }
                if (querys.createdBefore) {
                    query.createdAt.$lte = new Date(querys.createdBefore as string);
                }
            }

            const sortField = sortBy.startsWith('data.') ? sortBy : (sortBy === 'createdAt' || sortBy === 'lastUpdate') ? sortBy : `data.${sortBy}`;
            const sortOptions: any = {};
            sortOptions[sortField] = sortOrder;

            if (pagination) {
                const skip = (page - 1) * limit;
                const totalCount = await genericModel.countDocuments(query);
                const totalPages = Math.ceil(totalCount / limit);
                
                const records = await genericModel
                    .find(query)
                    .skip(skip)
                    .limit(limit)
                    .sort(sortOptions);

                return {
                    data: records,
                    pagination: {
                        currentPage: page,
                        totalPages,
                        totalCount,
                        limit,
                        hasNext: page < totalPages,
                        hasPrev: page > 1
                    }
                };
            }

            const records = await genericModel.find(query).sort(sortOptions);
            return { data: records };
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

    updateById: async ({ params, data, manageError, ids }: ManageRequestBody) => {
        try {
            const { projectID, collection } = ids;
            const { id } = params;
            
            if (!projectID || !collection || !id) return manageError({ code: "invalid_params" });
            if (!data) return manageError({ code: "no_data_sent" });
            
            const { data: recordData, expiresInDays, expiresAt } = data;
            
            const updateData: any = {
                lastUpdate: new Date()
            };
            
            if (expiresInDays !== undefined) updateData.expiresInDays = expiresInDays;
            if (expiresAt !== undefined) updateData.expiresAt = expiresAt;
            if (recordData !== undefined) updateData.data = recordData;
            
            const updatedRecord = await genericModel.findOneAndUpdate(
                {
                    collection: collection,
                    projectID: projectID,
                    _id: id
                },
                updateData,
                { new: true }
            );
            
            if (!updatedRecord) return manageError({ code: "object_not_found" });
            return updatedRecord;
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