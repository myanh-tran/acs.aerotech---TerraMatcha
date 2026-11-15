export const target = {
  name: "South Pole–Aitken Basin",
  region: "53°S – 88°S",
  equipment: "Lunar Terrain Vehicle",
  metrics: {
    slope: { mean: 9.5, std: 5.5 },
    roughness: { mean: 0.68, std: 0.2 },
    geology: { mean: 0.95, std: 0.15 },
    albedoLight: { mean: 0.1, std: 0.06 },
    thermalShock: { mean: 25, std: 8 },
    horizonOcclusion: { mean: 4.5, std: 2.5 },
  },
};

export const modes = {
  CREWED_TRAVERSE: {
    label: "Crewed EVA Traverse",
    short: "Phi hành gia lái",
    description: "Ưu tiên độ dốc, độ nhám và nền đá khi phi hành gia trực tiếp điều khiển LTV.",
    weights: { slope: 0.3, roughness: 0.25, geology: 0.25, albedoLight: 0.05, thermalShock: 0.1, horizonOcclusion: 0.05 },
    critical: ["slope", "geology"],
  },
  AUTONOMOUS_SCOUT: {
    label: "Uncrewed Autonomous Scouting",
    short: "Tự hành",
    description: "Tăng trọng số cho ánh sáng, camera và khả năng định vị khi xe hoạt động tự hành.",
    weights: { slope: 0.2, roughness: 0.15, geology: 0.1, albedoLight: 0.25, thermalShock: 0.1, horizonOcclusion: 0.2 },
    critical: ["slope", "albedoLight"],
  },
  WHEEL_TORTURE_TEST: {
    label: "Wheel & Suspension Torture Test",
    short: "Lốp & hệ treo",
    description: "Tập trung vào đá mafic, độ nhám và tải cơ học của bánh xe.",
    weights: { slope: 0.2, roughness: 0.35, geology: 0.3, albedoLight: 0, thermalShock: 0.15, horizonOcclusion: 0 },
    critical: ["roughness", "geology"],
  },
};

export const metricLabels = {
  slope: "Độ dốc",
  roughness: "Độ nhám TRI",
  geology: "Đá mafic / breccia",
  albedoLight: "Phản chiếu bề mặt",
  thermalShock: "Sốc nhiệt",
  horizonOcclusion: "Che khuất chân trời",
};

export const candidates = [
  {
    id: "H3-SPA-01", name: "Haughton Impact Basin", place: "Devon Island, Canada",
    lat: 75.383, lon: -89.667, type: "Bồn địa va chạm vùng cực",
    slopeDeg: 10.5, roughnessTRI: 0.72, maficBrecciaScore: 0.94,
    surfaceAlbedo: 0.14, skinThermalShockC: 21.5, horizonOcclusionDeg: 4.8,
    ndvi: 0.02, minSunAngleDeg: 2.2, logisticsTier: "Tier 3 · Vùng Bắc Cực xa",
    bestTestingWindow: "Tháng 9 – 10", description: "Đá dăm va chạm, góc nắng thấp và địa hình lòng chảo phục vụ thử nghiệm cảm biến tự hành.",
  },
  {
    id: "H3-SPA-02", name: "Askja & Holuhraun", place: "Iceland",
    lat: 65.033, lon: -16.75, type: "Lòng chảo núi lửa và đồng bazan",
    slopeDeg: 9.2, roughnessTRI: 0.7, maficBrecciaScore: 0.96,
    surfaceAlbedo: 0.09, skinThermalShockC: 22, horizonOcclusionDeg: 5.2,
    ndvi: 0.01, minSunAngleDeg: 3.5, logisticsTier: "Tier 2 · Đường cao nguyên",
    bestTestingWindow: "Tháng 10 – 11", description: "Bazan tối màu và tro núi lửa sắc cạnh gần với môi trường thử nghiệm cơ học của SPA.",
  },
  {
    id: "H3-SPA-03", name: "Sudbury Basin Rim", place: "Ontario, Canada",
    lat: 46.616, lon: -81.183, type: "Vành bồn địa va chạm nhiều vòng",
    slopeDeg: 8, roughnessTRI: 0.6, maficBrecciaScore: 0.98,
    surfaceAlbedo: 0.12, skinThermalShockC: 19.5, horizonOcclusionDeg: 3.8,
    ndvi: 0.18, minSunAngleDeg: 20, logisticsTier: "Tier 1 · Đường bộ",
    bestTestingWindow: "Tháng 11 và tháng 3", description: "Vùng có đá norite và đá tan chảy do va chạm, phù hợp thử nghiệm vật liệu và bánh xe.",
  },
  {
    id: "H3-SPA-04", name: "Lunar Crater Basin", place: "Nevada, Hoa Kỳ",
    lat: 38.384, lon: -116.069, type: "Miệng núi lửa và bồn địa bazan",
    slopeDeg: 11, roughnessTRI: 0.68, maficBrecciaScore: 0.91,
    surfaceAlbedo: 0.11, skinThermalShockC: 26.5, horizonOcclusionDeg: 5.5,
    ndvi: 0.06, minSunAngleDeg: 28, logisticsTier: "Tier 1 · Đường bộ",
    bestTestingWindow: "Tháng 11 – 2", description: "Nền bazan khô, biên độ nhiệt lớn và vành hố tạo đường chân trời bị che khuất.",
  },
  {
    id: "H3-SPA-05", name: "Black Point Basin", place: "Arizona, Hoa Kỳ",
    lat: 35.688, lon: -111.465, type: "Đồng bazan và trường miệng hố",
    slopeDeg: 8.8, roughnessTRI: 0.66, maficBrecciaScore: 0.9,
    surfaceAlbedo: 0.1, skinThermalShockC: 27, horizonOcclusionDeg: 4,
    ndvi: 0.07, minSunAngleDeg: 31, logisticsTier: "Tier 1 · Xe tới được",
    bestTestingWindow: "Tháng 12 – 1", description: "Nền đá bazan tối màu, đường tiếp cận thuận lợi cho thử nghiệm lốp và hệ treo.",
  },
  {
    id: "H3-SPA-06", name: "Lonar Impact Crater", place: "Deccan Traps, Ấn Độ",
    lat: 19.976, lon: 76.508, type: "Hố va chạm trên nền bazan",
    slopeDeg: 14, roughnessTRI: 0.74, maficBrecciaScore: 0.95,
    surfaceAlbedo: 0.11, skinThermalShockC: 23, horizonOcclusionDeg: 6.2,
    ndvi: 0.19, minSunAngleDeg: 46.5, logisticsTier: "Tier 2 · Đường khu vực",
    bestTestingWindow: "Tháng 12 – 2", description: "Vụ va chạm trên nền bazan tạo đá dăm phù hợp với bài toán cơ học bồn địa SPA.",
  },
];
