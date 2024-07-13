"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import useEscrowProgram from "@/hooks/useEscrowProgram";
import { Progress } from "../ui/progress";

type Props = {};
const EscrowCountCard: React.FC<Props> = ({}) => {
  const { getEscrowAccounts } = useEscrowProgram();

  return (
    <Card x-chunk="dashboard-05-chunk-1">
      <CardHeader className="pb-2">
        <CardDescription>Escrow count</CardDescription>
        <CardTitle className="text-4xl">
          {getEscrowAccounts.data?.length || 0}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">+25% from last week</div>
      </CardContent>
      <CardFooter>
        <Progress value={25} aria-label="25% increase" />
      </CardFooter>
    </Card>
  );
};

export default EscrowCountCard;
