# import bcrypt

# def hash_password(password: str) -> str:
#     password_bytes = password.encode("utf-8")[:72]
#     salt = bcrypt.gensalt()
#     hashed = bcrypt.hashpw(password_bytes, salt)
#     return hashed.decode("utf-8")

# def verify_password(plain_password: str, hashed_password: str) -> bool:
#     plain_bytes = plain_password.encode("utf-8")[:72]
#     hashed_bytes = hashed_password.encode("utf-8")
#     return bcrypt.checkpw(plain_bytes, hashed_bytes)


from passlib.context import CryptContext

pwd_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto"
)

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)