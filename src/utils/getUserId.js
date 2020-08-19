import jwt from 'jsonwebtoken';

const getUserId = (request) => {
    const header = request.request.headers.authorization;

    if(!header){
        throw new Error('AUTHENTICATION REQUIRED!!!')
    }

    const token = header.replace('Bearer ', '')
    const decode = jwt.verify(token, process.env.JWT_SECRET)

    return decode.userId;
}

export {getUserId as default}