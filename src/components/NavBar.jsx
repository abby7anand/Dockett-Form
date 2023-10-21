import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';


export default function NavBar() {
  return (
    <Box >
      <AppBar position="reltive">
        <Toolbar sx={{ backgroundColor:'black'}}>
          <Typography variant="h3" component="div" sx={{ flexGrow: 1}}>
            Dockett App Screening
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}