import { Card, Container, Icon, Typography } from "@mui/material";
import { API_URL, Context, Page } from "../Utils";
import { useEffect, useState } from "react";

export default function ContextPage() {
  const [contexts, setContexts] = useState<Context[]>([]);
  const fetchContexts = async () => {
    const request = await fetch(`${API_URL}/v1/api/contexts`);
    const response = (await request.json()) as Page;
    setContexts(response.content as Context[]);
  };
  useEffect(() => {
    fetchContexts();
  }, []);
  return (
    <Container
      maxWidth="md"
      sx={{
        border: "1px solid lightgray",
        borderRadius: "5px",
        padding: "10px",
      }}
    >
      {contexts.length === 0 && (
        <Typography variant="h5" align="center">
          No contexts found
        </Typography>
      )}
      {contexts.map((context) => (
        <Card
          key={context.id}
          sx={{ margin: "1rem", padding: "1rem" }}
          variant="outlined"
        >
          <Typography variant="h5">{context.name}</Typography>
          <Typography variant="body1">
            Created by: {context.creator.name}
          </Typography>
        </Card>
      ))}
    </Container>
  );
}
