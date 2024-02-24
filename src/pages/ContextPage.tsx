import { Container, TextField, Typography } from "@mui/material";
import { API_URL, Context, Page } from "../Utils";
import { useEffect, useState } from "react";
import ContextCard from "../components/ContextCard";

export default function ContextPage() {
  const [actualPage, setActualPage] = useState(1);
  const [contexts, setContexts] = useState<Context[]>([]);
  const [actualContextId, setActualContextId] = useState<number | undefined>(
    undefined
  );

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

  const renderContexts = () => {
    if (actualContextId) {
      const context = contexts.find(
        (context) => context.id === actualContextId
      );
      if (!context) {
        return (
          <Typography variant="h5" align="center" color="error">
            Context not found
          </Typography>
        );
      } else {
        return <ContextCard context={context} />;
      }
    } else {
      return contexts.map((context) => (
        <ContextCard key={context.id} context={context} />
      ));
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h5" align="center" gutterBottom>
        Contexts
      </Typography>
      <TextField
        type="number"
        label="Type the id"
        onChange={(e) => setActualContextId(Number.parseInt(e.target.value))}
      />
      {contexts.length === 0 && (
        <Typography variant="h5" align="center" color="error">
          No contexts found
        </Typography>
      )}
      {renderContexts()}
    </Container>
  );
}
