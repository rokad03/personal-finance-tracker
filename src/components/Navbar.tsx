import { Link } from 'react-router-dom'

import { Box,AppBar,Toolbar,Typography,Button } from '@mui/material'
import { useDispatch } from 'react-redux'
import { logout } from './slice/loginSlice'

function Navbar() {
  const dispatch=useDispatch();
  return (
    <>
    <Box sx={{ flexGrow: 1 }} >
      <AppBar position="static" role="navigation">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
           <Link to="/dashboard">Dashboard</Link> {' '}
           <Link to="/transactions">Transactions</Link> {' '}
           <Link to="/recurring-transactions">Reports</Link>
          </Typography>
          <Button color="inherit" onClick={()=>dispatch(logout())}>Logout</Button>
        </Toolbar>
      </AppBar>
    </Box>
    </>
  )
}

export default Navbar