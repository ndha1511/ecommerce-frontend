import {Box, styled} from "@mui/material";
import blueBackground from "../../../assets/backgrounds/blue-background.jpg";
import pinkBackground from "../../../assets/backgrounds/pink-background.jpg";
import greenBackground from "../../../assets/backgrounds/green-background.png";
import {ReactNode} from "react";


const createStyledCard = (backgroundImage: string) => styled(Box)({
    backgroundImage: `url(${backgroundImage})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    borderRadius: '5px',
    padding: '15px',
    height: '100%',
});

const backgrounds = {
    blue: blueBackground,
    pink: pinkBackground,
    green: greenBackground,
};

export type CardGradientProps = {
    color: 'blue' | 'pink' | 'green',
    children?: ReactNode
}


const CardGradientBackground = ({color, children}: CardGradientProps) => {
    const CardComponent = createStyledCard(backgrounds[color]);
    return <CardComponent>{children}</CardComponent>;
}

export default CardGradientBackground;