import { Request, Response } from 'express'
import Auth from '../models/Auth'
import bcrypt from 'bcryptjs'
import { generateToken } from '../utils/jwt'

export const register = async (req: Request, res: Response) => {
  const { email, name, password } = req.body

  const existingEmail = await Auth.findOne({ email })

  if (existingEmail) {
    res.status(401).json({ message: 'User already exists' })
    return
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await Auth.create({ email, name, password: hashedPassword })
  const token = generateToken(user._id.toString())

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'lax',
  })

  res.status(201).json({ message: 'User created successfully' })
}
export const login = async (req: Request, res: Response) => {
  const {email,password} = req.body

  const user = await Auth.findOne({ email })
  if (!user) {
    res.status(401).json({ message: 'Invalid Credintials' })
    return
  }

  const comparePassword = await bcrypt.compare(password, user.password)
  if (!comparePassword) {
    res.status(401).json({ message: 'Incorrect email or password' })
    return
  }

  const token = generateToken(user._id.toString())

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'lax',
  })

  res.status(201).json({ message: 'User Logined' })
}

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('token')
  res.status(200).json({ message: 'User Logged Out' })
}