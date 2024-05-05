"use client";
import { RoomProvider, useMyPresence, useUpdateMyPresence } from "@/app/liveblocks.config";
import { LiveList } from "@liveblocks/client";
import { ClientSideSuspense } from "@liveblocks/react";
import Columns from "./Columns";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { FormEvent, useEffect, useState } from "react";
import { updateBoard } from "@/app/actions/boardActions";
import { metadata } from "@/app/layout";
import { useRouter } from "next/navigation";
import { BoardContextProvider } from "./BoardContext";

// Định nghĩa một function component Board.
export default function Board({ id, name }: { id: string; name: string }) {
  const [renameMode, setRenameMode] = useState(false);
  const router = useRouter();
  const updateMyPresence = useUpdateMyPresence();
  
  useEffect(() => {
    updateMyPresence({boardId: id});
    return () => {
      updateMyPresence({boardId:null});
    }
  }, [])

  async function handleNameSubmit(ev: FormEvent) {
    ev.preventDefault();
    const input = (ev.target as HTMLFormElement).querySelector("input");
    if (input) {
      const newName = input.value;
      await updateBoard(id, { metadata: { boardName: newName } }),
        (input.value = "");
      setRenameMode(false);
      router.refresh();
    }
  }

  return (
    <BoardContextProvider>
      <RoomProvider
        id={id}
        initialPresence={{
          cardId: null,
          boardId: null,
        }}
        initialStorage={{ columns: new LiveList(), cards: new LiveList() }}
      >
        <ClientSideSuspense fallback={<div>Loading...</div>}>
          {() => (
            <>
              <div className="flex gap-2 justify-between items-center mb-4">
                <div>
                  {!renameMode && (
                    <h1
                      className="text-2xl"
                      onClick={() => setRenameMode(true)}
                    >
                      Board: {name}
                    </h1>
                  )}
                  {renameMode && (
                    <form onSubmit={handleNameSubmit}>
                      <input type="text" defaultValue={name} />
                    </form>
                  )}
                </div>
                <Link
                  className="flex gap-2 items-center btn"
                  href={`/boards/${id}/settings`}
                >
                  <FontAwesomeIcon icon={faCog} />
                  Board settings
                </Link>
              </div>
              <Columns />
            </>
          )}
        </ClientSideSuspense>
      </RoomProvider>
    </BoardContextProvider>
  );
}
