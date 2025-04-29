import React from "react";
import ActionCard from "./ActionCard";
import type { ActionCardGridProps } from "../../lib/types/dashboard";

const ActionCardGrid: React.FC<ActionCardGridProps> = ({ actions }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <ActionCard
          key={`action-card-${index}`}
          title={action.title}
          description={action.description}
          icon={action.icon}
          linkTo={action.linkTo}
          variant={action.variant}
        />
      ))}
    </div>
  );
};

export default ActionCardGrid; 