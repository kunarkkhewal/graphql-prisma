import jwt from 'jsonwebtoken';

const getUserId = (request, requireAuth = true) => {
    const header = request.request.headers.authorization;

    if(header){
        const token = header.replace('Bearer ', '')
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        return decode.userId;
    }

    if(requireAuth){
        throw new Error('AUTHENTICATION REQUIRED!!!')
    }

    return null;
}

export {getUserId as default}