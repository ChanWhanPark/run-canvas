import MapViewer from '@/component/map-viewer';
import AppToolbar from '@/component/toolbar';
import { Box, Grid } from '@mui/material';

export const MainPage = () => {
  const ToolbarSection = <AppToolbar />;
  return (
    <Box sx={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {ToolbarSection}
      <Grid container sx={{ width: '100%', height: '100%' }}>
        <Grid size={{ xs: 1 }}></Grid>
        <Grid size={{ xs: 10 }}>
          <MapViewer />
        </Grid>
      </Grid>
    </Box>
  );
};
