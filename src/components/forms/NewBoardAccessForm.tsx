"use client"; // Khai báo đoạn mã này sẽ chạy ở phía client
import { addEmailToBoard } from "@/app/actions/boardActions"; // Nhập hàm addEmailToBoard từ module boardActions
import { useRouter } from "next/navigation"; // Nhập hook useRouter từ thư viện next/navigation để điều hướng trang
import { useRef } from "react"; // Là một hook trong React cho phép bạn tạo ra một tham chiếu đến phần tử DOM hoặc một biến instance có thể thay đổi mà không gây ra việc render lại component

export default function NewBoardAccess({ boardId }: { boardId: string }) { // Xuất một component React mặc định tên là NewBoardAccess với props là boardId
  const router = useRouter(); // Hook này cho phép truy cập vào đối tượng router của Next.js
  const inputRef = useRef<HTMLInputElement>(null) // HTMLInputElement, chỉ ra rằng tham chiếu này sẽ được sử dụng cho một phần tử inputHTML, null là giá trị khởi tạo cho tham chiếu. Trong trường hợp này, tham chiếu ban đầu sẽ không trỏ đến bất kỳ phần tử nào 
  async function addEmail(formData: FormData) { // Định nghĩa hàm addEmail là một hàm async, nhận vào một tham số formData,
    const email = formData.get("email")?.toString() || ''; // lấy giá trị email tù formData và chuyển thành chuỗi. Nếu không có giá trị, sẽ trả về chuỗi rỗng
    await addEmailToBoard(boardId, email); // Gọi hàm addEmailToBoard với boardId và email
    // Kiểm tra xem tham chiếu inputRef có đang trỏ đến một phần tử DOM hay không, Nếu có, nó sẽ đặt giá trị của phần tử input đó thành chuỗi rỗng
    if(inputRef.current) {
        // Nếu inputRef.current là null hoặc undefined, điều kiện sẽ trả về false và khói mã trong {} sẽ không được thực thi
        // Nếu inputRef.current tồn tại đặt giá trị của phần input thành chuỗi rỗng. Điều này sẽ xoá tất cả nội dung hiện tại trong trường input
        inputRef.current.value = '';
    }
    router.refresh(); // Làm mới trang
  }
  return (
    <form action={addEmail} className="max-w-xs">
      <h2 className="text-lg mb-2">Add Email </h2>
      <input ref={inputRef} type="text" placeholder="huuhungnguyen2002@gmail.com" name="email" />
      <button className="w-full mt-2" type="submit">Save</button>
    </form>
  );
}
