import mongoose from "mongoose";

const genericSchema = new mongoose.Schema({
    projectID: {
        type: String,
        required: true,
    },
    collection: {
        type: String,
        required: true,
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastUpdate: {
        type: Date,
        default: Date.now,
    },
    expiresInDays: {
        type: Number,
        required: false,
    },
    expiresAt: {
        type: Date,
        required: false,
        index: { expireAfterSeconds: 0 }
    }
});

const calculateExpirationDate = (expiresInDays: number) => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + expiresInDays);
    return expirationDate;
};

genericSchema.pre('save', function(next) {
    if (this.expiresInDays && this.isModified('expiresInDays')) {
        this.expiresAt = calculateExpirationDate(this.expiresInDays);
    }
    next();
});

genericSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function(next) {
    const update = this.getUpdate() as any;
    if (update && update.expiresInDays) {
        update.expiresAt = calculateExpirationDate(update.expiresInDays);
    }
    if (update && update.$set && update.$set.expiresInDays) {
        update.$set.expiresAt = calculateExpirationDate(update.$set.expiresInDays);
    }
    next();
});

const genericModel = mongoose.model("generic", genericSchema);

export default genericModel;