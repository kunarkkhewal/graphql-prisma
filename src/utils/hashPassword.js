import bcrypt from 'bcryptjs';

const hashPassword = (password) => {
    if(password.length < 8){
        throw new Error('PASSWORD MUST BE 8 CHARACTER LONG ATLEAST!!!')
    }
    
    return bcrypt.hash(password, 10);
}

export { hashPassword as default }