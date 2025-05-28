import React from 'react';
import { Backdrop, CircularProgress, Typography, Box } from '@mui/material';
import { useApp } from '../context/AppContext';

function Loading() {
  const { loading } = useApp();

  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
      }}
      open={loading}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <CircularProgress color="primary" size={60} />
        <Typography variant="h6" color="primary">
          Loading...
        </Typography>
      </Box>
    </Backdrop>
  );
}

export default Loading; 