from sqlalchemy import Column, String, Boolean, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.database import Base
import uuid
from datetime import datetime

class Prescription(Base):
    __tablename__ = "prescriptions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    image_path = Column(String, nullable=False)
    upload_date = Column(DateTime, default=datetime.utcnow)
    
    medicines = relationship("Medicine", back_populates="prescription", cascade="all, delete-orphan")

class Medicine(Base):
    __tablename__ = "medicines"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    prescription_id = Column(String, ForeignKey("prescriptions.id"))
    name = Column(String, nullable=False)
    dosage = Column(String, nullable=True)
    frequency = Column(String, nullable=True)
    food_instruction = Column(String, nullable=True)
    is_verified = Column(Boolean, default=False)
    has_uncertainty = Column(Boolean, default=False)

    prescription = relationship("Prescription", back_populates="medicines")

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class Schedule(Base):
    __tablename__ = "schedules"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    medicine_id = Column(String, ForeignKey("medicines.id"))
    scheduled_time = Column(DateTime, nullable=False)
    status = Column(String, default="pending") # pending, taken, missed