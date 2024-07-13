import { AnchorEscrow } from "@/artifacts/anchor_escrow";
import { Program, web3 } from "@coral-xyz/anchor";
import idl from "@/artifacts/anchor_escrow.json";
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, Content-Encoding, Accept-Encoding",
};

import { ActionGetResponse, ActionPostResponse } from "@solana/actions";
import { PublicKey } from "@solana/web3.js";
import {
  getAssociatedTokenAddressSync,
  getMint,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

type Params = {
  pda: string;
};

const connection = new web3.Connection(web3.clusterApiUrl("devnet"));

const program = new Program<AnchorEscrow>(idl as AnchorEscrow, {
  connection,
});

export async function GET(req: Request, context: { params: Params }) {
  const { pda } = context.params;
  const escrow = new web3.PublicKey(pda);
  try {
    const escrowAccount = await program.account.escrow.fetch(escrow);

    const response: ActionGetResponse = {
      title: "Take escrow",
      label: "Take it",
      description: `This action allows you to take the escrow with token mint ${escrowAccount.mintA.toString()} by paying ${escrowAccount.receive.toString()} ${escrowAccount.mintA.toString()}`,
      icon: "https://ucarecdn.com/59f7bf50-bbe0-43c7-a282-badebeea3a6b/-/preview/880x880/-/quality/smart/-/format/auto/",
      links: {
        actions: [
          {
            label: "Take it",
            href: `${
              process.env.NEXT_PUBLIC_DOMAIN
            }/api/actions/take-escrow/${escrow.toString()}`,
          },
        ],
      },
    };

    return Response.json(response, {
      status: 200,
      headers,
    });
  } catch (error) {
    return Response.json(
      { message: "Escrow not exists" },
      {
        status: 404,
        headers,
      }
    );
  }
}

export async function POST(req: Request, context: { params: Params }) {
  const body = await req.json();
  const { account } = body;
  const authority = new web3.PublicKey(account);
  const { pda } = context.params;
  const escrow = new web3.PublicKey(pda);
  const escrowAccount = await program.account.escrow.fetch(escrow);
  const tokenProgram = (await isToken2022(escrowAccount.mintA))
    ? TOKEN_2022_PROGRAM_ID
    : TOKEN_PROGRAM_ID;
  const vault = getAssociatedTokenAddressSync(
    new PublicKey(escrowAccount.mintA),
    escrow,
    true,
    tokenProgram
  );

  const makerAtaB = getAssociatedTokenAddressSync(
    new PublicKey(escrowAccount.mintB),
    escrowAccount.maker,
    false,
    tokenProgram
  );

  const takerAtaA = getAssociatedTokenAddressSync(
    new PublicKey(escrowAccount.mintA),
    authority,
    false,
    tokenProgram
  );

  const takerAtaB = getAssociatedTokenAddressSync(
    new PublicKey(escrowAccount.mintB),
    authority,
    false,
    tokenProgram
  );

  const ix = await program.methods
    .take()
    .accountsPartial({
      maker: escrowAccount.maker,
      taker: authority,
      mintA: new PublicKey(escrowAccount.mintA),
      mintB: new PublicKey(escrowAccount.mintB),
      makerAtaB,
      takerAtaA,
      takerAtaB,
      escrow,
      tokenProgram,
      vault,
    })
    .instruction();

  const blockhash = await connection
    .getLatestBlockhash({ commitment: "max" })
    .then((res) => res.blockhash);
  const messageV0 = new web3.TransactionMessage({
    payerKey: authority,
    recentBlockhash: blockhash,
    instructions: [ix],
  }).compileToV0Message();
  const transaction = new web3.VersionedTransaction(messageV0);

  const response: ActionPostResponse = {
    transaction: Buffer.from(transaction.serialize()).toString("base64"),
    message: `Take escrow successfully`,
  };

  return Response.json(response, {
    status: 200,
    headers,
  });
}

export async function OPTIONS(req: Request) {
  return Response.json(
    { message: "OPTIONS request" },
    {
      status: 200,
      headers,
    }
  );
}

const isToken2022 = async (mint: PublicKey) => {
  const mintInfo = await connection.getAccountInfo(mint);
  return mintInfo?.owner.equals(TOKEN_2022_PROGRAM_ID);
};

const getMintInfo = async (mint: PublicKey) => {
  const tokenProgram = (await isToken2022(mint))
    ? TOKEN_2022_PROGRAM_ID
    : TOKEN_PROGRAM_ID;

  return getMint(connection, mint, undefined, tokenProgram);
};
