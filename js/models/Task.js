export default class Task {
    constructor(id, title, description, category, expiresAt) {
        this._id = id;
        this._title = title;
        this._description = description;
        this._category = category;
        this._expiresAt = expiresAt;
        this._isDone = false;
    }

    toObject() {
        return {
            id: this._id,
            title: this._title,
            description: this._description,
            category: this._category,
            expiresAt: this._expiresAt,
            isDone: this._isDone
        }
    }
}