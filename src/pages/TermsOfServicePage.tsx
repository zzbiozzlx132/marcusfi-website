import React from 'react';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Điều khoản Dịch vụ</h1>
      <div className="prose prose-lg max-w-none text-gray-700">
        <p>
          Chào mừng bạn đến với trang web của chúng tôi. Nếu bạn tiếp tục duyệt và sử dụng trang web này,
          bạn đồng ý tuân thủ và bị ràng buộc bởi các điều khoản và điều kiện sử dụng sau đây,
          cùng với chính sách bảo mật của chúng tôi, chi phối mối quan hệ của [Tên công ty/Tên trang web của bạn] với bạn
          liên quan đến trang web này. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản và điều kiện này,
          vui lòng không sử dụng trang web của chúng tôi.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">1. Việc sử dụng trang web</h2>
        <p>
          Nội dung của các trang của trang web này chỉ dành cho thông tin chung và việc sử dụng chung của bạn.
          Nó có thể thay đổi mà không cần thông báo trước.
        </p>
        <p>
          Trang web này sử dụng cookie để theo dõi sở thích duyệt web. Nếu bạn cho phép sử dụng cookie,
          thông tin cá nhân sau đây có thể được chúng tôi lưu trữ để sử dụng bởi các bên thứ ba: [Liệt kê thông tin].
        </p>
        <p>
          Cả chúng tôi và bất kỳ bên thứ ba nào đều không cung cấp bất kỳ bảo đảm hoặc đảm bảo nào về tính chính xác,
          kịp thời, hiệu suất, tính đầy đủ hoặc tính phù hợp của thông tin và tài liệu được tìm thấy
          hoặc cung cấp trên trang web này cho bất kỳ mục đích cụ thể nào. Bạn thừa nhận rằng
          thông tin và tài liệu đó có thể chứa những điểm không chính xác hoặc lỗi và chúng tôi rõ ràng
          loại trừ trách nhiệm pháp lý đối với bất kỳ điểm không chính xác hoặc lỗi nào như vậy trong phạm vi tối đa được pháp luật cho phép.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">2. Quyền sở hữu trí tuệ</h2>
        <p>
          Trang web này chứa tài liệu thuộc sở hữu của chúng tôi hoặc được cấp phép cho chúng tôi. Tài liệu này bao gồm,
          nhưng không giới hạn ở, thiết kế, bố cục, giao diện, hình thức và đồ họa.
          Việc sao chép bị cấm trừ khi tuân theo thông báo bản quyền,
          là một phần của các điều khoản và điều kiện này.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">3. Giới hạn trách nhiệm</h2>
        <p>
          Việc bạn sử dụng bất kỳ thông tin hoặc tài liệu nào trên trang web này hoàn toàn do bạn tự chịu rủi ro,
          mà chúng tôi sẽ không chịu trách nhiệm. Bạn có trách nhiệm đảm bảo rằng bất kỳ sản phẩm,
          dịch vụ hoặc thông tin nào có sẵn thông qua trang web này đều đáp ứng các yêu cầu cụ thể của bạn.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">4. Liên kết đến các trang web khác</h2>
        <p>
          Theo thời gian, trang web này cũng có thể bao gồm các liên kết đến các trang web khác. Các liên kết này được cung cấp
          để thuận tiện cho bạn để cung cấp thêm thông tin. Chúng không có nghĩa là chúng tôi xác nhận
          (các) trang web đó. Chúng tôi không chịu trách nhiệm về nội dung của (các) trang web được liên kết.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">5. Thay đổi Điều khoản</h2>
        <p>
          Chúng tôi có quyền sửa đổi các điều khoản này bất kỳ lúc nào. Bạn nên kiểm tra định kỳ
          các điều khoản này để biết các thay đổi. Việc bạn tiếp tục sử dụng Trang web sau khi đăng các thay đổi
          sẽ đồng nghĩa với việc bạn chấp nhận các điều khoản đã sửa đổi đó.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">6. Luật điều chỉnh</h2>
        <p>
          Việc bạn sử dụng trang web này và bất kỳ tranh chấp nào phát sinh từ việc sử dụng trang web đó đều phải tuân theo
          luật pháp của [Quốc gia/Khu vực pháp lý của bạn].
        </p>

        <p className="mt-6">
          Nếu bạn có bất kỳ câu hỏi nào về các Điều khoản Dịch vụ này, vui lòng liên hệ với chúng tôi.
        </p>
        <p className="mt-6"><em>Các điều khoản này có hiệu lực kể từ [Ngày hiệu lực].</em></p>
      </div>
    </div>
  );
};

export default TermsOfServicePage;