"use client";
import React from "react";
import { Button } from "../ui/button";
import MakeNewEscrowDialog from "./MakeNewEscrowDialog";

type Props = {};

const MakeNewEscrowButton: React.FC<Props> = ({}) => {
  return <MakeNewEscrowDialog trigger={<Button>Create New Escrow</Button>} />;
};

export default MakeNewEscrowButton;
