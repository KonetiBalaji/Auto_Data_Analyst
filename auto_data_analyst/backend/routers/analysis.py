from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional, Dict, Any
import pandas as pd
import numpy as np
from datetime import datetime
import logging
import os
from .data import UPLOAD_DIR

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/analyze/{filename}")
async def analyze_dataset(
    filename: str,
    target_column: Optional[str] = None,
    analysis_type: str = "auto"
):
    """
    Perform automated analysis on a dataset
    """
    try:
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
        
        # Perform analysis
        analysis_results = {
            "basic_stats": get_basic_stats(df),
            "correlation": get_correlation_matrix(df),
            "missing_analysis": analyze_missing_values(df),
            "outlier_analysis": detect_outliers(df),
            "data_quality_score": calculate_data_quality_score(df)
        }
        
        if target_column and target_column in df.columns:
            analysis_results["target_analysis"] = analyze_target(df, target_column)
        
        return analysis_results
        
    except Exception as e:
        logger.error(f"Error analyzing dataset: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

def get_basic_stats(df: pd.DataFrame) -> Dict[str, Any]:
    """Calculate basic statistics for numeric columns"""
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    stats = {}
    
    for col in numeric_cols:
        stats[col] = {
            "mean": float(df[col].mean()),
            "median": float(df[col].median()),
            "std": float(df[col].std()),
            "min": float(df[col].min()),
            "max": float(df[col].max()),
            "skew": float(df[col].skew()),
            "kurtosis": float(df[col].kurtosis())
        }
    
    return stats

def get_correlation_matrix(df: pd.DataFrame) -> Dict[str, Dict[str, float]]:
    """Calculate correlation matrix for numeric columns"""
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    corr_matrix = df[numeric_cols].corr()
    return corr_matrix.to_dict()

def analyze_missing_values(df: pd.DataFrame) -> Dict[str, Any]:
    """Analyze missing values in the dataset"""
    missing_stats = df.isnull().sum()
    missing_percentage = (missing_stats / len(df)) * 100
    
    return {
        "missing_counts": missing_stats.to_dict(),
        "missing_percentages": missing_percentage.to_dict(),
        "total_missing": int(missing_stats.sum()),
        "missing_columns": missing_stats[missing_stats > 0].index.tolist()
    }

def detect_outliers(df: pd.DataFrame) -> Dict[str, List[int]]:
    """Detect outliers using IQR method"""
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    outliers = {}
    
    for col in numeric_cols:
        Q1 = df[col].quantile(0.25)
        Q3 = df[col].quantile(0.75)
        IQR = Q3 - Q1
        
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR
        
        outlier_indices = df[(df[col] < lower_bound) | (df[col] > upper_bound)].index.tolist()
        outliers[col] = outlier_indices
    
    return outliers

def calculate_data_quality_score(df: pd.DataFrame) -> float:
    """Calculate overall data quality score"""
    # Factors to consider:
    # 1. Missing values
    # 2. Data type consistency
    # 3. Outlier presence
    # 4. Duplicate rows
    
    missing_score = 1 - (df.isnull().sum().sum() / (df.shape[0] * df.shape[1]))
    
    # Check for duplicate rows
    duplicate_score = 1 - (df.duplicated().sum() / len(df))
    
    # Check for outliers
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    outlier_scores = []
    for col in numeric_cols:
        Q1 = df[col].quantile(0.25)
        Q3 = df[col].quantile(0.75)
        IQR = Q3 - Q1
        outliers = df[(df[col] < Q1 - 1.5 * IQR) | (df[col] > Q3 + 1.5 * IQR)]
        outlier_scores.append(1 - (len(outliers) / len(df)))
    
    outlier_score = np.mean(outlier_scores) if outlier_scores else 1.0
    
    # Calculate final score (weighted average)
    final_score = (0.4 * missing_score + 0.3 * duplicate_score + 0.3 * outlier_score) * 100
    
    return round(final_score, 2)

def analyze_target(df: pd.DataFrame, target_column: str) -> Dict[str, Any]:
    """Analyze target variable"""
    target_analysis = {
        "distribution": {
            "mean": float(df[target_column].mean()),
            "median": float(df[target_column].median()),
            "std": float(df[target_column].std()),
            "min": float(df[target_column].min()),
            "max": float(df[target_column].max())
        }
    }
    
    # Add histogram data
    if df[target_column].dtype in [np.int64, np.float64]:
        hist, bins = np.histogram(df[target_column].dropna(), bins=10)
        target_analysis["histogram"] = {
            "counts": hist.tolist(),
            "bins": bins.tolist()
        }
    
    return target_analysis 