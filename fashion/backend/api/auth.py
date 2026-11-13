from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from core.database import get_db
from core.security import hash_password, verify_password, create_access_token
from models.user import User
from schemas.user import UserRegister, UserLogin, UserResponse
from pydantic import BaseModel, EmailStr
from core.email import send_otp_email, verify_otp

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    # 1. Check if user already exists
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )

    # 2. Hash password & create user
    new_user = User(
        full_name=user_in.full_name,
        email=user_in.email,
        hashed_password=hash_password(user_in.password),
        preferred_department=user_in.preferred_department or "unisex"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": str(new_user.id), "email": new_user.email})
    new_user.access_token = token
    new_user.token_type = "bearer"
    return new_user

@router.post("/login", response_model=UserResponse)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    token = create_access_token({"sub": str(user.id), "email": user.email})
    user.access_token = token
    user.token_type = "bearer"
    return user


class SendOTPRequest(BaseModel):
    email: EmailStr
class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str
@router.post("/send-otp")
def request_otp(data: SendOTPRequest):
    try:
        send_otp_email(data.email)
        return {"success": True, "message": f"Verification OTP sent to {data.email}"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to send email: {str(e)}"
        )
@router.post("/verify-otp")
def check_otp(data: VerifyOTPRequest):
    is_valid = verify_otp(data.email, data.otp)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP."
        )
    return {"success": True, "message": "Email verified successfully."}



class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str
    new_password: str

@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    # 1. Verify OTP
    if not verify_otp(data.email, data.otp):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP.")

    # 2. Find user in database
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User account not found.")

    # 3. Update hashed password
    user.hashed_password = hash_password(data.new_password)
    db.commit()
    return {"success": True, "message": "Password reset successfully. You can now log in."}