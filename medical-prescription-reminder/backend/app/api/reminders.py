# backend/app/api/reminders.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.db.database import get_db
from app.db.models import Schedule
from datetime import datetime, timedelta

router = APIRouter()

class AcknowledgeRequest(BaseModel):
    scheduleId: str
    status: str  # e.g., "taken", "missed"

class SnoozeRequest(BaseModel):
    scheduleId: str
    snooze_minutes: int

@router.post("/acknowledge")
def acknowledge_reminder(payload: AcknowledgeRequest, db: Session = Depends(get_db)):
    schedule = db.query(Schedule).filter(Schedule.id == payload.scheduleId).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    # Update status to completed/taken
    schedule.status = payload.status
    db.commit()
    
    return {"message": f"Medicine marked as {payload.status}", "schedule_id": schedule.id}

@router.post("/snooze")
def snooze_reminder(payload: SnoozeRequest, db: Session = Depends(get_db)):
    schedule = db.query(Schedule).filter(Schedule.id == payload.scheduleId).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    # Push the scheduled time forward by X minutes
    # (In a full app, you would also update the APScheduler job here)
    if schedule.scheduled_time:
        schedule.scheduled_time = schedule.scheduled_time + timedelta(minutes=payload.snooze_minutes)
        schedule.status = "pending"
        db.commit()
        
    return {
        "message": f"Reminder snoozed for {payload.snooze_minutes} minutes.", 
        "new_time": schedule.scheduled_time
    }