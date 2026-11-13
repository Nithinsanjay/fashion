import os
import smtplib
import random
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_EMAIL = os.getenv("SMTP_EMAIL")       # Your Gmail address
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD") # Your 16-character Google App Password

# In-memory OTP storage: { "user@example.com": "123456" }
# For production, you can store this in a temporary DB table or Redis
OTP_STORAGE = {}

def generate_otp() -> str:
    """Generates a random 6-digit numeric OTP."""
    return str(random.randint(100000, 999999))

def send_otp_email(recipient_email: str) -> str:
    """Sends a 6-digit OTP to the recipient email for free using Gmail."""
    otp = generate_otp()
    OTP_STORAGE[recipient_email] = otp

    # HTML Email Template
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Your 69 Store Verification Code"
    msg["From"] = f"69 Store <{SMTP_EMAIL}>"
    msg["To"] = recipient_email

    html_content = f"""
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 24px; border: 1px solid #e5e5e5; rounded: 16px;">
        <h2 style="color: #1c1917; text-align: center; margin-bottom: 8px;">69 STORE</h2>
        <p style="color: #78716c; text-align: center; font-size: 13px;">Streetwear & Vintage Boutique</p>
        <hr style="border: 0; border-top: 1px solid #e5e5e5; margin: 20px 0;">
        <p style="font-size: 14px; color: #44403c;">Use the following one-time code to complete your verification:</p>
        <div style="background-color: #f5f5f4; border-radius: 12px; padding: 18px; text-align: center; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #1c1917;">{otp}</span>
        </div>
        <p style="font-size: 12px; color: #a8a29e; text-align: center;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
    </div>
    """
    msg.attach(MIMEText(html_content, "html"))

    # Connect to Gmail SMTP server
    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        server.sendmail(SMTP_EMAIL, recipient_email, msg.as_string())

    return otp

def verify_otp(email: str, entered_otp: str) -> bool:
    """Verifies the OTP provided by the user."""
    stored_otp = OTP_STORAGE.get(email)
    if stored_otp and stored_otp == entered_otp:
        del OTP_STORAGE[email] # Clear once used
        return True
    return False