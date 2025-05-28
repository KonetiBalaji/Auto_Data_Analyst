import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  Tabs,
  Tab,
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Mock data
const correlationData = [
  { feature1: 'Age', feature2: 'Income', correlation: 0.75 },
  { feature1: 'Education', feature2: 'Income', correlation: 0.82 },
  { feature1: 'Experience', feature2: 'Income', correlation: 0.68 },
  { feature1: 'Skills', feature2: 'Income', correlation: 0.91 },
];

const distributionData = [
  { name: 'Category A', value: 400 },
  { name: 'Category B', value: 300 },
  { name: 'Category C', value: 300 },
  { name: 'Category D', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function Analysis() {
  const [selectedDataset, setSelectedDataset] = useState('');
  const [selectedAnalysis, setSelectedAnalysis] = useState('');
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Data Analysis
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Select Dataset</InputLabel>
                  <Select
                    value={selectedDataset}
                    onChange={(e) => setSelectedDataset(e.target.value)}
                  >
                    <MenuItem value="dataset1">Customer Data</MenuItem>
                    <MenuItem value="dataset2">Sales Data</MenuItem>
                    <MenuItem value="dataset3">Employee Data</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Analysis Type</InputLabel>
                  <Select
                    value={selectedAnalysis}
                    onChange={(e) => setSelectedAnalysis(e.target.value)}
                  >
                    <MenuItem value="correlation">Correlation Analysis</MenuItem>
                    <MenuItem value="distribution">Distribution Analysis</MenuItem>
                    <MenuItem value="trends">Trend Analysis</MenuItem>
                    <MenuItem value="outliers">Outlier Detection</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  variant="contained"
                  fullWidth
                  disabled={!selectedDataset || !selectedAnalysis}
                >
                  Run Analysis
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Overview" />
              <Tab label="Correlations" />
              <Tab label="Distributions" />
              <Tab label="Trends" />
            </Tabs>

            <Box sx={{ mt: 2 }}>
              {tabValue === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Feature Correlations
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={correlationData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="feature1" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="correlation" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Data Distribution
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={distributionData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) =>
                                `${name} ${(percent * 100).toFixed(0)}%`
                              }
                            >
                              {distributionData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}

              {tabValue === 1 && (
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid />
                      <XAxis type="number" dataKey="x" name="Feature 1" />
                      <YAxis type="number" dataKey="y" name="Feature 2" />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter name="Data Points" data={[]} fill="#8884d8" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </Box>
              )}

              {tabValue === 2 && (
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              )}

              {tabValue === 3 && (
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid />
                      <XAxis type="number" dataKey="x" name="Feature 1" />
                      <YAxis type="number" dataKey="y" name="Feature 2" />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter name="Outliers" data={[]} fill="#ff8042" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Analysis; 