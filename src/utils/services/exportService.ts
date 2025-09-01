const exportService = {
    convertToCSV: (data: any[]): string => {
        if (data.length === 0) return '';
        
        const allKeys = new Set<string>();
        data.forEach(item => {
            if (item.data && typeof item.data === 'object') {
                Object.keys(item.data).forEach(key => allKeys.add(key));
            }
            ['_id', 'collection', 'createdAt', 'lastUpdate', 'expiresAt'].forEach(key => {
                if (item[key] !== undefined) allKeys.add(key);
            });
        });
        
        const headers = Array.from(allKeys);
        const csvHeaders = headers.join(',');
        
        const csvRows = data.map(item => {
            return headers.map(header => {
                let value = '';
                if (item.data && typeof item.data === 'object' && item.data[header] !== undefined) {
                    value = item.data[header];
                } else if (item[header] !== undefined) {
                    value = item[header];
                }
                
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                    value = `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(',');
        });
        
        return [csvHeaders, ...csvRows].join('\n');
    },

    convertToJSON: (data: any): string => {
        return JSON.stringify(data, null, 2);
    },

    groupByCollection: (records: any[]): Record<string, any[]> => {
        return records.reduce((acc: any, record) => {
            if (!acc[record.collection]) {
                acc[record.collection] = [];
            }
            acc[record.collection].push(record);
            return acc;
        }, {});
    },

    formatProjectExport: (groupedData: Record<string, any[]>, format: string): string => {
        if (format === 'csv') {
            return Object.keys(groupedData).map(collectionName => {
                const collectionData = groupedData[collectionName] as any[];
                const csvData = exportService.convertToCSV(collectionData);
                return `Collection: ${collectionName}\n${csvData}`;
            }).join('\n\n');
        }
        return exportService.convertToJSON(groupedData);
    }
};

export default exportService;