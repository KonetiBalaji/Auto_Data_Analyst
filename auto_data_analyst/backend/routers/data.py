from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from typing import List, Optional
import pandas as pd
import logging
from datetime import datetime
import os

router = APIRouter()
logger = logging.getLogger(__name__)

# Configure upload directory
UPLOAD_DIR = "datasets"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_dataset(
    file: UploadFile = File(...),
    description: Optional[str] = None
):
    """
    Upload a dataset file (CSV, Excel, etc.)
    """
    try:
        # Validate file type
        allowed_types = [".csv", ".xlsx", ".xls", ".parquet"]
        file_ext = os.path.splitext(file.filename)[1].lower()
        
        if file_ext not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail=f"File type not supported. Allowed types: {', '.join(allowed_types)}"
            )
        
        # Save file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}_{file.filename}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        
        with open(filepath, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Read and validate data
        if file_ext == ".csv":
            df = pd.read_csv(filepath)
        elif file_ext in [".xlsx", ".xls"]:
            df = pd.read_excel(filepath)
        elif file_ext == ".parquet":
            df = pd.read_parquet(filepath)
        
        # Basic data validation
        validation_results = {
            "rows": len(df),
            "columns": len(df.columns),
            "missing_values": df.isnull().sum().to_dict(),
            "data_types": df.dtypes.astype(str).to_dict()
        }
        
        return {
            "message": "File uploaded successfully",
            "filename": filename,
            "validation": validation_results
        }
        
    except Exception as e:
        logger.error(f"Error uploading file: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/datasets")
async def list_datasets():
    """
    List all available datasets
    """
    try:
        datasets = []
        for filename in os.listdir(UPLOAD_DIR):
            filepath = os.path.join(UPLOAD_DIR, filename)
            stats = os.stat(filepath)
            datasets.append({
                "filename": filename,
                "size": stats.st_size,
                "created": datetime.fromtimestamp(stats.st_ctime).isoformat(),
                "modified": datetime.fromtimestamp(stats.st_mtime).isoformat()
            })
        return datasets
    except Exception as e:
        logger.error(f"Error listing datasets: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/datasets/{filename}/preview")
async def preview_dataset(filename: str, rows: int = 5):
    """
    Preview a dataset
    """
    try:
        filepath = os.path.join(UPLOAD_DIR, filename)
        if not os.path.exists(filepath):
            raise HTTPException(status_code=404, detail="File not found")
        
        file_ext = os.path.splitext(filename)[1].lower()
        if file_ext == ".csv":
            df = pd.read_csv(filepath)
        elif file_ext in [".xlsx", ".xls"]:
            df = pd.read_excel(filepath)
        elif file_ext == ".parquet":
            df = pd.read_parquet(filepath)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type")
        
        return {
            "preview": df.head(rows).to_dict(orient="records"),
            "columns": df.columns.tolist(),
            "dtypes": df.dtypes.astype(str).to_dict()
        }
        
    except Exception as e:
        logger.error(f"Error previewing dataset: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e)) 