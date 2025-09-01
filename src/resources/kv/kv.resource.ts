import type { ManageRequestBody } from "@middlewares/manageRequest";
import genericModel from "@database/model/generic";
import objectService from "@utils/services/objectServices";
import exportService from "@utils/services/exportService";

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

    count: async ({ querys, manageError, ids }: ManageRequestBody) => {
        try {
            const { projectID, collection } = ids;
            if (!projectID || !collection) return manageError({ code: "invalid_params" });

            const reservedParams = ['createdAfter', 'createdBefore'];
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

            const count = await genericModel.countDocuments(query);
            return { count };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },

    eval: async ({ data, querys, manageError, ids }: ManageRequestBody) => {
        try {
            const { projectID, collection } = ids;
            if (!projectID || !collection) return manageError({ code: "invalid_params" });
            if (!data) return manageError({ code: "no_data_sent" });

            const { operation, field, filters = {} } = data;
            if (!operation || !field) return manageError({ code: "invalid_data" });

            const validOperations = ['sum', 'avg', 'count', 'min', 'max', 'distinct'];
            if (!validOperations.includes(operation)) return manageError({ code: "invalid_data" });

            const reservedParams = ['createdAfter', 'createdBefore'];
            const dynamicParams = objectService.filterObject(querys, reservedParams);
            
            const dynamicFilters = Object.keys(dynamicParams).reduce((filters: any, key) => {
                filters[`data.${key}`] = { $regex: dynamicParams[key], $options: "i" };
                return filters;
            }, {});

            const matchStage: any = {
                collection: collection,
                projectID: projectID,
                ...dynamicFilters
            };

            Object.keys(filters).forEach(key => {
                matchStage[`data.${key}`] = filters[key];
            });

            if (querys.createdAfter || querys.createdBefore) {
                matchStage.createdAt = {};
                if (querys.createdAfter) {
                    matchStage.createdAt.$gte = new Date(querys.createdAfter as string);
                }
                if (querys.createdBefore) {
                    matchStage.createdAt.$lte = new Date(querys.createdBefore as string);
                }
            }

            const pipeline: any[] = [{ $match: matchStage }];

            switch (operation) {
                case 'sum':
                    pipeline.push({
                        $group: {
                            _id: null,
                            result: { $sum: `$${field}` }
                        }
                    });
                    break;

                case 'avg':
                    pipeline.push({
                        $group: {
                            _id: null,
                            result: { $avg: `$${field}` }
                        }
                    });
                    break;

                case 'count':
                    pipeline.push({
                        $group: {
                            _id: null,
                            result: { $sum: 1 }
                        }
                    });
                    break;

                case 'min':
                    pipeline.push({
                        $group: {
                            _id: null,
                            result: { $min: `$${field}` }
                        }
                    });
                    break;

                case 'max':
                    pipeline.push({
                        $group: {
                            _id: null,
                            result: { $max: `$${field}` }
                        }
                    });
                    break;

                case 'distinct':
                    pipeline.push({
                        $group: {
                            _id: `$${field}`,
                            count: { $sum: 1 }
                        }
                    });
                    pipeline.push({
                        $group: {
                            _id: null,
                            result: { $push: { value: "$_id", count: "$count" } }
                        }
                    });
                    break;
            }

            const result = await genericModel.aggregate(pipeline);
            
            if (result.length === 0) {
                return { operation, field, result: operation === 'distinct' ? [] : 0 };
            }

            return { operation, field, result: result[0].result };
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
    },

    exportCollection: async ({ querys, manageError, ids, defaultExpress }: ManageRequestBody) => {
        try {
            const { projectID, collection } = ids;
            if (!projectID || !collection) return manageError({ code: "invalid_params" });

            const format = (querys.format as string) || 'json';
            if (!['json', 'csv'].includes(format)) return manageError({ code: "invalid_params" });

            const records = await genericModel.find({
                collection: collection,
                projectID: projectID
            });

            if (format === 'csv') {
                const csvData = exportService.convertToCSV(records);
                defaultExpress.res.setHeader('Content-Type', 'text/csv');
                defaultExpress.res.setHeader('Content-Disposition', `attachment; filename="${collection}.csv"`);
                return defaultExpress.res.send(csvData);
            }

            const jsonData = exportService.convertToJSON(records);
            defaultExpress.res.setHeader('Content-Type', 'application/json');
            defaultExpress.res.setHeader('Content-Disposition', `attachment; filename="${collection}.json"`);
            return defaultExpress.res.send(jsonData);
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },

    importCollection: async ({ data, manageError, ids }: ManageRequestBody) => {
        try {
            const { projectID, collection } = ids;
            if (!projectID || !collection) return manageError({ code: "invalid_params" });
            if (!data) return manageError({ code: "no_data_sent" });

            const { data: importData } = data;
            if (!Array.isArray(importData)) return manageError({ code: "invalid_data" });

            const recordsToInsert = importData.map(item => ({
                projectID,
                collection,
                data: item,
                createdAt: new Date(),
                lastUpdate: new Date()
            }));

            const insertedRecords = await genericModel.insertMany(recordsToInsert);
            return { imported: true, count: insertedRecords.length };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },

    exportProject: async ({ querys, manageError, ids, defaultExpress }: ManageRequestBody) => {
        try {
            const { projectID } = ids;
            if (!projectID) return manageError({ code: "invalid_params" });

            const format = (querys.format as string) || 'json';
            if (!['json', 'csv'].includes(format)) return manageError({ code: "invalid_params" });

            const records = await genericModel.find({ projectID: projectID });
            const groupedData = exportService.groupByCollection(records);
            const exportData = exportService.formatProjectExport(groupedData, format);

            if (format === 'csv') {
                defaultExpress.res.setHeader('Content-Type', 'text/csv');
                defaultExpress.res.setHeader('Content-Disposition', `attachment; filename="project-${projectID}.csv"`);
                return defaultExpress.res.send(exportData);
            }

            defaultExpress.res.setHeader('Content-Type', 'application/json');
            defaultExpress.res.setHeader('Content-Disposition', `attachment; filename="project-${projectID}.json"`);
            return defaultExpress.res.send(exportData);
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },

    importProject: async ({ data, manageError, ids }: ManageRequestBody) => {
        try {
            const { projectID } = ids;
            if (!projectID) return manageError({ code: "invalid_params" });
            if (!data) return manageError({ code: "no_data_sent" });

            const { data: importData } = data;
            if (!importData || typeof importData !== 'object') return manageError({ code: "invalid_data" });

            let totalImported = 0;
            const importResults: Record<string, number> = {};

            for (const collectionName of Object.keys(importData)) {
                const collectionData = importData[collectionName];
                if (!Array.isArray(collectionData)) continue;

                const recordsToInsert = collectionData.map(item => ({
                    projectID,
                    collection: collectionName,
                    data: item.data || item,
                    createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
                    lastUpdate: new Date(),
                    expiresInDays: item.expiresInDays,
                    expiresAt: item.expiresAt ? new Date(item.expiresAt) : undefined
                }));

                const insertedRecords = await genericModel.insertMany(recordsToInsert);
                importResults[collectionName] = insertedRecords.length;
                totalImported += insertedRecords.length;
            }

            return { imported: true, totalCount: totalImported, collections: importResults };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    }
};

export default kvResource;