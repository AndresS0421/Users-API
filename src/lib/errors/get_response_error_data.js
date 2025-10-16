export class VerificationError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

export const get_response_error_data = (error) => {
    // Check if it is a customized error
    if (error.status && error.message){
        return { status: error.status, message: error.message }
    }
    return { status: 400, message: error.message } 
}