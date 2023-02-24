import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import GoogleProvider from 'next-auth/providers/google';
import nodemailer from 'nodemailer';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import Handlebars from 'handlebars';
import { readFileSync } from 'fs';
import path from 'path';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  secure: true,
});

const emailsDir = path.resolve(process.cwd(), 'emails');

const sendVerificationRequest = ({ identifier, url }) => {
  const emailFile = readFileSync(
    path.join(emailsDir, 'confirm-email.html'),
    {
      encoding: 'utf-8',
    }
  );
  const emailTemplate = Handlebars.compile(emailFile);
  transporter.sendMail({
    from: `'✨ SupaVacation' ${proces.env.EMAIL_FROM}`,
    html: emailTemplate({
      base_url: process.env.NEXTAUTH_URL,
      signin_url: url,
      email: identifier,
    }),
  });
};

const sendWelcomeEmail = async ({ user }) => {
  const { email } = user;

  try {
    const emailFile = readFileSync(
      path.join(emailsDir, 'welcome.html'),
      {
        encoding: 'utf-8',
      }
    );
    const emailTemplate = Handlebars.compile(emailFile);
    await transporter.sendMail({
      from: `'✨ SupaVacation' ${process.env.EMAIL_FROM}`,
      to: email,
      subject: 'Welcome to SupaVacation! 🎉',
      html: emailTemplate({
        base_url: process.env.NEXTAUTH_URL,
        support_email: 'jen@jenperez.dev',
      }),
    });
  } catch (error) {
    console.log(`❌ Unable to send welcome email to user (${email})`);
  }
};

export default NextAuth({
  pages: {
    signIn: '/',
    signOut: '/',
    error: '/',
    verifyRequest: '/',
  },
  providers: [
    EmailProvider({
      maxAge: 20 * 60, //magic link expires after 20 minutes
      sendVerificationRequest,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  events: { createUser: sendWelcomeEmail },
});