import pandas as pd
import numpy as np
from typing import Dict, Any, List, Optional, Tuple
import logging
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, mean_squared_error, r2_score
import xgboost as xgb
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.linear_model import LogisticRegression, LinearRegression
import joblib
import os
from datetime import datetime

logger = logging.getLogger(__name__)

class AutoMLEngine:
    def __init__(self):
        self.models = {
            'classification': {
                'xgboost': xgb.XGBClassifier(),
                'random_forest': RandomForestClassifier(),
                'logistic': LogisticRegression()
            },
            'regression': {
                'xgboost': xgb.XGBRegressor(),
                'random_forest': RandomForestRegressor(),
                'linear': LinearRegression()
            }
        }
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
        self.model_dir = "models"
        os.makedirs(self.model_dir, exist_ok=True)

    def detect_problem_type(self, target: pd.Series) -> str:
        """Detect if the problem is classification or regression"""
        unique_values = target.nunique()
        if unique_values <= 10:  # Arbitrary threshold for classification
            return 'classification'
        return 'regression'

    def preprocess_data(self, df: pd.DataFrame, target_column: str) -> Tuple[np.ndarray, np.ndarray, Dict[str, Any]]:
        """Preprocess the data for model training"""
        # Handle missing values
        df = df.fillna(df.mean())
        
        # Separate features and target
        X = df.drop(columns=[target_column])
        y = df[target_column]
        
        # Encode categorical variables
        categorical_columns = X.select_dtypes(include=['object']).columns
        encoding_map = {}
        
        for col in categorical_columns:
            X[col] = self.label_encoder.fit_transform(X[col])
            encoding_map[col] = dict(zip(self.label_encoder.classes_, self.label_encoder.transform(self.label_encoder.classes_)))
        
        # Scale numerical features
        numerical_columns = X.select_dtypes(include=[np.number]).columns
        X[numerical_columns] = self.scaler.fit_transform(X[numerical_columns])
        
        # Convert to numpy arrays
        X = X.values
        y = y.values
        
        return X, y, {
            'categorical_encoding': encoding_map,
            'numerical_columns': numerical_columns.tolist(),
            'categorical_columns': categorical_columns.tolist()
        }

    def train_models(self, df: pd.DataFrame, target_column: str) -> Dict[str, Any]:
        """Train multiple models and select the best one"""
        try:
            # Detect problem type
            problem_type = self.detect_problem_type(df[target_column])
            logger.info(f"Detected problem type: {problem_type}")
            
            # Preprocess data
            X, y, preprocessing_info = self.preprocess_data(df, target_column)
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
            
            # Train and evaluate models
            results = {}
            best_model = None
            best_score = float('-inf')
            
            for model_name, model in self.models[problem_type].items():
                logger.info(f"Training {model_name}...")
                
                # Train model
                model.fit(X_train, y_train)
                
                # Make predictions
                y_pred = model.predict(X_test)
                
                # Calculate metrics
                if problem_type == 'classification':
                    metrics = {
                        'accuracy': accuracy_score(y_test, y_pred),
                        'precision': precision_score(y_test, y_pred, average='weighted'),
                        'recall': recall_score(y_test, y_pred, average='weighted'),
                        'f1': f1_score(y_test, y_pred, average='weighted')
                    }
                else:
                    metrics = {
                        'mse': mean_squared_error(y_test, y_pred),
                        'rmse': np.sqrt(mean_squared_error(y_test, y_pred)),
                        'r2': r2_score(y_test, y_pred)
                    }
                
                results[model_name] = {
                    'metrics': metrics,
                    'model': model
                }
                
                # Update best model
                if problem_type == 'classification':
                    score = metrics['f1']
                else:
                    score = -metrics['rmse']  # Negative because lower is better for RMSE
                
                if score > best_score:
                    best_score = score
                    best_model = model_name
            
            # Save best model
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            model_filename = f"{timestamp}_{best_model}_{problem_type}.joblib"
            model_path = os.path.join(self.model_dir, model_filename)
            
            joblib.dump({
                'model': results[best_model]['model'],
                'preprocessing_info': preprocessing_info,
                'problem_type': problem_type
            }, model_path)
            
            return {
                'best_model': best_model,
                'best_model_path': model_path,
                'all_results': results,
                'preprocessing_info': preprocessing_info,
                'problem_type': problem_type
            }
            
        except Exception as e:
            logger.error(f"Error in model training: {str(e)}")
            raise

    def predict(self, model_path: str, data: pd.DataFrame) -> np.ndarray:
        """Make predictions using a trained model"""
        try:
            # Load model and preprocessing info
            model_data = joblib.load(model_path)
            model = model_data['model']
            preprocessing_info = model_data['preprocessing_info']
            
            # Preprocess new data
            X = data.copy()
            
            # Encode categorical variables
            for col, encoding_map in preprocessing_info['categorical_encoding'].items():
                X[col] = X[col].map(encoding_map)
            
            # Scale numerical features
            X[preprocessing_info['numerical_columns']] = self.scaler.transform(X[preprocessing_info['numerical_columns']])
            
            # Make predictions
            predictions = model.predict(X)
            
            return predictions
            
        except Exception as e:
            logger.error(f"Error in prediction: {str(e)}")
            raise

    def get_feature_importance(self, model_path: str) -> Dict[str, float]:
        """Get feature importance from the trained model"""
        try:
            model_data = joblib.load(model_path)
            model = model_data['model']
            preprocessing_info = model_data['preprocessing_info']
            
            # Get feature names
            feature_names = (preprocessing_info['numerical_columns'] + 
                           preprocessing_info['categorical_columns'])
            
            # Get feature importance
            if hasattr(model, 'feature_importances_'):
                importance = model.feature_importances_
            elif hasattr(model, 'coef_'):
                importance = np.abs(model.coef_)
            else:
                raise ValueError("Model doesn't support feature importance")
            
            # Create feature importance dictionary
            importance_dict = dict(zip(feature_names, importance))
            
            # Sort by importance
            importance_dict = dict(sorted(importance_dict.items(), 
                                        key=lambda x: x[1], 
                                        reverse=True))
            
            return importance_dict
            
        except Exception as e:
            logger.error(f"Error getting feature importance: {str(e)}")
            raise 