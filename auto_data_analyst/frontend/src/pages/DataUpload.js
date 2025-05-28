import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';

// Mock data
const mockDatasets = [
  {
    id: 1,
    name: 'customer_data.csv',
    size: '2.5 MB',
    type: 'CSV',
    uploadDate: '2024-02-20',
    rows: 10000,
    columns: 15,
  },
  {
    id: 2,
    name: 'sales_data.xlsx',
    size: '1.8 MB',
    type: 'Excel',
    uploadDate: '2024-02-19',
    rows: 5000,
    columns: 12,
  },
];

const columns = [
  { field: 'name', headerName: 'File Name', width: 200 },
  { field: 'size', headerName: 'Size', width: 100 },
  { field: 'type', headerName: 'Type', width: 100 },
  { field: 'uploadDate', headerName: 'Upload Date', width: 150 },
  { field: 'rows', headerName: 'Rows', width: 100 },
  { field: 'columns', headerName: 'Columns', width: 100 },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 150,
    renderCell: (params) => (
      <Box>
        <IconButton size="small" color="primary">
          <ViewIcon />
        </IconButton>
        <IconButton size="small" color="error">
          <DeleteIcon />
        </IconButton>
      </Box>
    ),
  },
];

function DataUpload() {
  const [openDialog, setOpenDialog] = useState(false);
  const [description, setDescription] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setOpenDialog(true);
    }
  };

  const handleUploadConfirm = () => {
    // Handle file upload logic here
    setOpenDialog(false);
    setDescription('');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Data Upload
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              border: '2px dashed #ccc',
              borderRadius: 2,
            }}
          >
            <input
              type="file"
              accept=".csv,.xlsx,.xls,.parquet"
              style={{ display: 'none' }}
              id="file-upload"
              onChange={handleFileUpload}
            />
            <label htmlFor="file-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<UploadIcon />}
                size="large"
              >
                Upload Dataset
              </Button>
            </label>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Supported formats: CSV, Excel, Parquet
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Uploaded Datasets
            </Typography>
            <DataGrid
              rows={mockDatasets}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              autoHeight
              disableSelectionOnClick
            />
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Dataset Information</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleUploadConfirm} variant="contained">
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DataUpload; 