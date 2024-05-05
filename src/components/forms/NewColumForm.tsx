"use client";
import { useMutation } from "@/app/liveblocks.config";
import { FormEvent } from "react"; // FormEvent được dùng để xử lý các sự kiện liên quan đến Form
import { LiveObject } from "@liveblocks/core";

import uniqid from "uniqid";

export default function NewCoLumnForm() {
  const addCloumn = useMutation(({ storage }, columnName) => {
    return storage.get("columns").push(
      new LiveObject({
        name: columnName,
        id: uniqid.time(),
        index: 9999,
      })
    );
  }, []);

  function handleNewColumn(ev: FormEvent) {
    ev.preventDefault(); // Là một phương thức ngăn chăn hành vi mặc định
    const input = (ev.target as HTMLFormElement).querySelector("input"); //Đây là cú pháp của TypeScript để ép kiểu. Nó nói với TypeScript rằng ev.target nên được coi như một phần tử form HTML (HTMLFormElement). Điều này cho phép bạn sử dụng các thuộc tính và phương thức cụ thể của form HTML trên ev.target.,querySelector là một phương thức của DOM API cho phép bạn tìm kiếm một phần tử con trong một phần tử cha dựa trên một bộ chọn CSS. Trong trường hợp này, nó đang tìm kiếm phần tử input đầu tiên trong form.
    if (input) {
      const columName = input?.value; // Dấu hỏi sau input là optional chaning nếu input là null hoặc undefined thì input?.value sẽ trả về undifind thay vì gay ra lỗi
      addCloumn(columName);
      input.value = "";
    }
  }
  return (
    <form onSubmit={handleNewColumn} className="max-w-xs">
      <label className="block">
        <span className="text-gray-600 block">Column here</span>
        <input type="text" placeholder="new column name" />
      </label>
      <button type="submit" className="mt-2 block w-full">
        Create column
      </button>
    </form>
  );
}
