import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Button,
    useTheme,
    alpha,
    styled,
    Divider
} from "@mui/material";


// Styled components
const PriceItemContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    textTransform: 'capitalize',
    padding: theme.spacing(2),
    transition: "background-color 0.3s ease",
    borderRadius: theme.shape.borderRadius,
    "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.04),
    }
}));

const PlanCard = styled(Card)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: theme.shadows[4],
    }
}));

const DiscountChip = styled(Chip)(({ theme }) => ({
    marginLeft: theme.spacing(1),
    backgroundColor: alpha(theme.palette.success.main, 0.1),
    color: theme.palette.success.dark,
    fontWeight: 600,
}));

const CurrentPlanButton = styled(Button)(({ theme }) => ({
    borderRadius: 20,
    padding: "4px 12px",
    fontSize: "0.75rem",
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
    fontWeight: 600,
    "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.2),
    }
}));

const SelectPlanButton = styled(Button)(({ theme }) => ({
    borderRadius: 20,
    padding: "4px 12px",
    fontSize: "0.75rem",
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
    }
}));

const PriceItem = ({
    id,
    price = "",
    duration = "",
    handleClick,
    discountPercentage,
    currentPlanId
}) => {
    const theme = useTheme();
    const isCurrentPlan = currentPlanId === id;

    return (
        <PriceItemContainer>
        <Box sx={{ flexGrow: 1 }}>
            <Typography
            sx={{
                fontWeight: 600,
                fontSize: "1rem",
                color: theme.palette.mode === "dark" ? "#fff" : "#122740",
                marginBottom: 0.5,
            }}
            >
            {duration}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
                variant="body2"
                sx={{
                fontSize: "0.875rem",
                color: theme.palette.text.secondary,
                }}
            >
                AUD {price}
            </Typography>
            {discountPercentage > 0 && (
                <DiscountChip size="small" label={`${discountPercentage}% off`} />
            )}
            </Box>
        </Box>

        <Box>
            {isCurrentPlan ? (
            <CurrentPlanButton size="small" variant="contained" disableElevation>
                Current Plan
            </CurrentPlanButton>
            ) : (
            <SelectPlanButton
                onClick={handleClick}
                size="small"
                variant="outlined"
            >
                Select Plan
            </SelectPlanButton>
            )}
        </Box>
        </PriceItemContainer>
    );
};

export default function PlanDisplay({
    plans,
    onPlanClick,
    currentPlanId,
}) {
    return (
        <Grid container spacing={3} style={{flexGrow: "1", alignItems: "center", justifyContent: "center", margin: 20}}>
        {plans.map((plan) => (
            <Grid key={`plan-${plan.id}`} item xs={12} sm={6} md={4}>
            <PlanCard variant="outlined">
                <CardContent sx={{ p: 3, flexGrow: 1 }}>
                <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                    mb: 1.5,
                    fontWeight: 600,
                    color: theme => theme.palette.mode === "dark" ? "#fff" : "#122740"
                    }}
                >
                    {plan.name}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                >
                    {plan.description}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mt: 2 }}>
                    {plan.PlanTypePrices.map((price, index) => (
                    <Box key={`price-${price.id}`}>
                        {index > 0 && <Divider sx={{ my: 1 }} />}
                        <PriceItem
                        id={price.id}
                        currentPlanId={currentPlanId}
                        handleClick={() => onPlanClick(price)}
                        duration={price.duration}
                        price={price.price}
                        discountPercentage={price.discount_percentage}
                        />
                    </Box>
                    ))}
                </Box>
                </CardContent>
            </PlanCard>
            </Grid>
        ))}
        </Grid>
    );
}
