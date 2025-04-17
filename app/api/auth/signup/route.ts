import { NextResponse } from 'next/server';
import { signUpSchema } from '@/lib/validations/auth';
import User from '@/lib/models/user';
import * as argon2 from 'argon2';
import connectDB from '@/lib/mongodb';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Signup request body:', { ...body, password: '[REDACTED]' });

    const validatedData = signUpSchema.parse(body);
    console.log('Validated data:', { ...validatedData, password: '[REDACTED]' });

    await connectDB();
    console.log('Connected to MongoDB');

    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      console.log('User already exists with email:', validatedData.email);
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await argon2.hash(validatedData.password);
    console.log('Password hashed successfully');

    const user = await User.create({
      ...validatedData,
      password: hashedPassword
    });
    console.log('User created successfully:', { id: user._id, email: user.email });

    return NextResponse.json(
      { message: 'User created successfully', userId: user._id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}