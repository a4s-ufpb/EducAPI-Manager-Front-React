import { Box, Button, Container, Divider, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function IndexPage() {
  const navigate = useNavigate();
  const redirectToContexts = () => {
    navigate("/contexts");
  };
  const redirectToChallenges = () => {
    navigate("/challenges");
  };
  return (
    <Container maxWidth="md">
      <Typography variant="h5" align="center" gutterBottom>
        Welcome to EducAPI Manager
      </Typography>
      <Divider variant="middle" sx={{ margin: "10px 0" }} />
      <Box display="flex" justifyContent="space-around">
        <Button variant="contained" onClick={redirectToContexts}>
          See Contexts
        </Button>
        <Button variant="contained" onClick={redirectToChallenges}>
          See Challenges
        </Button>
      </Box>
    </Container>
  );
}
