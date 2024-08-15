import { Container, Typography, Grid, Card, CardMedia, CardContent } from "@mui/material";
import { useEffect } from "react";

const brands = [
    {
        name: "Chanel",
        image: "https://mediaelly.sgp1.digitaloceanspaces.com/uploads/2021/01/06205934/y-nghia-logo-thuong-hieu-chanel.png",
        description: "Luxury French fashion house known for high-end fashion and accessories."
    },
    {
        name: "Louis Vuitton",
        image: "https://assets.turbologo.com/blog/en/2020/01/19084709/louis-vuitton-primary-logo.png",
        description: "Iconic French brand specializing in luxury trunks, leather goods, and ready-to-wear."
    },
    {
        name: "Nike",
        image: "https://logowik.com/content/uploads/images/697_nike.jpg",
        description: "Global sportswear brand known for innovation in athletic footwear and apparel."
    },
    {
        name: "Gucci",
        image: "https://i.pinimg.com/564x/1f/93/8a/1f938a3372ca4c3d00904602256bfa5f.jpg",
        description: "Italian luxury brand known for its innovative designs and quality craftsmanship."
    },
    {
        name: "Dior",
        image: "https://mia.vn/media/uploads/tin-tuc/thuong-hieu-dior-2-1690478102.jpg",
        description: "French luxury brand specializing in haute couture, fragrance, and accessories."
    },
    {
        name: "Prada",
        image: "https://logo.com/image-cdn/images/kts928pd/production/5be7f05ad50b4254e440898461e4ad1026a11723-900x592.png?w=1920&q=72&fm=webp",
        description: "Italian luxury fashion house known for its leather handbags, shoes, and accessories."
    }
];

const Brands = () => {
    useEffect(() => {
        document.title = "Thương hiệu";
    }, []);
    return (
        <Container 
            maxWidth="lg" 
            sx={{
                marginTop: 4,
                padding: 4,
                backgroundColor: '#2c2c2c',
                color: '#ffffff',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}
        >
            <Typography variant="h4" component="h1" sx={{ textAlign: 'center', marginBottom: 4 }}>
                Our Featured Brands
            </Typography>

            <Grid container spacing={4}>
                {brands.map((brand, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card 
                            sx={{ 
                                backgroundColor: '#3c3c3c',
                                color: '#ffffff',
                                borderRadius: 2,
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    transition: 'transform 0.3s ease-in-out',
                                }
                            }}
                        >
                            <CardMedia
                                component="img"
                                image={brand.image}
                                alt={brand.name}
                                height="200"
                                sx={{ 
                                    objectFit: 'cover',
                                    borderTopLeftRadius: 8,
                                    borderTopRightRadius: 8
                                }}
                            />
                            <CardContent>
                                <Typography variant="h6" component="h2" sx={{ marginBottom: 2 }}>
                                    {brand.name}
                                </Typography>
                                <Typography variant="body2">
                                    {brand.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default Brands;
