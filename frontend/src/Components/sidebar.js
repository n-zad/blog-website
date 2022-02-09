import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import WhatshotIcon from "@mui/icons-material/Whatshot";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";


const drawerWidth = 200;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: "hidden"
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(7)} + 1px)`
  }
});

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: 0,
    top: 0,
    background: "grey",
    padding: "0 1px",
    fontSize: "10px"
  }
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar
}));


const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open"
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme)
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme)
  })
}));

export default function MiniDrawer() {
  const [open, setOpen] = React.useState(false);

  const handleDrawer = () => {
		if(open === true) {
			setOpen(false);
		} else {
			setOpen(true);
		}
  };


  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
 
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawer}>
				{
					open === false?
					<ChevronRightIcon />
					:
					<ChevronLeftIcon />
				}
        		
          </IconButton>
        </DrawerHeader>
        <List>
          <ListItem button key="Key">
            <ListItemIcon>
              <WhatshotIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Popular" />
          </ListItem>

          <ListItem button key="Key">
            <ListItemIcon>
              <AccessTimeOutlinedIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary="News" />
          </ListItem>

          <ListItem button key="Key">
            <ListItemIcon>
              <TrendingUpOutlinedIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary="Tranding" />
          </ListItem>

          <Divider />

          <ListItem button key="Key">
            <ListItemIcon>
              <StyledBadge badgeContent={12} style={{ color: "white" }}>
                <BookmarkBorderOutlinedIcon style={{ color: "orange" }} />
              </StyledBadge>
            </ListItemIcon>
            <ListItemText primary="Saved" />
          </ListItem>
          <ListItem button key="Key">
            <ListItemIcon>
              <PostAddOutlinedIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary="Add Post" />
          </ListItem>

          <Divider />

          <ListItem button key="Key">
            <ListItemIcon>
              <LoginOutlinedIcon color="secondary" style={{ color: "red" }} />
            </ListItemIcon>
            <ListItemText primary="Logout" style={{ color: "black" }} />
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
}