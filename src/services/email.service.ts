import nodemailer from 'nodemailer';

function escapeHtml(value: string) {
    return value.replace(/[&<>"']/g, (character) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    })[character]!);
}

export async function sendActivationEmail(email: string, name: string, userId: string, token: string) {
    const host = process.env.SMTP_HOST;
    const from = process.env.EMAIL_FROM;
    const frontendPublicUrl = process.env.FRONTEND_PUBLIC_URL ??
        (process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:5173');
    const user = process.env.SMTP_USER;
    const password = process.env.SMTP_PASSWORD;

    if (!host || !from || !frontendPublicUrl || Boolean(user) !== Boolean(password)) {
        throw new Error('Email activation is not configured correctly');
    }

    const activationUrl = new URL('/activate', `${frontendPublicUrl.replace(/\/+$/, '')}/`);
    activationUrl.searchParams.set('token', token);

    const transporter = nodemailer.createTransport({
        host,
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: process.env.SMTP_SECURE === 'true',
        ...(user && password ? { auth: { user, pass: password } } : {}),
    });

    const safeName = escapeHtml(name);
    const safeUserId = escapeHtml(userId);
    const link = activationUrl.toString();
    const safeLink = escapeHtml(link);
    await transporter.sendMail({
        from,
        to: email,
        subject: 'Activate your FinTrack account',
        text: `Hello ${name}, your account has been registered with ID: ${userId}. Please activate your account by opening the following link: ${link}`,
        html: `<p>Hello ${safeName},</p><p>Your account has been registered with ID: <strong>${safeUserId}</strong>.</p><p>Please activate your account by opening the following link: <a href="${safeLink}">Activate your account</a></p><p>This link expires in 24 hours and can only be used once.</p>`,
    });
}