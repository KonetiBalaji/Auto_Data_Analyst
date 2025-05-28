from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from typing import Dict, Any, Optional
import pandas as pd
import os
import logging
from ..ml_engine import AutoMLEngine
from .data import UPLOAD_DIR

router = APIRouter()
logger = logging.getLogger(__name__)

# Initialize ML engine
ml_engine = AutoMLEngine()

@router.post("/train/{filename}")
async def train_model(
    filename: str,
    target_column: str,
    model_type: Optional[str] = None
):
    """
    Train a machine learning model on the specified dataset
    """
    try:
        # Load dataset
        filepath = os.path.join(UPLOAD_DIR, filename)
        if not os.path.exists(filepath):
            raise HTTPException(status_code=404, detail="File not found")
        
        # Read dataset
        file_ext = os.path.splitext(filename)[1].lower()
        if file_ext == ".csv":
            df = pd.read_csv(filepath)
        elif file_ext in [".xlsx", ".xls"]:
            df = pd.read_excel(filepath)
        elif file_ext == ".parquet":
            df = pd.read_parquet(filepath)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type")
        
        # Validate target column
        if target_column not in df.columns:
            raise HTTPException(
                status_code=400,
                detail=f"Target column '{target_column}' not found in dataset"
            )
        
        # Train models
        training_results = ml_engine.train_models(df, target_column)
        
        return {
            "message": "Model training completed successfully",
            "best_model": training_results['best_model'],
            "model_path": training_results['best_model_path'],
            "problem_type": training_results['problem_type'],
            "metrics": training_results['all_results'][training_results['best_model']]['metrics']
        }
        
    except Exception as e:
        logger.error(f"Error training model: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/predict/{model_filename}")
async def make_predictions(
    model_filename: str,
    file: UploadFile = File(...)
):
    """
    Make predictions using a trained model
    """
    try:
        # Load model
        model_path = os.path.join(ml_engine.model_dir, model_filename)
        if not os.path.exists(model_path):
            raise HTTPException(status_code=404, detail="Model not found")
        
        # Read prediction data
        content = await file.read()
        df = pd.read_csv(pd.io.common.BytesIO(content))
        
        # Make predictions
        predictions = ml_engine.predict(model_path, df)
        
        return {
            "predictions": predictions.tolist()
        }
        
    except Exception as e:
        logger.error(f"Error making predictions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/models")
async def list_models():
    """
    List all trained models
    """
    try:
        models = []
        for filename in os.listdir(ml_engine.model_dir):
            if filename.endswith('.joblib'):
                model_path = os.path.join(ml_engine.model_dir, filename)
                stats = os.stat(model_path)
                
                # Get model info
                model_data = ml_engine.get_feature_importance(model_path)
                
                models.append({
                    "filename": filename,
                    "size": stats.st_size,
                    "created": os.path.getctime(model_path),
                    "modified": os.path.getmtime(model_path),
                    "feature_importance": model_data
                })
        
        return models
        
    except Exception as e:
        logger.error(f"Error listing models: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/models/{model_filename}/importance")
async def get_feature_importance(model_filename: str):
    """
    Get feature importance for a trained model
    """
    try:
        model_path = os.path.join(ml_engine.model_dir, model_filename)
        if not os.path.exists(model_path):
            raise HTTPException(status_code=404, detail="Model not found")
        
        importance = ml_engine.get_feature_importance(model_path)
        
        return {
            "feature_importance": importance
        }
        
    except Exception as e:
        logger.error(f"Error getting feature importance: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e)) 