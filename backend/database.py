from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime

engine = create_engine("sqlite:///./devscope.db", connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class CodeMetric(Base):
    __tablename__ = "metrics"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    issue_count = Column(Integer)
    # Ensure these names match what you use in main.py
    complexity = Column(String)
    security_score = Column(String)
    maintainability = Column(String)

Base.metadata.create_all(bind=engine)