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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';

// Mock data
const mockReports = [
  {
    id: 1,
    title: 'Customer Churn Analysis',
    type: 'Analysis Report',
    created: '2024-02-20',
    status: 'Completed',
    size: '2.5 MB',
    format: 'PDF',
  },
  {
    id: 2,
    title: 'Sales Forecast Q1 2024',
    type: 'Forecast Report',
    created: '2024-02-19',
    status: 'Completed',
    size: '1.8 MB',
    format: 'PDF',
  },
];

const columns = [
  { field: 'title', headerName: 'Report Title', width: 250 },
  { field: 'type', headerName: 'Type', width: 150 },
  { field: 'created', headerName: 'Created', width: 120 },
  { field: 'status', headerName: 'Status', width: 120 },
  { field: 'size', headerName: 'Size', width: 100 },
  { field: 'format', headerName: 'Format', width: 100 },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 200,
    renderCell: (params) => (
      <Box>
        <IconButton size="small" color="primary">
          <DownloadIcon />
        </IconButton>
        <IconButton size="small" color="primary">
          <ShareIcon />
        </IconButton>
        <IconButton size="small" color="error">
          <DeleteIcon />
        </IconButton>
      </Box>
    ),
  },
];

function Reports() {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState({
    title: '',
    type: '',
    format: '',
    description: '',
  });

  const handleCreateReport = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReport({
      title: '',
      type: '',
      format: '',
      description: '',
    });
  };

  const handleGenerateReport = () => {
    // Handle report generation logic here
    setOpenDialog(false);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Generated Reports</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateReport}
              >
                Create Report
              </Button>
            </Box>
            <DataGrid
              rows={mockReports}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              autoHeight
              disableSelectionOnClick
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Reports
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {mockReports.map((report) => (
                  <Chip
                    key={report.id}
                    label={report.title}
                    onClick={() => {}}
                    onDelete={() => {}}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Report Templates
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip label="Standard Analysis" />
                <Chip label="Executive Summary" />
                <Chip label="Technical Deep Dive" />
                <Chip label="Custom Template" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Report</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Report Title"
                value={selectedReport.title}
                onChange={(e) =>
                  setSelectedReport({ ...selectedReport, title: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={selectedReport.type}
                  onChange={(e) =>
                    setSelectedReport({ ...selectedReport, type: e.target.value })
                  }
                >
                  <MenuItem value="analysis">Analysis Report</MenuItem>
                  <MenuItem value="forecast">Forecast Report</MenuItem>
                  <MenuItem value="summary">Executive Summary</MenuItem>
                  <MenuItem value="technical">Technical Report</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Format</InputLabel>
                <Select
                  value={selectedReport.format}
                  onChange={(e) =>
                    setSelectedReport({
                      ...selectedReport,
                      format: e.target.value,
                    })
                  }
                >
                  <MenuItem value="pdf">PDF</MenuItem>
                  <MenuItem value="excel">Excel</MenuItem>
                  <MenuItem value="word">Word</MenuItem>
                  <MenuItem value="html">HTML</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={selectedReport.description}
                onChange={(e) =>
                  setSelectedReport({
                    ...selectedReport,
                    description: e.target.value,
                  })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleGenerateReport}
            variant="contained"
            disabled={
              !selectedReport.title ||
              !selectedReport.type ||
              !selectedReport.format
            }
          >
            Generate Report
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Reports; 