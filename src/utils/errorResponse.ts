import {MongoServerError} from "mongodb";

class ErrorResponse extends MongoServerError{
    status: number

    constructor(message: string, status: number)
    {
        super({message});
        this.status = status
    }
}

export default ErrorResponse