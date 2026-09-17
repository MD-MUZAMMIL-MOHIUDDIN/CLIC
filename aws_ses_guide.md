# Step-by-Step Guide: Getting Started with Amazon SES

This guide outlines how to set up Amazon Simple Email Service (SES) with your custom domain to send automated notifications for the CLIC application.

---

## Step 1: Purchase Your Domain Name
Before setting up AWS SES, you must own a domain name (e.g., `yourdomain.com`).
* You can buy this from any registrar such as GoDaddy, Hostinger, Namecheap, or Route 53 (AWS).

---

## Step 2: Create / Log in to the AWS Console
1. Go to the [AWS Management Console](https://aws.amazon.com/).
2. Create a free account (requires a credit card for verification; AWS will charge a temporary ₹2 authorization fee which is immediately refunded).
3. Search for **"Simple Email Service"** or **"SES"** in the top search bar.

---

## Step 3: Verify Your Custom Domain in SES
To send emails from your domain, you must prove to AWS that you own it.

1. In the AWS SES dashboard, click on **Verified identities** in the left sidebar.
2. Click **Create identity**.
3. Choose **Domain** as the identity type.
4. Enter your domain name (e.g., `yourdomain.com`).
5. Leave "Easy DKIM" selected and click **Create identity**.
6. AWS will generate a set of **CNAME records** (usually 3 records). 
7. Copy these CNAME records and add them to your domain registrar's DNS settings (GoDaddy, Hostinger, etc.).
   * *Example: Add Name: `_domainkey` and Value: `dkim.amazonses.com`.*
8. It takes between 10 minutes to a few hours for the DNS records to propagate. Once verified, the Identity Status will change to **Verified** (Green).

---

## Step 4: Create SMTP Credentials (For App Integration)
To connect your backend code (e.g., Node.js, Python, or Go) to AWS SES, you need SMTP username and password credentials.

1. In the AWS SES console, click on **SMTP settings** in the left sidebar.
2. Copy the **SMTP endpoint** (e.g., `email-smtp.ap-south-1.amazonaws.com` for the Mumbai region).
3. Click **Create SMTP credentials**.
4. AWS will prompt you to create an IAM User. Keep the default name and click **Create**.
5. **IMPORTANT:** Download the credentials immediately (CSV file) or click "Show User SMTP Security Credentials". Copy the **SMTP Username** and **SMTP Password**. 
   * *Note: These are different from your standard AWS access keys.*

---

## Step 5: Requesting Sandbox Exit (Production Access)
By default, new AWS accounts are placed in the **SES Sandbox**. 
* **Sandbox limitation:** You can only send emails to addresses you have manually verified (e.g., your own personal email).
* **To exit the sandbox (for launching the app):**
  1. Click the **"Request production access"** alert banner at the top of your SES dashboard.
  2. Select **Marketing** or **Transactional** (choose transactional for CLIC).
  3. Fill out the request form explaining how you will build your mailing list and handle bounces:
     * *Example template:* "We are launching the CLIC portal, an agricultural advisory app. We will send transactional OTPs for login, weather alerts, and user registration confirmations only to registered farmers. Bounces will be handled programmatically."
  4. AWS support usually reviews and approves sandbox exit requests within 24 hours.

---

## Step 6: Backend Node.js Integration Sample
Once you have your credentials and verified domain, configure your backend using a library like `nodemailer`:

```javascript
import nodemailer from 'nodemailer';

// Configure the SMTP Transporter
const transporter = nodemailer.createTransport({
  host: 'email-smtp.ap-south-1.amazonaws.com', // Replace with your AWS SES SMTP Endpoint
  port: 465, // Secure SSL port
  secure: true, // Use SSL/TLS
  auth: {
    user: 'YOUR_SES_SMTP_USERNAME', // Copied in Step 4
    pass: 'YOUR_SES_SMTP_PASSWORD'  // Copied in Step 4
  }
});

// Mail Options
const mailOptions = {
  from: '"CLIC Alerts" <alerts@yourdomain.com>', // Any prefix you want
  to: 'recipient@gmail.com',
  subject: 'Crop Alert: Storm Warning',
  html: '<h3>Weather Warning</h3><p>Heavy rains are expected in your block. Delay fertilizing.</p>'
};

// Send the Email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log('Error sending email:', error);
  }
  console.log('Email sent successfully:', info.messageId);
});
```
