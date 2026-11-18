// Comprehensive Pregnancy Meal Plans & Menus segmented by Trimester and Condition

export const TRIMESTER_INFO = {
  t1: {
    id: 't1',
    name: '3 Tháng Đầu (Tam Cá Nguyệt 1)',
    weeks: 'Tuần 1 - Tuần 12',
    color: 'rose',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    highlight: 'Trọng tâm: Giảm ốm nghén, chống dị tật ống thần kinh với Axit Folic, dễ tiêu hóa.',
    dailyCalories: '1800 - 2000 kcal (Chưa cần tăng nhiều năng lượng, chú trọng chất lượng vi chất)',
    keyNutrients: [
      { name: 'Axit Folic', amount: '600 mcg/ngày', desc: 'Ngừa dị tật nứt đốt sống, vô sọ' },
      { name: 'Vitamin B6', amount: '1.9 mg/ngày', desc: 'Làm dịu dạ dày, giảm ốm nghén buồn nôn' },
      { name: 'Sắt & Kẽm', amount: '30 mg/ngày', desc: 'Tạo máu và phân chia tế bào phôi thai' },
      { name: 'Nước ấm', amount: '2 - 2.5 lít/ngày', desc: 'Duy trì tuần hoàn và thanh lọc' }
    ],
    doctorTips: [
      'Chia nhỏ thành 5-6 bữa ăn trong ngày, không để dạ dày quá đói hoặc quá no.',
      'Sáng dậy nên nhấm nháp 1-2 chiếc bánh quy khô hoặc ngũ cốc trước khi bước ra khỏi giường.',
      'Tránh đồ ăn chiên xào nhiều dầu mỡ, đồ có mùi quá nồng dễ kích thích nôn.',
      'Bổ sung viên đa vi chất chứa Acid Folic theo chỉ định của bác sĩ sản khoa.'
    ]
  },
  t2: {
    id: 't2',
    name: '3 Tháng Giữa (Tam Cá Nguyệt 2)',
    weeks: 'Tuần 13 - Tuần 27',
    color: 'amber',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    highlight: 'Trọng tâm: Phát triển vượt bậc khung xương, răng, cơ bắp và tế bào não của thai nhi.',
    dailyCalories: '2100 - 2300 kcal (Tăng thêm khoảng 300 - 340 kcal/ngày so với trước mang thai)',
    keyNutrients: [
      { name: 'Canxi', amount: '1000 - 1200 mg/ngày', desc: 'Hình thành hệ xương mầm răng chắc khỏe' },
      { name: 'DHA / Omega-3', amount: '200 - 300 mg/ngày', desc: 'Phát triển chất xám và thị giác bé' },
      { name: 'Choline', amount: '450 mg/ngày', desc: 'Tăng cường tế bào trung khu ghi nhớ' },
      { name: 'Chất đạm (Protein)', amount: '75 - 85 g/ngày', desc: 'Xây dựng mô cơ thể và bánh nhau' }
    ],
    doctorTips: [
      'Thời điểm mẹ hết nghén và ăn ngon miệng nhất, hãy chú ý chọn thức ăn giàu dinh dưỡng thay vì nạp calo rỗng từ bánh kẹo ngọt.',
      'Uống viên canxi cách viên sắt ít nhất 2 giờ để tránh ức chế hấp thu lẫn nhau.',
      'Tập thể dục nhẹ nhàng (đi bộ 20-30 phút, yoga bầu) và tắm nắng sớm tạo vitamin D3.',
      'Thường xuyên uống nước dừa tươi vào ban ngày để bổ sung điện giải và làm sạch nước ối.'
    ]
  },
  t3: {
    id: 't3',
    name: '3 Tháng Cuối (Tam Cá Nguyệt 3)',
    weeks: 'Tuần 28 - Tuần 40',
    color: 'emerald',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    highlight: 'Trọng tâm: Tăng cân chuẩn cho bé, chống táo bón, ngừa tiểu đường thai kỳ và tích lũy sức mạnh cho ngày sinh.',
    dailyCalories: '2300 - 2450 kcal (Tăng thêm khoảng 450 kcal/ngày, tập trung vào đạm và chất béo tốt)',
    keyNutrients: [
      { name: 'Chất xơ & Nước', amount: '28 - 30 g xơ + 2.5L nước', desc: 'Ngừa táo bón, trĩ và kiểm soát đường huyết' },
      { name: 'Vitamin K & C', amount: '90 mcg K + 85 mg C', desc: 'Đông máu an toàn khi sinh và lành vết mổ/vết khâu' },
      { name: 'Sắt & Magie', amount: '30 - 60 mg Sắt', desc: 'Chuẩn bị lượng máu dự phòng cho cuộc chuyển dạ' },
      { name: 'Omega-3', amount: '300 mg/ngày', desc: 'Não bộ thai nhi tăng kích thước gấp 3 lần' }
    ],
    doctorTips: [
      'Chia nhỏ khẩu phần tinh bột trắng, ưu tiên khoai lang, yến mạch, gạo lứt để tránh tiểu đường thai kỳ.',
      'Hạn chế đồ quá mặn để tránh giữ nước gây phù chân tay và tăng huyết áp tiền sản giật.',
      'Uống đủ nước vào ban ngày, giảm uống sau 8 giờ tối để tránh thức dậy đi tiểu đêm làm mất ngủ.',
      'Từ tuần 37-38 có thể ăn lượng dứa nhỏ vừa phải hoặc chè vừng đen giúp cơ mềm chuyển dạ thuận lợi.'
    ]
  }
};

export const WEEKLY_MENUS = {
  // --- THỰC ĐƠN 3 THÁNG ĐẦU ---
  t1: [
    {
      day: 'Thứ Hai',
      title: 'Khởi đầu tuần thanh nhẹ, êm dịu dạ dày',
      breakfast: 'Cháo sườn non hạt sen bùi béo + 1 ly sữa hạt hạnh nhân ấm (200ml)',
      snackMorning: '1 quả chuối chín mềm + 1 nắm nhỏ hạt óc chó (3-4 quả)',
      lunch: 'Cơm gạo dẻo (1 bát) + Thịt nạc thăn rim gừng thơm dịu + Canh bí đỏ nấu tôm nõn + Đỗ cô ve luộc',
      snackAfternoon: '1 hũ sữa chua ít đường dầm bơ tươi sáp (1/2 quả bơ)',
      dinner: 'Cơm trắng (1 bát) + Trứng đúc thịt băm hấp cách thủy + Canh cải cúc nấu thịt băm + Cà rốt xào nấm',
      snackNight: '1 ly ngũ cốc yến mạch ấm hoặc sữa tiệt trùng ấm (150ml)',
      calorieEst: '1850 kcal',
      note: 'Gừng trong thịt rim giúp giảm buồn nôn trưa chiều, hạt sen giúp ngủ sâu.'
    },
    {
      day: 'Thứ Ba',
      title: 'Bổ sung Axit Folic tự nhiên từ rau xanh thẫm',
      breakfast: 'Phở bò chín thái mỏng (nước dùng trong, ít béo) + Trứng chần chín kỹ + 1 cốc nước cam tươi ít đường',
      snackMorning: '2 chiếc bánh quy gừng giòn + 1 quả táo tây giòn ngọt',
      lunch: 'Cơm nóng + Cá quả kho tộ tiêu nhẹ + Canh mồng tơi cua đồng nấu chín sôi + Mướp hương xào',
      snackAfternoon: '1 bắp ngô ngọt luộc nóng hổi + 1 ly sữa tươi tiệt trùng',
      dinner: 'Cơm trắng + Thịt gà xé phay bóp hành tây rau răm nhẹ chín + Canh măng tây nấu tôm tươi + Bí xanh luộc',
      snackNight: '1 cốc nước ấm pha thìa mật ong chanh loãng',
      calorieEst: '1900 kcal',
      note: 'Măng tây và mồng tơi là 2 loại rau dồi dào Axit Folic chống dị tật ống thần kinh.'
    },
    {
      day: 'Thứ Tư',
      title: 'Dễ tiêu hóa, chống đầy trướng bụng',
      breakfast: 'Bánh mì sandwich nướng kẹp phô mai tiệt trùng và trứng ốp chín già + 1 quả chuối',
      snackMorning: '1 hộp sữa chua Hy Lạp trộn hạt chia ngâm nở',
      lunch: 'Cơm gạo lứt hoặc cơm trắng + Thịt thăn bò xào ớt chuông nấm kim châm + Canh rau ngót nấu chín già thịt băm + Dưa chuột sạch',
      snackAfternoon: '1 củ khoai lang vàng luộc + 1 ly sữa hạt sen hạt điều',
      dinner: 'Cháo bồ câu ra ràng đậu xanh hạt sen (nấu nhừ, thơm mềm) + Rau cải thìa luộc sốt dầu hào',
      snackNight: '1 cốc sữa ấm không đường',
      calorieEst: '1880 kcal',
      note: 'Thịt bò xào ớt chuông cung cấp sắt và vitamin C tự nhiên giúp hấp thu sắt tối đa.'
    },
    {
      day: 'Thứ Năm',
      title: 'Xoa dịu vị giác mẹ ốm nghén',
      breakfast: 'Bún gà ta nước trong (thịt ức gà mềm, nấm hương) + Nước ép ổi bỏ hạt tươi',
      snackMorning: '1 quả lê gọt vỏ ướp mát + vài hạt hạnh nhân rang mộc',
      lunch: 'Cơm dẻo + Tôm đồng rang thịt nạc ba chỉ bớt mỡ + Canh bầu nấu tôm đất băm + Su su xào tỏi',
      snackAfternoon: 'Sinh tố bơ xoài sữa chua ít ngọt mát lành',
      dinner: 'Cơm gạo + Cá chẽm (hoặc cá diêu hồng) hấp xì dầu gừng hành + Canh mướp mồng tơi + Đậu phụ sốt cà chua',
      snackNight: 'Bánh ngũ cốc nướng + 150ml sữa ấm',
      calorieEst: '1920 kcal',
      note: 'Món cá hấp gừng hành thơm nức, không ngấy dầu mỡ, rất dễ ăn cho mẹ nhạy cảm mùi.'
    },
    {
      day: 'Thứ Sáu',
      title: 'Giàu đạm lành và vi khoáng thanh lọc',
      breakfast: 'Cháo yến mạch nấu tôm tươi băm nhỏ và cà rốt xắt hạt lựu + 1 ly sữa tươi',
      snackMorning: '1 chùm nho tươi rửa sạch hoặc quả thanh long ruột đỏ',
      lunch: 'Cơm nóng + Sườn sụn rim chua ngọt + Canh rau dền đỏ nấu tôm khô + Cải ngọt luộc',
      snackAfternoon: 'Bánh bao nhân thịt trứng cút hấp nóng + 1 ly nước chanh ấm',
      dinner: 'Cơm trắng + Trứng cuộn rau củ chín kỹ + Canh bí ngô thịt bằm + Đậu bắp luộc chấm tương',
      snackNight: 'Sữa chua men sống Probiotic hỗ trợ tiêu hóa',
      calorieEst: '1870 kcal',
      note: 'Rau dền và bí ngô rất tốt cho tuần hoàn máu và nhuận tràng.'
    },
    {
      day: 'Thứ Bảy',
      title: 'Đổi gió cuối tuần bổ dưỡng tinh tươm',
      breakfast: 'Hủ tiếu mì sườn heo tôm tươi + 1 ly nước ép lựu nguyên chất',
      snackMorning: 'Hạt macca (5-6 hạt) + 1 miếng dưa lưới giòn',
      lunch: 'Cơm gạo thơm + Bò lúc lắc xào khoai tây khoanh nướng + Canh ngao nấu chua thì là cà chua + Rau xà lách sạch dầm dầu dấm',
      snackAfternoon: 'Chè đậu đỏ hạt sen nước cốt dừa thơm dịu ít đường',
      dinner: 'Cơm trắng + Cá hồi áp chảo sốt bơ chanh tỏi chín già + Canh rau củ quả thập cẩm + Bông cải xanh luộc',
      snackNight: '1 ly sữa hạt ấm dễ ngủ',
      calorieEst: '1950 kcal',
      note: 'Cá hồi cung cấp DHA tự nhiên cho hệ thần kinh bé đang phân chia nhanh chóng.'
    },
    {
      day: 'Chủ Nhật',
      title: 'Bữa cơm gia đình ấm cúng, thư giãn',
      breakfast: 'Bánh cuốn chả quế nóng kèm ruốc thịt + Nước chấm ấm vừa vị + 1 quả chuối',
      snackMorning: 'Sinh tố đu đủ chín sữa tươi (đu đủ chín vàng hoàn toàn)',
      lunch: 'Cơm dẻo + Gà luộc chấm muối tiêu chanh + Canh bí xanh hầm xương heo + Rau muống luộc dầm sấu',
      snackAfternoon: 'Bánh bông lan trứng mềm xốp + 1 ly trà hoa cúc mật ong ấm loãng',
      dinner: 'Cơm trắng + Thịt kho trứng cút mềm thơm + Canh măng tây xào thịt bò + Nấm xào dầu hào',
      snackNight: '1 ly sữa ấm + 2 bánh quy lúa mạch',
      calorieEst: '1930 kcal',
      note: 'Thư giãn tinh thần, uống nhiều nước ấm và ngủ trước 10h30 đêm.'
    }
  ],

  // --- THỰC ĐƠN 3 THÁNG GIỮA ---
  t2: [
    {
      day: 'Thứ Hai',
      title: 'Nạp năng lượng và Canxi cho khung xương bé',
      breakfast: 'Bánh mì ngũ cốc nướng kèm bơ sáp + 2 quả trứng gà luộc chín lòng đỏ + 1 ly sữa tươi tiệt trùng (250ml)',
      snackMorning: '1 nắm hạt hỗn hợp (hạnh nhân, óc chó, hạt điều) + 1 quả cam bóc múi',
      lunch: 'Cơm gạo tám thơm (1.5 bát) + Sườn non kho củ sen + Canh cua mồng tơi rau đay + Đậu phụ rán vàng chấm mắm gừng',
      snackAfternoon: '1 hũ sữa chua nếp cẩm hoặc sữa chua hạt chia + dâu tây',
      dinner: 'Cơm nóng + Cá hồi nướng teriyaki chín kỹ + Canh cải bó xôi (spinach) thịt bằm + Cà rốt su hào luộc chấm kho quẹt nhẹ',
      snackNight: '1 ly sữa bầu hoặc sữa tươi ấm (200ml)',
      calorieEst: '2200 kcal',
      note: 'Canh cua mồng tơi và sữa cung cấp trên 600mg canxi sinh học tuyệt vời cho ngày đầu tuần.'
    },
    {
      day: 'Thứ Ba',
      title: 'Tăng cường DHA và chất xám cho não bộ',
      breakfast: 'Bún bò Huế (thịt bắp bò chín, giò nạc, tiết chín già) + 1 ly nước ép bưởi da xanh',
      snackMorning: 'Bánh yến mạch chuối tự nướng + 1 hộp sữa chua men sống',
      lunch: 'Cơm trắng + Mực tươi xào cần tỏi tây + Canh sườn hầm củ dền đỏ bổ máu + Bông cải xanh xào nấm',
      snackAfternoon: '1 quả bơ dầm sữa chua không đường + hạt chia ngâm nở',
      dinner: 'Cơm dẻo + Thịt ba chỉ kho tộ hạt sen + Canh chua cá lóc nấu thơm cà chua đậu bắp + Rau lang luộc chấm mắm tỏi',
      snackNight: '1 quả chuối chín + 1 ly sữa ấm',
      calorieEst: '2250 kcal',
      note: 'Rau lang luộc chứa chất xơ giúp nhuận tràng, củ dền đỏ hỗ trợ tăng sinh hồng cầu.'
    },
    {
      day: 'Thứ Tư',
      title: 'Bổ sung Sắt hữu cơ và Kẽm vi lượng',
      breakfast: 'Xôi vò hạt sen chả lụa + 1 cốc sữa đậu nành mè đen ấm',
      snackMorning: '1 quả ổi giòn khoét bỏ ruột hạt (giàu vitamin C gấp 4 cam) + vài hạt óc chó',
      lunch: 'Cơm trắng + Thịt bò thăn xào măng tây và ngô non + Canh bí đỏ đậu phộng hầm xương + Rau muống xào tỏi',
      snackAfternoon: 'Bánh flan caramen hấp chín thơm mềm + 1 cốc nước dừa tươi ngọt lành',
      dinner: 'Cơm nóng + Tôm sú hấp bia sả gừng + Canh ngao nấu mồng tơi + Trứng hấp thịt bằm mộc nhĩ',
      snackNight: '1 ly sữa tươi tiệt trùng ấm',
      calorieEst: '2280 kcal',
      note: 'Măng tây và thịt bò là cặp đôi vàng về hàm lượng Sắt và Kolate tự nhiên.'
    },
    {
      day: 'Thứ Năm',
      title: 'Đa dạng khoáng chất biển và rau củ ngũ sắc',
      breakfast: 'Cháo cá hồi nấu đậu xanh nấm rơm + Hành ngò rí + 1 ly sữa hạt macca',
      snackMorning: 'Salad hoa quả trộn sốt sữa chua (táo, kiwi, thanh long, dâu tây)',
      lunch: 'Cơm dẻo + Gà kho gừng sả đậm vị + Canh cua nấu bí xanh + Đậu cove xào thịt nạc',
      snackAfternoon: '1 bắp ngô nếp luộc + 1 hũ sữa chua ít đường',
      dinner: 'Cơm trắng + Cá thu Nhật (cá thu nhỏ an toàn) sốt cà chua + Canh sườn nấu củ từ củ mài + Cải ngọt luộc',
      snackNight: '1 ly ngũ cốc dinh dưỡng ấm',
      calorieEst: '2230 kcal',
      note: 'Cá hồi và cá thu nhỏ giàu Omega-3 dạng EPA/DHA tự nhiên.'
    },
    {
      day: 'Thứ Sáu',
      title: 'Nuôi dưỡng làn da mẹ và tế bào bé',
      breakfast: 'Bánh cuốn nóng thịt bằm mộc nhĩ + Chả quế + Nước ép lựu nguyên chất',
      snackMorning: '1 đĩa quả việt quất / cherry hoặc mận ngọt + hạt hạnh nhân',
      lunch: 'Cơm nóng + Thịt chân giò rút xương hầm hạt sen nấm đông cô + Canh cải cúc nấu cá rô đồng + Bầu luộc chấm trứng dầm',
      snackAfternoon: '1 ly sinh tố bơ mãng cầu ít đường + hạt chia',
      dinner: 'Cơm dẻo + Tôm rang thịt cháy cạnh + Canh rau ngót nấu thịt bằm (nấu chín sôi kỹ) + Mướp hương xào giá chín',
      snackNight: '1 ly sữa ấm trước giờ ngủ 45 phút',
      calorieEst: '2260 kcal',
      note: 'Hạt sen và chân giò cung cấp collagen và protein cho dây chằng bụng mẹ đàn hồi tốt.'
    },
    {
      day: 'Thứ Bảy',
      title: 'Bữa tiệc cuối tuần ấm áp và dinh dưỡng',
      breakfast: 'Phở bò tái lăn chín kỹ + 1 quả trứng gà ta chần chín sôi + Nước cam tươi',
      snackMorning: 'Chè tổ yến chưng đường phèn táo đỏ hạt sen (3g yến tinh chế)',
      lunch: 'Cơm tấm sườn nướng mật ong chín vàng + Chả trứng hấp chín + Canh cải xoong nấu thịt nạc',
      snackAfternoon: '1 đĩa dưa lưới ngọt mát + 1 cốc sữa hạt sen ấm',
      dinner: 'Lẩu gà nấm gia đình: Thịt gà ta luộc chín ngọt, nấm kim châm, nấm đùi gà, rau cải cúc, mì trứng chín',
      snackNight: '1 hộp sữa chua Probiotic',
      calorieEst: '2320 kcal',
      note: 'Yến chưng táo đỏ từ tam cá nguyệt 2 giúp mẹ tăng sức đề kháng và da dẻ hồng hào.'
    },
    {
      day: 'Chủ Nhật',
      title: 'Thảnh thơi cân bằng chất xơ tiêu hóa',
      breakfast: 'Mì Quảng tôm thịt trứng cút rau sống chần chín + 1 ly sữa dừa ấm',
      snackMorning: '1 quả thanh long trắng/đỏ thái hạt lựu + hạt điều',
      lunch: 'Cơm nóng + Bò hầm tiêu xanh khoai tây cà rốt + Bánh mì mềm chấm sốt + Canh rau má nấu thịt chín kỹ',
      snackAfternoon: '1 củ khoai lang tím hấp mật + 1 ly nước dừa xiêm',
      dinner: 'Cơm gạo lứt mềm + Cá diêu hồng chiên xù sốt chua ngọt + Canh bí đỏ hầm sườn + Đậu bắp luộc',
      snackNight: '1 ly sữa tươi ấm + 1 chiếc bánh lúa mạch',
      calorieEst: '2240 kcal',
      note: 'Cuối tuần uống 1 trái dừa xiêm ban ngày bổ sung ối trong trẻo.'
    }
  ],

  // --- THỰC ĐƠN 3 THÁNG CUỐI ---
  t3: [
    {
      day: 'Thứ Hai',
      title: 'Kiểm soát đường huyết, chống phù nề và táo bón',
      breakfast: 'Cháo yến mạch nguyên cám nấu ức gà nấm hương + 1 ly sữa tươi tiệt trùng không đường (250ml)',
      snackMorning: '1 quả táo xanh giòn + 5 hạt óc chó tách vỏ',
      lunch: 'Cơm gạo lứt (1 bát đầy) + Cá hồi áp chảo dầu olive sốt chanh leo + Canh rau dền nấu tôm khô + Bông cải xanh luộc chấm muối mè',
      snackAfternoon: '1 hũ sữa chua Hy Lạp không đường dầm việt quất và 1 thìa hạt chia nở',
      dinner: 'Cơm gạo lứt/gạo tím than + Thịt thăn lợn luộc chấm mắm tỏi nhạt + Canh mướp hương mồng tơi + Đậu đũa luộc',
      snackNight: '1 ly sữa hạt hạnh nhân ấm (không đường)',
      calorieEst: '2350 kcal',
      note: 'Tinh bột chậm từ gạo lứt và yến mạch giúp ổn định đường huyết, tránh thai quá to khó sinh.'
    },
    {
      day: 'Thứ Ba',
      title: 'Bổ sung Canxi dự phòng chuyển dạ và tạo sữa non',
      breakfast: 'Bánh mì đen nguyên cám kẹp trứng ốp chín già và bơ thái lát + 1 ly sữa đậu nành canxi ấm',
      snackMorning: '1 quả đu đủ chín vàng mọng (giải táo bón thần kỳ)',
      lunch: 'Cơm nóng (1 bát) + Tôm đồng bọc vỏ rang giòn rim thịt nạc + Canh cua đồng nấu rau đay mồng tơi + Cà rốt xào nấm rơm',
      snackAfternoon: '1 củ khoai lang nghệ nướng / luộc + 1 ly nước dừa tươi (uống trước 16h)',
      dinner: 'Cơm trắng + Thịt bò xào cần tây hành tây nấm đông cô + Canh bí đỏ nấu sườn non + Rau xà lách sạch dầm dấm táo',
      snackNight: '1 ly sữa ấm không đường',
      calorieEst: '2380 kcal',
      note: 'Vỏ tôm đồng và cua đồng chứa lượng canxi dồi dào, chuẩn bị cho khung chậu và sữa mẹ.'
    },
    {
      day: 'Thứ Tư',
      title: 'Thanh lọc cơ thể, giảm áp lực thận và huyết áp',
      breakfast: 'Hủ tiếu nạc heo rau cải ngọt (nước dùng nêm nhạt muối) + Nước ép cần tây táo ngọt nhẹ',
      snackMorning: '1 quả ổi bỏ ruột hạt + vài hạt hạnh nhân rang mộc',
      lunch: 'Cơm gạo lứt + Ức gà nướng thảo mộc + Canh rong biển nấu đậu phụ non thịt bằm + Su su luộc chấm muối vừng',
      snackAfternoon: 'Chè mè đen (vừng đen) nấu khoai lang mật ong loãng (rất tốt từ tuần 36)',
      dinner: 'Cơm gạo dẻo + Cá lóc đồng kho tiêu gừng nghệ + Canh măng tây thịt bò + Rau muống luộc chấm tương nhạt',
      snackNight: '1 hộp sữa chua tiệt trùng ít đường',
      calorieEst: '2340 kcal',
      note: 'Rong biển giàu i-ốt và khoáng chất, vừng đen giúp làm mềm cơ và dễ sinh nở ở tháng cuối.'
    },
    {
      day: 'Thứ Năm',
      title: 'Tăng cường chất đạm sinh học cho bé đạt cân nặng chuẩn',
      breakfast: 'Cháo bồ câu đậu xanh hạt sen nấu nhừ + 1 ly sữa bầu hoặc sữa tươi ấm',
      snackMorning: '1 quả lê mọng nước gọt vỏ thái hạt lựu + hạt macca',
      lunch: 'Cơm trắng (1 bát) + Thịt bò sốt vang mềm thơm + Canh bông cải xanh nấu tôm tươi + Bắp cải xào cà chua',
      snackAfternoon: '1 miếng bánh chuối yến mạch nướng + 1 cốc sữa chua',
      dinner: 'Cơm gạo thơm + Trứng cuộn nấm thịt bằm hấp chín + Canh bí xanh nấu tôm khô + Đậu cove luộc',
      snackNight: '1 ly sữa ấm + vài lát bánh quy lúa mạch',
      calorieEst: '2400 kcal',
      note: 'Bồ câu đậu xanh giúp bé tăng cân những tuần cuối mà mẹ không bị tích tụ mỡ thừa.'
    },
    {
      day: 'Thứ Sáu',
      title: 'Bổ sung Omega-3 cho não bé tăng tốc hoàn thiện',
      breakfast: 'Phở gà ta thịt đùi xé + Trứng lòng trắng chín già + 1 ly nước cam vắt nguyên chất',
      snackMorning: 'Bơ sáp dầm sữa chua không đường + hạt chia',
      lunch: 'Cơm gạo lứt + Cá hồi áp chảo sốt cam mật ong chín kỹ + Canh cải cúc nấu thịt nạc băm + Nấm đùi gà kho tiêu',
      snackAfternoon: '1 bắp ngô ngọt luộc + 1 cốc nước dừa tươi ấm',
      dinner: 'Cơm nóng + Sườn non ram mặn ngọt nhạt + Canh rau ngót nấu tôm tươi (nấu sôi kỹ) + Bầu luộc',
      snackNight: '1 ly sữa ấm ít đường',
      calorieEst: '2390 kcal',
      note: '3 tháng cuối não bé phát triển với tốc độ nhanh gấp 3 lần, cá hồi và bơ là thức ăn lý tưởng.'
    },
    {
      day: 'Thứ Bảy',
      title: 'Thực đơn giàu năng lượng và thư giãn cuối thai kỳ',
      breakfast: 'Bánh cuốn nóng thịt bằm mộc nhĩ + 2 miếng chả lụa nạc + Nước ép táo cà rốt',
      snackMorning: 'Yến sào chưng hạt sen táo đỏ gừng tươi (ấm nóng)',
      lunch: 'Cơm dẻo + Tôm sú sốt bơ tỏi chín + Canh sườn hầm củ sen bùi béo + Cải thìa xào nấm',
      snackAfternoon: '1 đĩa quả mâm xôi / dâu tây / dưa lưới + hạt óc chó',
      dinner: 'Cơm gạo lứt + Gà nướng mật ong chín vàng + Canh ngao thì là cà chua + Rau củ luộc thập cẩm kho quẹt nhạt',
      snackNight: '1 ly sữa ấm + 1 thìa nhỏ hạt chia ngâm nở',
      calorieEst: '2420 kcal',
      note: 'Yến sào và củ sen bồi bổ thể lực, giúp mẹ tích trữ năng lượng cho ngày vượt cạn sắp tới.'
    },
    {
      day: 'Chủ Nhật',
      title: 'Chuẩn bị thể chất và tinh thần nhẹ nhõm đón bé yêu',
      breakfast: 'Bún chả nạc nướng chín già nước mắm nhạt nhiều rau sống rửa sạch chần sơ + 1 ly sữa tươi',
      snackMorning: 'Chè hạt sen long nhãn nấu rất ít đường (thanh tâm an thần)',
      lunch: 'Cơm gạo dẻo + Bò cuộn nấm kim châm sốt dầu hào + Canh chua cá bớp nấu dứa chín kỹ + Đậu bắp luộc',
      snackAfternoon: '1 củ khoai lang vàng luộc + 1 ly nước ép lựu',
      dinner: 'Cơm trắng (1 bát) + Thịt chân giò hầm đỗ đen hạt sen + Canh mồng tơi cua đồng + Mướp xào giá',
      snackNight: '1 ly sữa ấm trước khi đi ngủ',
      calorieEst: '2410 kcal',
      note: 'Uống nhiều nước ấm, đi bộ nhẹ nhàng 20 phút quanh nhà giúp khung chậu mở mềm tự nhiên.'
    }
  ]
};

// --- CHẾ ĐỘ THỰC ĐƠN CHUYÊN BIỆT THEO TÌNH TRẠNG MẸ BẦU ---
export const SPECIAL_CONDITION_MENUS = [
  {
    id: 'morning_sickness',
    name: 'Mẹ Bầu Bị Ốm Nghén Nặng',
    icon: '🍋',
    color: 'amber',
    tagline: 'Chống buồn nôn, xoa dịu dạ dày, chia 6 bữa nhỏ không mùi nồng',
    target: 'Dành cho mẹ bầu 3 tháng đầu mệt mỏi, sợ mùi thức ăn dầu mỡ, thường xuyên nôn khan.',
    principles: [
      'Ăn thức ăn nguội hoặc vừa ấm, tránh thức ăn bốc khói có mùi tanh nồng.',
      'Ưu tiên đồ khô: bánh quy gừng, bánh mì nướng giòn, khoai luộc, cháo hạt sen loãng.',
      'Uống nước từng ngụm nhỏ giữa các bữa ăn, không uống ừng ực trong bữa chính.',
      'Sử dụng gừng tươi, vỏ chanh, bạc hà tự nhiên để át cảm giác lợm giọng.'
    ],
    sampleDay: {
      wakeUp: '6h30: 2 chiếc bánh quy khô giòn + vài ngụm trà gừng mật ong ấm ngay trên giường.',
      breakfast: '7h30: 1 bát cháo gà xé hạt sen thanh đạm, không rắc nhiều tiêu ớt.',
      snackMorning: '10h00: 1 quả chuối chín hoặc 1/2 quả bơ dầm sữa chua ít ngọt.',
      lunch: '12h00: Cơm dẻo (1/2 - 1 bát) + Thịt nạc thăn rim gừng cháy cạnh khô ráo + Canh bí đỏ thịt bằm.',
      snackAfternoon: '15h00: Nước ép táo lê ướp mát nhẹ hoặc 1 củ khoai lang nhỏ luộc.',
      dinner: '18h30: Miến nấu gà nạc nấm hương nước dùng trong + Cà rốt bí xanh luộc.',
      snackNight: '21h00: 1 ly sữa hạt ngũ cốc ấm (150ml) nhấp từng ngụm chậm rãi.'
    }
  },
  {
    id: 'gestational_diabetes',
    name: 'Tiểu Đường Thai Kỳ (Low-GI)',
    icon: '📉',
    color: 'emerald',
    tagline: 'Kiểm soát đường huyết vàng, vào con không vào mẹ, no lâu',
    target: 'Dành cho mẹ bầu có chỉ số dung nạp glucose cao, tiền sử đái tháo đường hoặc tăng cân quá nhanh.',
    principles: [
      'Tuyệt đối kiêng đường tinh luyện, nước ngọt có ga, bánh kẹo, trà sữa, nước mía.',
      'Thay 100% cơm trắng bằng gạo lứt, yến mạch nguyên hạt, khoai lang vàng hoặc bánh mì đen.',
      'Quy tắc dĩa ăn: 1/2 đĩa là rau củ chất xơ -> 1/4 là chất đạm (cá, thịt nạc, trứng) -> 1/4 là tinh bột chậm.',
      'Thứ tự ăn trong bữa: Ăn canh rau trước -> Ăn thịt cá -> Sau cùng mới ăn tinh bột.'
    ],
    sampleDay: {
      wakeUp: '6h30: 1 cốc nước ấm lọc thanh lọc cơ thể.',
      breakfast: '7h30: 2 quả trứng gà luộc chín + 1 lát bánh mì đen ngũ cốc + 1 đĩa dưa chuột cà chua bi.',
      snackMorning: '10h00: 1 hũ sữa chua Hy Lạp không đường + 4 hạt óc chó.',
      lunch: '12h00: 1 bát cơm gạo lứt + Cá hồi áp chảo dầu olive + 1 tô lớn canh cải xanh + Đậu bắp luộc.',
      snackAfternoon: '15h00: 1 quả ổi giòn (khoét bỏ hạt, giàu xơ ít đường) + 1 ly sữa hạt không đường.',
      dinner: '18h30: 1/2 bát cơm gạo tím than + Ức gà áp chảo sốt tiêu + Canh rong biển đậu phụ + Bông cải xanh hấp.',
      snackNight: '21h00: 1 ly sữa tươi tiệt trùng không đường ấm (150ml).'
    }
  },
  {
    id: 'constipation',
    name: 'Mẹ Bầu Bị Táo Bón & Trĩ Thai Kỳ',
    icon: '🥬',
    color: 'sky',
    tagline: 'Xóa tan táo bón: Nhuận tràng tự nhiên, dồi dào chất xơ hòa tan & nước',
    target: 'Dành cho mẹ bầu gặp khó khăn tiêu hóa do thay đổi nội tiết tố progesterone hoặc tác dụng phụ của viên sắt.',
    principles: [
      'Nạp đủ 28-30g chất xơ mỗi ngày từ rau mồng tơi, khoai lang, hạt chia, đu đủ chín.',
      'Uống đủ 2.5 lít nước ấm rải đều trong ngày (đặc biệt 1 ly nước ấm ngay khi thức dậy).',
      'Đổi sang loại sắt hữu cơ dạng nước hoặc viên sắt thế hệ mới không gây nóng táo.',
      'Tập thói quen đi vệ sinh vào một khung giờ cố định mỗi sáng, không rặn mạnh.'
    ],
    sampleDay: {
      wakeUp: '6h00: 1 ly nước lọc ấm lớn (300ml) uống khi bụng đói kích thích nhu động đại tràng.',
      breakfast: '7h30: Cháo yến mạch mận đen hoặc khoai lang luộc + 1 hộp sữa chua men sống Probiotics.',
      snackMorning: '10h00: 2 thìa cà phê hạt chia ngâm nở hoàn toàn vào nước dừa hoặc nước cam ấm.',
      lunch: '12h00: Cơm gạo lứt mềm + Canh cua đồng nấu rau đay mồng tơi (siêu nhuận tràng) + Thịt nạc kho + Đậu phụ.',
      snackAfternoon: '15h00: 1 đĩa đu đủ chín vàng mọng hoặc quả sung luộc chấm muối vừng.',
      dinner: '18h30: Cơm nóng + Tôm rang thịt + Canh rau lang luộc hoặc nấu tôm + Bầu luộc chấm tương.',
      snackNight: '21h00: 1 ly sữa hạt yến mạch ấm + 1 quả chuối chín mềm.'
    }
  },
  {
    id: 'anemia',
    name: 'Mẹ Bầu Thiếu Máu & Thiếu Sắt',
    icon: '🩸',
    color: 'red',
    tagline: 'Bổ máu tăng hồng cầu, chấm dứt hoa mắt chóng mặt mệt mỏi',
    target: 'Dành cho mẹ bầu có chỉ số Hemoglobin < 11g/dL, da dẻ xanh xao, hay hụt hơi.',
    principles: [
      'Tăng cường nguồn sắt Heme động vật (dễ hấp thu gấp 3 lần thực vật): thịt bò nạc, chim bồ câu, cá béo.',
      'Luôn kết hợp thực phẩm giàu sắt với thực phẩm giàu Vitamin C (cam, ổi, ớt chuông, dâu tây) để hấp thu sắt tối đa.',
      'KHÔNG uống trà, cà phê hoặc uống chung viên Canxi trong vòng 2 tiếng sau bữa ăn chứa nhiều sắt.',
      'Tuân thủ uống viên bổ sung Sắt và Axit Folic đều đặn theo đơn bác sĩ.'
    ],
    sampleDay: {
      wakeUp: '6h30: 1 ly nước ấm vắt nửa quả chanh tươi.',
      breakfast: '7h30: Phở bắp bò chần chín kỹ nhiều thịt bò nạc + 1 cốc nước ép cam sành tươi.',
      snackMorning: '10h00: 1 quả ổi bỏ ruột hạt + 1 nắm nho khô đen giàu sắt.',
      lunch: '12h00: Cơm dẻo + Thịt bò thăn xào ớt chuông đỏ và hành tây + Canh củ dền đỏ hầm xương heo + Cải bó xôi luộc.',
      snackAfternoon: '15h00: 1 ly sinh tố dâu tây việt quất + sữa chua ít đường.',
      dinner: '18h30: Cháo chim bồ câu ra ràng hạt sen đậu xanh béo bổ + Rau dền đỏ luộc dầm chanh.',
      snackNight: '21h00: 1 ly sữa ấm bổ sung sắt và acid folic.'
    }
  }
];

