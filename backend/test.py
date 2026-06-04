from passlib.context import CryptContext

pwd_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto"
)



hash = pwd_context.hash("hello123")
print(hash)

print(pwd_context.verify("hello123", hash))