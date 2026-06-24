# import os
# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker, declarative_base

# DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./interview.db")

# # Render ka URL "postgres://" se start hota hai — SQLAlchemy ko "postgresql://" chahiye
# # if DATABASE_URL.startswith("postgres://"):
# #     DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
# DATABASE_URL = DATABASE_URL
# engine = create_engine(DATABASE_URL)

# SessionLocal = sessionmaker(
#     autocommit=False,
#     autoflush=False,
#     bind=engine
# )

# Base = declarative_base()

import os
from sqlalchemy import create_engine #create_engine() database ke saath connection setup karne ke liye use hota hai
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
load_dotenv() 
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker( #to naya session milega.
    autocommit=False,#Matlab changes automatically save nahi honge. Tumhe khud likhna padega:db.commit()
    autoflush=False, #Autoflush False hone se SQLAlchemy khud se flush nahi karega jab tak zarurat na ho.
    bind=engine #Session ko batata hai: Kis database engine ko use karna hai.
)
Base = declarative_base() #Base = declarative_base() Ye ORM models ki parent class banata hai.