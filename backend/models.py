# Database tables (Historical data for graph)
from sqlalchemy import Column, Integer, String, DateTime
from database import Base
import datetime

class CodeMetric(Base):
    __tablename__ = "metrics"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    issue_count = Column(Integer)
    complexity = Column(String)
    security_score = Column(String)
    maintainability = Column(String)