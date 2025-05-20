import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Chính sách Bảo mật</h1>
      <div className="prose prose-lg max-w-none text-gray-700">
        <p>
          Chào mừng bạn đến với Chính sách Bảo mật của chúng tôi. Chính sách này giải thích cách chúng tôi
          thu thập, sử dụng, tiết lộ và bảo vệ thông tin cá nhân của bạn khi bạn truy cập
          trang web của chúng tôi và sử dụng dịch vụ của chúng tôi.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">1. Thông tin chúng tôi thu thập</h2>
        <p>
          Chúng tôi có thể thu thập các loại thông tin sau:
        </p>
        <ul>
          <li>
            <strong>Thông tin cá nhân bạn cung cấp:</strong> Ví dụ: tên, địa chỉ email, số điện thoại,
            v.v., khi bạn đăng ký tài khoản, liên hệ với chúng tôi hoặc tham gia vào các hoạt động khác trên trang web.
          </li>
          <li>
            <strong>Thông tin thu thập tự động:</strong> Khi bạn truy cập trang web của chúng tôi, chúng tôi có thể tự động
            thu thập một số thông tin nhất định từ thiết bị của bạn, bao gồm địa chỉ IP, loại trình duyệt,
            hệ điều hành, các trang bạn đã truy cập và thời gian truy cập.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-3">2. Cách chúng tôi sử dụng thông tin của bạn</h2>
        <p>
          Chúng tôi sử dụng thông tin thu thập được cho các mục đích sau:
        </p>
        <ul>
          <li>Cung cấp và duy trì dịch vụ của chúng tôi.</li>
          <li>Cải thiện, cá nhân hóa và mở rộng dịch vụ của chúng tôi.</li>
          <li>Hiểu và phân tích cách bạn sử dụng dịch vụ của chúng tôi.</li>
          <li>Phát triển sản phẩm, dịch vụ, tính năng và chức năng mới.</li>
          <li>Giao tiếp với bạn, trực tiếp hoặc thông qua một trong các đối tác của chúng tôi, bao gồm cả dịch vụ khách hàng,
            để cung cấp cho bạn các bản cập nhật và thông tin khác liên quan đến trang web, và cho các mục đích tiếp thị và quảng cáo.</li>
          <li>Gửi email cho bạn.</li>
          <li>Tìm và ngăn chặn gian lận.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-3">3. Chia sẻ thông tin của bạn</h2>
        <p>
          Chúng tôi không bán, trao đổi hoặc cho thuê thông tin nhận dạng cá nhân của người dùng cho người khác.
          Chúng tôi có thể chia sẻ thông tin tổng hợp ẩn danh không liên quan đến bất kỳ thông tin nhận dạng cá nhân nào
          liên quan đến khách truy cập và người dùng với các đối tác kinh doanh, chi nhánh đáng tin cậy và nhà quảng cáo của chúng tôi
          cho các mục đích được nêu ở trên.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">4. Bảo mật thông tin</h2>
        <p>
          Chúng tôi áp dụng các biện pháp bảo mật thích hợp để bảo vệ chống lại việc truy cập trái phép,
          thay đổi, tiết lộ hoặc phá hủy thông tin cá nhân của bạn.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">5. Thay đổi đối với Chính sách Bảo mật này</h2>
        <p>
          Chúng tôi có thể cập nhật Chính sách Bảo mật của mình theo thời gian. Chúng tôi sẽ thông báo cho bạn về bất kỳ
          thay đổi nào bằng cách đăng Chính sách Bảo mật mới trên trang này. Bạn nên xem lại
          Chính sách Bảo mật này định kỳ để biết bất kỳ thay đổi nào.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">6. Liên hệ với chúng tôi</h2>
        <p>
          Nếu bạn có bất kỳ câu hỏi nào về Chính sách Bảo mật này, vui lòng liên hệ với chúng tôi:
        </p>
        <ul>
          <li>Qua email: [Địa chỉ email của bạn]</li>
          <li>Qua trang web: [Liên kết đến trang liên hệ của bạn]</li>
        </ul>
        <p className="mt-6"><em>Chính sách này có hiệu lực kể từ [Ngày hiệu lực].</em></p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;