import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { settingsApi } from '../utils/api';

function Settings() {
  const [settings, setSettings] = useState({
    darkMode: true,
    notifications: true,
    autoSave: true,
    language: 'en',
    timezone: 'UTC',
    dataRetention: '30',
    maxFileSize: '100',
  });
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [newApiKey, setNewApiKey] = useState('');

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await settingsApi.get();
      setSettings(res.data);
      // Optionally fetch API keys if endpoint exists
      // const keysRes = await settingsApi.listApiKeys();
      // setApiKeys(keysRes.data);
    } catch (err) {
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSettingChange = (setting) => (event) => {
    setSettings({
      ...settings,
      [setting]: event.target.checked,
    });
  };

  const handleSelectChange = (setting) => (event) => {
    setSettings({
      ...settings,
      [setting]: event.target.value,
    });
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      await settingsApi.update(settings);
      fetchSettings();
    } catch (err) {
      setError('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateApiKey = async (name) => {
    setLoading(true);
    try {
      await settingsApi.createApiKey(name);
      // Optionally refresh API keys
      // fetchSettings();
    } catch (err) {
      setError('Failed to create API key');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteApiKey = async (id) => {
    setLoading(true);
    try {
      await settingsApi.deleteApiKey(id);
      // Optionally refresh API keys
      // fetchSettings();
    } catch (err) {
      setError('Failed to delete API key');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Grid container spacing={3}>
        {/* General Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              General Settings
            </Typography>
            <List>
              <ListItem>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.darkMode}
                      onChange={handleSettingChange('darkMode')}
                    />
                  }
                  label="Dark Mode"
                />
              </ListItem>
              <ListItem>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications}
                      onChange={handleSettingChange('notifications')}
                    />
                  }
                  label="Enable Notifications"
                />
              </ListItem>
              <ListItem>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoSave}
                      onChange={handleSettingChange('autoSave')}
                    />
                  }
                  label="Auto Save"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* System Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              System Settings
            </Typography>
            <List>
              <ListItem>
                <FormControl fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={settings.language}
                    onChange={handleSelectChange('language')}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Spanish</MenuItem>
                    <MenuItem value="fr">French</MenuItem>
                    <MenuItem value="de">German</MenuItem>
                  </Select>
                </FormControl>
              </ListItem>
              <ListItem>
                <FormControl fullWidth>
                  <InputLabel>Timezone</InputLabel>
                  <Select
                    value={settings.timezone}
                    onChange={handleSelectChange('timezone')}
                  >
                    <MenuItem value="UTC">UTC</MenuItem>
                    <MenuItem value="EST">EST</MenuItem>
                    <MenuItem value="PST">PST</MenuItem>
                    <MenuItem value="GMT">GMT</MenuItem>
                  </Select>
                </FormControl>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Data Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Data Settings
            </Typography>
            <List>
              <ListItem>
                <TextField
                  fullWidth
                  label="Data Retention (days)"
                  type="number"
                  value={settings.dataRetention}
                  onChange={handleSelectChange('dataRetention')}
                />
              </ListItem>
              <ListItem>
                <TextField
                  fullWidth
                  label="Max File Size (MB)"
                  type="number"
                  value={settings.maxFileSize}
                  onChange={handleSelectChange('maxFileSize')}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* API Keys */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">API Keys</Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog(true)}
              >
                Add Key
              </Button>
            </Box>
            <List>
              <ListItem>
                <ListItemText
                  primary="Production API Key"
                  secondary="Last used: 2024-02-20"
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" color="error">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Development API Key"
                  secondary="Last used: 2024-02-19"
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" color="error">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Save Button */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveSettings}
            >
              Save Settings
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Add API Key Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New API Key</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="API Key Name"
            fullWidth
            value={newApiKey}
            onChange={(e) => setNewApiKey(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={() => {
              // Handle API key creation
              setOpenDialog(false);
              setNewApiKey('');
            }}
            variant="contained"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Settings; 