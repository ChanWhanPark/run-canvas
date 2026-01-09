import { AppBar, Box, Paper, Toolbar, Typography } from '@mui/material';

export default function AppToolbar() {
  const MainMenuSection = (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Paper sx={{ p: '6px', display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
        <Typography variant="h6" component="div">
          RUN CANVAS
        </Typography>
      </Paper>
    </Box>
  );
  return (
    <>
      <AppBar position="fixed" sx={{ background: 'transparent', boxShadow: 'none' }}>
        <Toolbar sx={{ alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, position: 'absolute', top: 8, right: 8 }}>
            {MainMenuSection}
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}
