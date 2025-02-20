
const StatusCode = {
    FORBIDDEN:403,
    CONFLICT:409
}
const ReasonStatusCode={
    FORBIDDEN:'Bad request error',
    CONFLICT:'Conflict error'
}
const {StatusCodes,ReasonPhrase} = require('../utils/httpStatusCode')
const statusCodes = require('../utils/statusCodes')
class ErrorResponse extends Error
{
    constructor(message,status)
    {
        super(message)
        this.status=status
    }
}

class ConflictRequestError extends ErrorResponse{
    constructor(message = ReasonStatusCode.CONFLICT,statusCode=StatusCode.CONFLICT)
    {
        super(message,statusCode)
    }
}

class BadRequest extends ErrorResponse{
    constructor(message = ReasonStatusCode.FORBIDDEN,statusCode=StatusCode.FORBIDDEN)
    {
        super(message,statusCode)
    }
}
class AuthFailureError extends ErrorResponse{
    constructor(message=ReasonPhrase.UNAUTHORIZED,statusCode= StatusCodes.UNAUTHORIZED)
    {
        super(message,statusCode)
    }
}
class NotFoundError extends ErrorResponse{
    constructor(message=ReasonPhrase.NOT_FOUND,statusCode= StatusCodes.NOT_FOUND)
    {
        super(message,statusCode)
    }
}
class ForbiddenError extends ErrorResponse{
    constructor(message=ReasonPhrase.FORBIDDEN,statusCode= StatusCodes.FORBIDDEN)
    {
        super(message,statusCode)
    }
}
module.exports={
    ConflictRequestError,
    BadRequest,
    NotFoundError,
    AuthFailureError,
    ForbiddenError
}