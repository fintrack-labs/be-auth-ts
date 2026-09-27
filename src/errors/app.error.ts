export class AppError extends Error {
    statusCode: number;
    details: unknown;

    constructor(message: string, statusCode: number = 500, details: unknown = null) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.details = details;
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found') {
        super(message, 404);
    }
}

export class BadRequestError extends AppError {
    constructor(message: string = 'Bad request', details: unknown = null) {
        super(message, 400, details);
    }
}

export class ConflictError extends AppError {
    constructor(message: string = 'Data already exist') {
        super(message, 409);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = 'Invalid credentials') {
        super(message, 401);
    }
}