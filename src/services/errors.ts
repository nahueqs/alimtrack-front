export class SessionExpiredError extends Error {
    constructor(message: string = "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.") {
        super(message);
        this.name = "SessionExpiredError";
        Object.setPrototypeOf(this, SessionExpiredError.prototype);
    }
}

export class NonJsonError extends Error {
    constructor(message: string = "El servidor respondió con contenido no JSON.") {
        super(message);
        this.name = "NonJsonError";
        Object.setPrototypeOf(this, NonJsonError.prototype);
    }
}
