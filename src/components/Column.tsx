import { ReactSortable } from "react-sortablejs";
import { Card, useMutation, useStorage } from "@/app/liveblocks.config";
import { shallow } from "@liveblocks/client";
import NewCardForm from "./forms/NewCardForm";
import { FormEvent, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClose,
  faEllipsis,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { default as ColumnCard } from "@/components/Card";
import CancelButton from "./CancelButton";

// Định nghĩa các props của component Column, bao gồm id, name, cards và setCards.
type ColumnProps = {
  id: string; // ID của cột
  name: string; // Tên của cột
};

// Dòng này khai báo một hàm mặc định được xuất hiện ra tên 'Column'. Hàm này nhận vào một đối tượng với các thuộc tính 'id' và 'name', Kiểu của đối tượng là ColumnProps
export default function Column({ id, name }: ColumnProps) {
  const [renameMode, setRenameMode] = useState(false);

  // Sử dụng  hook "useStorage" để lấy dữ  từ local Storage.
  const columnCards = useStorage<Card[]>((root) => {
    // Hàm callback của hook "useStorage", nhận vào tham số "root" là dữ liệu từ localStorage
    // Hàm callback này trả về một mảng mới, được tạo từ việc lọc và biến đổi mảng 'root.cards'.
    return (
      root.cards
        // Phương thức 'filter' tạo ra một mảng mới với các phần tử từ 'root.cards' mà thuộc tính 'columnId' của chúng bằng với 'id'.
        .filter((card) => card.columnId === id)
        // Phương thức 'map' tạo ra một mảng mới bằng cách lấy từng phần tử của mảng đã lọc và trả về một đối tượng mới có cùng các thuộc tính với phần tử đó.
        .map((c) => ({ ...c }))
        .sort((a, b) => a.index - b.index)
    );
  }, shallow); // 'shallow' là tham số thứ hai của hàm 'useStorage'.

  const updateCard = useMutation(({ storage }, index, updateData) => {
    const card = storage.get("cards").get(index);
    if (card) {
      for (let key in updateData) {
        card?.set(key as keyof Card, updateData[key]);
      }
    }
  }, []);

  const updateColumn = useMutation(({ storage }, id, newName) => {
    const columns = storage.get("columns");
    columns.find((c) => c.toObject().id === id)?.set("name", newName);
  }, []);

  const deleteColumn = useMutation(({ storage }, id) => {
    const columns = storage.get("columns");
    const columnIndex = columns.findIndex((c) => c.toObject().id === id);
    columns.delete(columnIndex);
  }, []);

  // Hàm này được sử dụng để cập nhật mảng cards sau khi thực hiện sắp xếp
  const setTaskOrdersForColumn = useMutation(
    ({ storage }, sortedCards: Card[], newColumnId) => {
      const idsOfSortedCards = sortedCards.map((c) => c.id.toString());
      const allCards: Card[] = [
        ...storage.get("cards").map((c) => c.toObject()),
      ];
      idsOfSortedCards.forEach((sortedCardId, colIndex) => {
        const cardStorageIndex = allCards.findIndex(
          (c) => c.id.toString() === sortedCardId
        );
        updateCard(cardStorageIndex, {
          columnId: newColumnId,
          index: colIndex,
        });
      });
    },
    []
  );

  function handleRenameSubmit(ev: FormEvent) {
    ev.preventDefault();
    const input = (ev.target as HTMLFormElement).querySelector("input");
    if (input) {
      const newColumnName = input.value;
      updateColumn(id, newColumnName);
      setRenameMode(false);
    }
  }

  // Trả về JSX để render cột và các thẻ trong cột
  return (
    <div className="w-48 bg-white shadow-sm rounded-md p-2">
      {!renameMode && (
        <div className="flex justify-between">
          <h3>{name}</h3>
          <button className="text-gray-300" onClick={() => setRenameMode(true)}>
            <FontAwesomeIcon icon={faEllipsis} />
          </button>
        </div>
      )}
      {renameMode && (
        <div className="mb-8">
          Edit name:
          <form onSubmit={handleRenameSubmit} className="mb-2">
            <input type="text" defaultValue={name} />
            <button type="submit" className="w-full mt-2">
              Save
            </button>
          </form>
          <button
            onClick={() => deleteColumn(id)}
            className="bg-red-500 text-white p-2 flex gap-2 w-full items-center rounded-md justify-center"
          >
            <FontAwesomeIcon icon={faTrash} />
            Delete column
          </button>
          <CancelButton onClick={() => setRenameMode(false)} />
          
        </div>
      )}
      {!renameMode && columnCards && (
        <>
          <ReactSortable
            list={columnCards} // Mảng cards sẽ được sắp xếp
            setList={(items) => setTaskOrdersForColumn(items, id)} // Hàm callback để cập nhật mảng cards sau khi sắp xếp
            group="cards" // Nhóm các sortable để có thể di chuyển giữa các cột
            className="min-h-12" // Class CSS cho khung sắp xếp
            ghostClass="opacity-40" // Class CSS cho hiệu ứng khi kéo thả thẻ
          >
            {/* Render mỗi thẻ trong cột */}
            {columnCards.map((card) => (
              <ColumnCard key={card.id} id={card.id} name={card.name} />
            ))}
          </ReactSortable>
        </>
      )}
      {!renameMode && <NewCardForm columnId={id} />}
    </div>
  );
}
