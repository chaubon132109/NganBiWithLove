// Medical Nutrition Guide, Pregnancy Myths, and Health Tips

export const ESSENTIAL_NUTRIENTS = [
  {
    name: 'Axit Folic (Vitamin B9)',
    amount: '600 mcg / ngày',
    importance: 'Chống dị tật ống thần kinh (nứt đốt sống, vô sọ) hình thành ngay từ 28 ngày đầu thai kỳ.',
    sources: 'Măng tây, bông cải xanh, cải bó xôi, quả bơ, ngũ cốc nguyên cám, đậu lăng.',
    note: 'Nên uống viên bổ sung trước khi thụ thai 3 tháng và tiếp tục suốt tam cá nguyệt thứ nhất.'
  },
  {
    name: 'Canxi (Calcium)',
    amount: '1000 - 1200 mg / ngày',
    importance: 'Xây dựng toàn bộ hệ xương, hộp sọ và mầm răng cho bé; phòng ngừa loãng xương, chuột rút, rụng răng cho mẹ.',
    sources: 'Sữa tiệt trùng, sữa chua, tôm đồng bóc vỏ, cua biển, phô mai cứng, hạt chia, đậu phụ non.',
    note: 'Uống vào buổi sáng sau ăn 1 giờ cùng nhiều nước. Không uống chung lúc với viên Sắt.'
  },
  {
    name: 'Sắt (Iron)',
    amount: '30 - 60 mg / ngày',
    importance: 'Thể tích máu của mẹ bầu tăng thêm 50% trong thai kỳ. Sắt vận chuyển oxy qua nhau thai nuôi bào thai.',
    sources: 'Thịt bò nạc, thịt gà ta, bồ câu, cá hồi, củ dền đỏ, rau dền, đậu đỗ.',
    note: 'Uống cùng nước cam hoặc hoa quả giàu vitamin C để hấp thu tối ưu. Tránh uống kèm trà hoặc sữa.'
  },
  {
    name: 'DHA & EPA (Omega-3)',
    amount: '200 - 300 mg / ngày',
    importance: 'Chiếm tới 20% trọng lượng chất béo của não bộ và 50% võng mạc mắt của bé, quyết định chỉ số IQ và thị lực.',
    sources: 'Cá hồi nấu chín, cá trích, hạt óc chó, hạt chia, quả bơ, lòng đỏ trứng gà chín.',
    note: 'Đặc biệt quan trọng trong tam cá nguyệt 2 và 3 khi não bé tăng sinh tế bào thần kinh với tốc độ chóng mặt.'
  },
  {
    name: 'Kẽm (Zinc) & I-ốt (Iodine)',
    amount: '11 - 15 mg Kẽm / ngày',
    importance: 'Kẽm hỗ trợ phân chia AND và tăng miễn dịch. I-ốt phát triển tuyến giáp và ngăn ngừa đần độn bẩm sinh.',
    sources: 'Hải sản nấu chín (tôm, sò nõn), thịt nạc, các loại đậu, muối i-ốt nêm vừa đủ.',
    note: 'Nấu ăn dùng muối i-ốt với lượng vừa phải, không ăn mặn.'
  },
  {
    name: 'Nước lọc & Điện giải',
    amount: '2.5 - 3.0 lít / ngày',
    importance: 'Tạo nước ối, tuần hoàn máu nhau thai, làm sạch bàng quang chống viêm tiết niệu và ngừa táo bón.',
    sources: 'Nước lọc ấm đun sôi, nước dừa tươi (từ tháng 4), nước canh rau củ trong, nước ép quả tươi.',
    note: 'Uống nhiều ban ngày, giảm sau 20h để có giấc ngủ sâu không bị gián đoạn tiểu đêm.'
  }
];

export const PREGNANCY_MYTHS = [
  {
    myth: 'Ăn trứng ngỗng giúp con sinh ra thông minh hơn?',
    fact: 'Sai. Trứng ngỗng chứa nhiều chất béo bão hòa và cholesterol hơn nhưng hàm lượng Choline, Folate và Vitamin A lại kém xa so với TRỨNG GÀ. Mẹ chỉ cần ăn trứng gà luộc chín 3-4 quả/tuần là đã cung cấp dưỡng chất trí não tốt nhất cho bé.',
    verdict: 'Quan niệm chưa đúng khoa học'
  },
  {
    myth: 'Uống nhiều nước dừa từ tháng đầu để da con trắng trẻo?',
    fact: 'Màu da của bé do gen di truyền từ bố mẹ quyết định 100%, không thực phẩm nào đổi được màu da. Hơn nữa 3 tháng đầu dừa có tính hàn làm lạnh bụng, tụt huyết áp dọa sảy thai. Chỉ nên uống từ tháng thứ 4 để bổ sung nước ối và điện giải.',
    verdict: 'Hiểu lầm phổ biến'
  },
  {
    myth: 'Mẹ bầu ăn ốc thì con sinh ra sẽ bị nhiều dãi dớt?',
    fact: 'Không có cơ sở khoa học. Ốc cung cấp canxi và đạm rất tốt. Tuy nhiên ốc sống dưới bùn lầy dễ nhiễm ký sinh trùng giun sán, vì vậy mẹ bầu cần ngâm sạch ốc với ớt/chanh và LUỘC THẬT CHÍN SÔI KỸ trước khi ăn.',
    verdict: 'Dân gian truyền miệng'
  },
  {
    myth: 'Mang thai phải "ăn cho hai người" - khẩu phần ăn gấp đôi?',
    fact: 'Hoàn toàn sai. 3 tháng đầu nhu cầu năng lượng hầu như không tăng. 3 tháng giữa chỉ cần thêm ~300 kcal (bằng 1 bát cháo nhỏ hoặc 1 ly sữa hạt). Ăn gấp đôi chỉ làm mẹ tăng cân mất kiểm soát, dễ bị tiểu đường thai kỳ và tiền sản giật.',
    verdict: 'Quan niệm nguy hại'
  },
  {
    myth: 'Mẹ bầu ăn cay con sinh ra sẽ nóng tính?',
    fact: 'Tính cách do giáo dục và môi trường định hình. Tuy nhiên ăn quá nhiều ớt/hạt tiêu làm mẹ bị ợ nóng, trào ngược thực quản, trĩ và táo bón nặng thêm, do đó nên ăn vị thanh nhẹ vừa phải.',
    verdict: 'Không chính xác'
  }
];

