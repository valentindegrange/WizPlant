import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Container,
} from '@mui/material';
import {Link} from "react-router-dom";

interface AppDefaultLayoutProps {
    children: React.ReactNode;
}

const AppDefaultLayout: React.FC<AppDefaultLayoutProps> = ({children}) => {

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="logo" component={Link} to="/login">
                        <img src="/logo.png" alt="Logo" style={{width: 50}}/>
                        <Typography variant="h6" sx={{pl:1}}>PlantWiz</Typography>
                    </IconButton>
                    <Typography variant="h6" style={{flexGrow: 1}}/>
                </Toolbar>
            </AppBar>

            <Container component="main" maxWidth="sm" style={{marginBottom: 70, marginTop: 10}}>
                {children}
            </Container>
        </>
    );
}

export default AppDefaultLayout;