"use client";
import { Column, useMutation, useStorage } from "@/app/liveblocks.config";
import NewCoLumnForm from "./forms/NewColumForm";
import { ReactSortable } from "react-sortablejs";
import { default as BoardColumn } from "@/components/Column";
import { LiveList, LiveObject, shallow } from "@liveblocks/client";

export default function Columns() {
  const columns = useStorage(root => root.columns.map(c => ({...c})), shallow );
  
  const updateColumns = useMutation(({storage}, columns:LiveObject<Column>[]) => {
    storage.set('columns', new LiveList(columns));
  }, [])

  function setColumnsOrder(sortedColumns: Column[]) {
    const newColumns:LiveObject<Column>[] = [];
    sortedColumns.forEach((sortedColumns, newIndex) => {
      const newSortedColumn = {...sortedColumns};
      newSortedColumn.index = newIndex;  
      newColumns.push(new LiveObject(newSortedColumn))
    })
    updateColumns(newColumns)
  }
  if (!columns) {
    return;
  }
  return (
    <div className="flex gap-4">
      <ReactSortable
        group={"board-column"}
        list={columns}
        className="flex gap-4"
        ghostClass="opacity-40" 
        setList={setColumnsOrder}
      >
        {columns?.length > 0 &&
          columns.map((column) => (
            <BoardColumn
              key={column.id} // key là một props đặc biệt trong React, Giúp react nhận biết các phần  từ con nào đã thay đổi, được thêm vào hoặc bị xoá. Ở đây, key được gán bằng ID của column
              {...column} // Đây là cú pháp spread trong JavaScript, giúp truyền tất cả các thuộc tính của column như là props của component Column.
            />
          ))}
      </ReactSortable>

      <NewCoLumnForm />
    </div>
  );
}
