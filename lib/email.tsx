// Email service for sending notifications
export async function sendEmail(to: string, subject: string, html: string) {
  // For now, just log to console
  // In production, integrate with email service like Resend, SendGrid, etc.
  console.log("[v0] Email would be sent:")
  console.log("To:", to)
  console.log("Subject:", subject)
  console.log("Content:", html)

  // TODO: Integrate with actual email service
  // Example with Resend:
  // const resend = new Resend(process.env.RESEND_API_KEY)
  // await resend.emails.send({
  //   from: 'SoraVideo AI <noreply@SoraVideo.ltd>',
  //   to,
  //   subject,
  //   html,
  // })
}

export async function sendPurchaseConfirmation(email: string, planName: string, credits: number, amount: number) {
  const subject = "Thank you for your purchase - SoraVideo AI"
  const html = `
    <h1>Thank you for your purchase!</h1>
    <p>Your ${planName} plan has been activated.</p>
    <p><strong>Credits added:</strong> ${credits}</p>
    <p><strong>Amount paid:</strong> $${amount}</p>
    <p>Start creating amazing AI videos at <a href="${process.env.NEXT_PUBLIC_APP_URL}">SoraVideo AI</a></p>
  `
  await sendEmail(email, subject, html)
}

export async function sendSubscriptionConfirmation(email: string, planName: string, period: string) {
  const subject = "Subscription Activated - SoraVideo AI"
  const html = `
    <h1>Welcome to SoraVideo AI!</h1>
    <p>Your ${planName} ${period} subscription is now active.</p>
    <p>Your credits have been added to your account.</p>
    <p>Start creating at <a href="${process.env.NEXT_PUBLIC_APP_URL}">SoraVideo AI</a></p>
  `
  await sendEmail(email, subject, html)
}

export async function sendCancellationEmail(email: string, planName: string, expiresAt: string) {
  const subject = "Subscription Cancelled - SoraVideo AI"
  const html = `
    <h1>Subscription Cancelled</h1>
    <p>Your ${planName} subscription has been cancelled.</p>
    <p>You'll continue to have access until ${expiresAt}.</p>
    <p>We're sorry to see you go. If you have feedback, please reply to this email.</p>
  `
  await sendEmail(email, subject, html)
}
