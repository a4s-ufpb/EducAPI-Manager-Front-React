import { Container, Typography } from "@mui/material";
import { API_URL, Context, Page } from "../Utils";
import { useEffect, useState } from "react";
import ContextCard from "../components/ContextCard";

export default function ContextPage() {
  const [actualPage, setActualPage] = useState(1);
  const [contexts, setContexts] = useState<Context[]>([]);

  const fetchContexts = async () => {
    const request = await fetch(
      `${API_URL}/v1/api/contexts?page=${actualPage - 1}`
    );
    const response = (await request.json()) as Page;
    setContexts(response.content as Context[]);
  };

  useEffect(() => {
    fetchContexts();
  }, []);

  return (
    <Container maxWidth="md">
      <Typography variant="h5" align="center" gutterBottom>
        Contexts
      </Typography>
      {contexts.length === 0 && (
        <Typography variant="h5" align="center" color="error">
          No contexts found
        </Typography>
      )}
      {contexts.map((context) => (
        <ContextCard key={context.id} context={context} />
      ))}
    </Container>
  );
}
