import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entities/users.entity';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class EmailVerificationService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}
  private verificationCodes = new Map<string, string>();

  async generateCode(email: string, phone: string): Promise<string> {
    // const existingEmail = await this.userRepository.findOne({
    //   where: [{ email: email }],
    // });
    // if (existingEmail) {
    //   throw new ConflictException('Email already registered');
    // }
    const existingPhone = await this.userRepository.findOne({
      where: [{ phone: phone }],
    });
    if (existingPhone) {
      throw new ConflictException('Phone number already registered');
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.verificationCodes.set(email, code);
    return code;
  }

  async sendCode(email: string, code: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: 'Verify your account',
      html: `<p>Your verification code is: <strong>${code}</strong></p>`,
    });
  }

  validateCode(email: string, inputCode: string): boolean {
    const correctCode = this.verificationCodes.get(email);
    return inputCode === correctCode;
  }

  removeCode(email: string) {
    this.verificationCodes.delete(email);
  }
}
