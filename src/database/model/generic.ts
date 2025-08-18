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

genericSchema.pre('save', function(next) {
    if (this.expiresInDays && this.isModified('expiresInDays')) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + this.expiresInDays);
        this.expiresAt = expirationDate;
    }
    next();
});

const genericModel = mongoose.model("generic", genericSchema);

export default genericModel;