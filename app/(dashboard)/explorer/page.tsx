import EscrowCountCard from "@/components/escrow/EscrowCountCard";
import EscrowGrid from "@/components/escrow/EscrowGrid";
import MakeNewEscrowButton from "@/components/escrow/MakeNewEscrowButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import React from "react";

type Props = {};

const ExplorerPage: React.FC<Props> = ({}) => {
  return (
    <div className="container mx-auto py-10">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
        <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
          <CardHeader className="pb-3">
            <CardTitle>Your Escrow</CardTitle>
            <CardDescription className="max-w-lg text-balance leading-relaxed">
              Manage your escrow
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <MakeNewEscrowButton />
          </CardFooter>
        </Card>
        <EscrowCountCard />
        <Card x-chunk="dashboard-05-chunk-2">
          <CardHeader className="pb-2">
            <CardDescription>Volume</CardDescription>
            <CardTitle className="text-4xl">SOL 5,432</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              +10% from last month
            </div>
          </CardContent>
          <CardFooter>
            <Progress value={12} aria-label="12% increase" />
          </CardFooter>
        </Card>
      </div>
      <EscrowGrid />
    </div>
  );
};

export default ExplorerPage;
