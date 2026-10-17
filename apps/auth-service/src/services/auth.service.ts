import { AppError, createToken } from "shared";
import { createUser, findByEmail, findById } from "../repositories/user.repo";
import { LoginInput, RegisterInput } from "../schemas/auth.schema";
import bcrypt from 'bcryptjs'
import { convertToPublicUser } from "../utils/auth.utils";
import { User } from "../types/auth.types";


export async function register (input:RegisterInput){
    const existingUser = await findByEmail(input.email)

    if(existingUser){
        throw new AppError(409, "Email already exists")
    }

    const passwordHash =  await bcrypt.hash(input.password, 10)

    const user = await createUser({
        name: input.name,
        email: input.email,
        password_hash: passwordHash,
        role: 'USER'
    })

    return convertToPublicUser(user)
}

export async function login(input: LoginInput){
const existingUser = await findByEmail(input.email)

if(!existingUser){
    throw new AppError(401, "invalid email or password")
}

const validPassword = await bcrypt.compare(input.password, existingUser.password_hash)

if(!validPassword){
    throw new AppError(401, "invalid email or password")
}

const token = createToken({userId: existingUser.id, role: existingUser.role})

const user = convertToPublicUser(existingUser)
return {token, user}
}

export async function getMe(userId: string){
    const user = await findById(userId)
    if(!user){
        throw new AppError(404, "User not found")
    }
    return  convertToPublicUser(user)
}

