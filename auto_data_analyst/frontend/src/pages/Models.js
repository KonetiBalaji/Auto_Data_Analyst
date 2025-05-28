import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
} from '@mui/material';
import {
  PlayArrow as TrainIcon,
  Delete as DeleteIcon,
  Assessment as EvaluateIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';

// Mock data
const mockModels = [
  {
    id: 1,
    name: 'Customer Churn Predictor',
    type: 'Classification',
    algorithm: 'XGBoost',
    accuracy: 0.89,
    status: 'Active',
    lastTrained: '2024-02-20',
    features: 15,
  },
  {
    id: 2,
    name: 'Sales Forecast',
    type: 'Regression',
    algorithm: 'Random Forest',
    accuracy: 0.92,
    status: 'Active',
    lastTrained: '2024-02-19',
    features: 12,
  },
];

const columns = [
  { field: 'name', headerName: 'Model Name', width: 200 },
  { field: 'type', headerName: 'Type', width: 120 },
  { field: 'algorithm', headerName: 'Algorithm', width: 150 },
  { field: 'accuracy', headerName: 'Accuracy', width: 100 },
  { field: 'status', headerName: 'Status', width: 100 },
  { field: 'lastTrained', headerName: 'Last Trained', width: 150 },
  { field: 'features', headerName: 'Features', width: 100 },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 200,
    renderCell: (params) => (
      <Box>
        <Button
          size="small"
          startIcon={<EvaluateIcon />}
          sx={{ mr: 1 }}
        >
          Evaluate
        </Button>
        <Button
          size="small"
          color="error"
          startIcon={<DeleteIcon />}
        >
          Delete
        </Button>
      </Box>
    ),
  },
];

function Models() {
  const [openDialog, setOpenDialog] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [selectedModel, setSelectedModel] = useState({
    name: '',
    type: '',
    algorithm: '',
    dataset: '',
  });

  const handleTrainModel = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedModel({
      name: '',
      type: '',
      algorithm: '',
      dataset: '',
    });
  };

  const handleStartTraining = () => {
    setOpenDialog(false);
    // Simulate training progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setTrainingProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 1000);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Model Management
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Trained Models</Typography>
              <Button
                variant="contained"
                startIcon={<TrainIcon />}
                onClick={handleTrainModel}
              >
                Train New Model
              </Button>
            </Box>
            <DataGrid
              rows={mockModels}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              autoHeight
              disableSelectionOnClick
            />
          </Paper>
        </Grid>

        {trainingProgress > 0 && trainingProgress < 100 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Training Progress
              </Typography>
              <LinearProgress variant="determinate" value={trainingProgress} />
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {trainingProgress}% Complete
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Train New Model</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Model Name"
                value={selectedModel.name}
                onChange={(e) =>
                  setSelectedModel({ ...selectedModel, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Model Type</InputLabel>
                <Select
                  value={selectedModel.type}
                  onChange={(e) =>
                    setSelectedModel({ ...selectedModel, type: e.target.value })
                  }
                >
                  <MenuItem value="classification">Classification</MenuItem>
                  <MenuItem value="regression">Regression</MenuItem>
                  <MenuItem value="clustering">Clustering</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Algorithm</InputLabel>
                <Select
                  value={selectedModel.algorithm}
                  onChange={(e) =>
                    setSelectedModel({
                      ...selectedModel,
                      algorithm: e.target.value,
                    })
                  }
                >
                  <MenuItem value="xgboost">XGBoost</MenuItem>
                  <MenuItem value="random_forest">Random Forest</MenuItem>
                  <MenuItem value="logistic">Logistic Regression</MenuItem>
                  <MenuItem value="linear">Linear Regression</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Dataset</InputLabel>
                <Select
                  value={selectedModel.dataset}
                  onChange={(e) =>
                    setSelectedModel({
                      ...selectedModel,
                      dataset: e.target.value,
                    })
                  }
                >
                  <MenuItem value="dataset1">Customer Data</MenuItem>
                  <MenuItem value="dataset2">Sales Data</MenuItem>
                  <MenuItem value="dataset3">Employee Data</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleStartTraining}
            variant="contained"
            disabled={
              !selectedModel.name ||
              !selectedModel.type ||
              !selectedModel.algorithm ||
              !selectedModel.dataset
            }
          >
            Start Training
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Models; 