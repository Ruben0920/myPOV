from datetime import datetime, timezone
import random
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import string
from django.contrib.auth.models import User
import hashlib

def send_email_otp(receiver_email):
    sender_email = "goginyan.ruben@gmail.com"
    receiver_email = receiver_email
    password = "jkfz wdna vrhx aukb"  
    otp = generate_otp()
    subject = "Password Reset"
    body = f"""
    Dear User,

    Here is your OTP: {otp}

    Please use this code to reset your password.

    Regards,
    MY POV SUPPORT TEAM
    """

    
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = receiver_email
    message["Subject"] = subject

    
    message.attach(MIMEText(body, "plain"))

   
    context = ssl.create_default_context()

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
            server.login(sender_email, password)
            server.sendmail(sender_email, receiver_email, message.as_string())
        print("Email sent successfully!")
    except Exception as e:
        print(f"Error occurred: {e}")

def generate_otp():
    otp_digits = str(random.randint(100000, 999999))
    first_letter = random.choice(string.ascii_uppercase)
    second_letter = random.choice(string.ascii_uppercase)
    random_indices = random.sample(range(6), 2)
    otp_list = list(otp_digits) 
    otp_list[random_indices[0]] = first_letter
    otp_list[random_indices[1]] = second_letter
    final_otp = ''.join(otp_list)
    m = hashlib.sha256()
    m.update(final_otp.encode('utf-8'))
    m.hexdigest()
    return final_otp