from apscheduler.schedulers.asyncio import AsyncIOScheduler
from app.db.models import Medicine
from datetime import datetime

scheduler = AsyncIOScheduler()

def trigger_notification(medicine_name: str, dosage: str):
    # Logic to trigger Web Push notification to Service Worker
    # and send WebSocket event to play HTML5 Audio bell
    print(f"BELL RINGING: Time to take {medicine_name}, Dose: {dosage}")

def schedule_medicine(medicine: Medicine):
    if not medicine.is_verified:
        raise ValueError("Cannot schedule unverified medicines. Safety violation.")
    
    # Example: Translate "Twice a day" to 08:00 and 20:00
    # In production, exact times are captured during the Verification Interface step.
    scheduler.add_job(
        trigger_notification, 
        'cron', 
        hour=8, 
        args=[medicine.name, medicine.dosage],
        id=f"med_{medicine.id}_morning"
    )

def start_scheduler():
    scheduler.start()