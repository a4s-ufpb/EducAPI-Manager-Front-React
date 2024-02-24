import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Card,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  ListItem,
} from "@mui/material";
import { Challenge, Context } from "../Utils";
import { useState } from "react";

type ContextCardProps = {
  context: Context;
};

export default function ContextCard({ context }: ContextCardProps) {
  const [open, setOpen] = useState(false);
  return (
    <Card
      key={context.id}
      sx={{ padding: 1, margin: 1 }}
      variant="outlined"
    >
      <Typography variant="h5">{context.name}</Typography>
      <Typography variant="body1">
        Created by: {context.creator.name}
      </Typography>
      <List component="nav">
        <ListItemButton onClick={() => setOpen(!open)}>
          <ListItemIcon>{open ? <ExpandLess /> : <ExpandMore />}</ListItemIcon>
          <ListItemText primary="Challenges" />
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem>
              {context.challenges.map((challenge: Challenge) => (
                <Card
                  key={challenge.id}
                  sx={{ margin: "1rem", padding: "1rem" }}
                  variant="outlined"
                >
                  <Typography variant="h6">{challenge.word}</Typography>
                  <Typography variant="body1">
                    Created by: {challenge.creator.name}
                  </Typography>
                </Card>
              ))}
            </ListItem>
          </List>
        </Collapse>
      </List>
    </Card>
  );
}
