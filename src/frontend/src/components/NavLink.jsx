import { Link as RouterLink, useLocation } from "react-router-dom";
import { Link } from "@mui/material";

const NavLink = ({ to, children, ...props }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      component={RouterLink}
      to={to}
      sx={{
        color: isActive ? 'primary.main' : 'text.secondary',
        textDecoration: 'none',
        transition: 'color 0.2s',
        '&:hover': {
          color: 'primary.main',
        }
      }}
      {...props}
    >
      {children}
    </Link>
  );
};

export default NavLink;
