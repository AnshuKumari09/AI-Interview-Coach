# from fastapi import Depends, HTTPException
# from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
# from auth.jwt_handler import verify_access_token

# security = HTTPBearer()

# def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
#     token = credentials.credentials

#     payload = verify_access_token(token)

#     if payload is None:
#         raise HTTPException(status_code=401, detail="Invalid or expired token")

#     return payload["sub"]   # email return hoga

from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from auth.jwt_handler import verify_access_token
from database.models import (
    User,
    InterviewSession,
    InterviewQuestion
)
from datetime import datetime
security = HTTPBearer()
#Jo request aayi hai, kya uske paas valid token hai? Agar hai to kaunsa user hai?
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials

    payload = verify_access_token(token)

    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return payload["sub"]   # email return hoga