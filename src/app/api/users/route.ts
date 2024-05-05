import { User, UserType } from "@/models/User"; // Import các mô hình User và UserType từ thư mục models
import mongoose from "mongoose"; // import thư viện mongoogse để làm việc với mongoDB
import { NextRequest } from "next/server"; // Import NextRequest từ thư viện next/server để xử lý yêu cầu HTTP

// Tạo một hàm bất đồng bộ để xử lý yêu cầu GET
export async function GET(req: NextRequest) {
  const url = new URL(req.url); // Tạo một đối tượng URL từ yêu cầu
  const connectionString = process.env.MONGODB_URI; // Lấy chuỗi kết nối MONGGO DB Từ môi trường
  // Kiểm tra xem chuỗi kết nối có tồn tại hay không
  if (!connectionString) {
    // Nếu không tồn tại sẽ trả về lỗi 500
    return new Response("no db connection string", { status: 500 });
  }
  // Kết nối đến cơ sở dữ liệu MONGODB
  await mongoose.connect(connectionString);
  let users = [];
  // Kiểm tra xem yêu cầu có chứa tham số "ids" không
  if (url.searchParams.getAll("ids")) {   
    // Lấy tất cả các giá trị của tham số "ids" từ yêu cầu
    const emails = url.searchParams.getAll("ids")
    // Tìm tất cả người dùng có email nằmh trong danh sách emails
    users = await User.find({email:{$in:emails}});
    
  }
  
  if(url.toString().includes('?search=')) {
    const searchPhrase = url.searchParams.get('search')?.split(',');
    const searchRegex = `.*${searchPhrase}.*`;
    users = await User.find({
      $or: [
        {name: {$regex: searchRegex}},
        {email: {$regex: searchRegex}},
      ],
    });
  }

  return Response.json(
    users.map((u: UserType) => ({
      id: u.email,
      name: u.name,
      image: u.image,
      avatar: u.image,
    }))
  );
}
