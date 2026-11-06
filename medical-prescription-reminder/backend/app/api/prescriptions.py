from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Prescription, Medicine
from app.services.ocr_service import extract_prescription_data
from pydantic import BaseModel
from typing import List
import shutil
import os

router = APIRouter()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class MedicineUpdate(BaseModel):
    id: str
    name: str
    dosage: str
    frequency: str
    food_instruction: str

class VerificationRequest(BaseModel):
    medicines: List[MedicineUpdate]

@router.post("/upload")
async def upload_prescription(file: UploadFile = File(...), db: Session = Depends(get_db)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    new_rx = Prescription(image_path=file_path)
    db.add(new_rx)
    db.commit()
    db.refresh(new_rx)
    
    try:
        extracted_json = extract_prescription_data(file_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    medicines_data = []
    for med in extracted_json.get("medicines", []):
        new_med = Medicine(
            prescription_id=new_rx.id,
            name=med.get("name", "UNREADABLE"),
            dosage=med.get("dosage", ""),
            frequency=med.get("frequency", ""),
            food_instruction=med.get("food_instruction", ""),
            has_uncertainty=med.get("has_uncertainty", False)
        )
        db.add(new_med)
        db.commit()
        db.refresh(new_med)
        medicines_data.append({
            "id": new_med.id,
            "name": new_med.name,
            "dosage": new_med.dosage,
            "frequency": new_med.frequency,
            "food_instruction": new_med.food_instruction,
            "has_uncertainty": new_med.has_uncertainty
        })
        
    return {"message": "Extracted successfully", "prescription_id": new_rx.id, "medicines": medicines_data}

@router.post("/{prescription_id}/verify")
async def verify_prescription(prescription_id: str, payload: VerificationRequest, db: Session = Depends(get_db)):
    for med_data in payload.medicines:
        db_med = db.query(Medicine).filter(Medicine.id == med_data.id).first()
        if db_med:
            db_med.name = med_data.name
            db_med.dosage = med_data.dosage
            db_med.frequency = med_data.frequency
            db_med.food_instruction = med_data.food_instruction
            db_med.is_verified = True
            db_med.has_uncertainty = False
    
    db.commit()
    return {"message": "Schedule verified and activated successfully."}