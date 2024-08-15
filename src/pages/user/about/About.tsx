import { Container, Typography, Box, Avatar, Grid, Button } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import TeamIcon from '@mui/icons-material/Group';
import VisionIcon from '@mui/icons-material/Visibility';
import MissionIcon from '@mui/icons-material/Flag';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import { useEffect } from "react";

const About = () => {
    useEffect(() => {
        document.title = "Về chúng tôi";
    }, []);
    return (
        <Container 
            maxWidth="md" 
            sx={{
                marginTop: 4,
                mb: 4,
                padding: 4,
                backgroundColor: '#2c2c2c',
                color: '#ffffff',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                <Avatar sx={{ bgcolor: '#1e88e5', marginRight: 2 }}>
                    <InfoIcon />
                </Avatar>
                <Typography variant="h4" component="h1">
                    About Us
                </Typography>
            </Box>

            <Typography variant="body1" sx={{ marginBottom: 4 }}>
                Welcome to our website! We are committed to delivering the best service for our customers. 
                Our mission is to provide high-quality products that meet your needs and exceed your expectations.
            </Typography>

            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: '#4caf50', marginRight: 2 }}>
                            <MissionIcon />
                        </Avatar>
                        <Typography variant="h5" component="h2">
                            Our Mission
                        </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ marginTop: 2 }}>
                        Our mission is to create value for our customers by providing innovative solutions and exceptional service. 
                        We believe in continuous improvement and strive to exceed expectations in everything we do.
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: '#ff9800', marginRight: 2 }}>
                            <VisionIcon />
                        </Avatar>
                        <Typography variant="h5" component="h2">
                            Our Vision
                        </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ marginTop: 2 }}>
                        Our vision is to be the leading provider in our industry, known for our commitment to quality, 
                        customer satisfaction, and innovation. We aim to build lasting relationships with our clients.
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: '#f44336', marginRight: 2 }}>
                            <TeamIcon />
                        </Avatar>
                        <Typography variant="h5" component="h2">
                            Our Team
                        </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ marginTop: 2 }}>
                        Our team is composed of talented and passionate individuals who are dedicated to providing the best 
                        service and solutions for our customers. We work together to achieve our common goals and uphold our 
                        values.
                    </Typography>
                </Grid>
            </Grid>

            <Box sx={{ textAlign: 'center', marginTop: 6 }}>
                <Typography variant="h6" component="h3" sx={{ marginBottom: 2 }}>
                    Get in Touch
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<ContactMailIcon />} 
                    sx={{
                        backgroundColor: '#1e88e5',
                        '&:hover': {
                            backgroundColor: '#1565c0',
                        }
                    }}
                >
                    Contact Us
                </Button>
            </Box>
        </Container>
    );
}

export default About;
