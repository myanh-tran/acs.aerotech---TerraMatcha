import { useMemo, useState } from "react";
import { latLngToCell } from "h3-js";
import {
  ArrowRight, ArrowUpRight, Check, ChevronRight, Compass, Database,
  Globe2, Hexagon, Info, MapPin, Menu, Moon, ShieldAlert, SlidersHorizontal,
  Sparkles, X,
} from "lucide-react";
import BasinMap from "./BasinMap";
import TraverseProfile from "./TraverseProfile";
import { candidates, metricLabels, modes, target } from "./data";
import { evaluateCandidate } from "./scoring";
import "./SpaApp.css";

const formatScore = (score) => `${score}%`;

function MetricBars({ result }) {
  const metrics = [
    ["slope", `${result.slopeDeg}°`],
    ["roughness", result.roughnessTRI.toFixed(2)],
    ["geology", result.maficBrecciaScore.toFixed(2)],
    ["albedoLight", result.surfaceAlbedo.toFixed(2)],
    ["thermalShock", `${result.skinThermalShockC}°C`],
    ["horizonOcclusion", `${result.horizonOcclusionDeg}°`],
  ];

  return (
    <div className="metric-list">
      {metrics.map(([key, value]) => (
        <div className="metric-line" key={key}>
          <div className="metric-line-label"><span>{metricLabels[key]}</span><strong>{value}</strong></div>
          <div className="metric-track"><span style={{ width: `${result.breakdown[key]}%` }} /></div>
          <small>{result.breakdown[key]}%</small>
        </div>
      ))}
    </div>
  );
}

function CandidateList({ ranked, selectedId, onSelect }) {
  return (
    <section className="panel candidate-panel" aria-labelledby="candidate-title">
      <div className="panel-heading"><div><span className="section-kicker">Earth analogs</span><h2 id="candidate-title">Ứng viên xếp hạng</h2></div><span className="count-pill">06 vùng</span></div>
      <div className="candidate-list">
        {ranked.map((site, index) => (
          <button
            type="button"
            className={`candidate-row ${selectedId === site.id ? "selected" : ""}`}
            key={site.id}
            onClick={() => onSelect(site.id)}
            aria-pressed={selectedId === site.id}
          >
            <span className="rank-number">{String(index + 1).padStart(2, "0")}</span>
            <span className="candidate-identity"><strong>{site.name}</strong><small>{site.place}</small></span>
            <span className="candidate-score">{formatScore(site.score)}</span>
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        ))}
      </div>
      <p className="panel-footnote"><Info size={14} /> Điểm dựa trên bộ số liệu minh họa trong tài liệu kỹ thuật của nhóm.</p>
    </section>
  );
}

function SiteDetail({ site, modeKey }) {
  const h3Index = latLngToCell(site.lat, site.lon, 4);
  const lowSun = site.minSunAngleDeg > 10;
  return (
    <section className="panel detail-panel" aria-labelledby="detail-title">
      <div className="panel-heading">
        <div><span className="section-kicker">Selected grid cell</span><h2 id="detail-title">{site.name}</h2></div>
        <span className="large-score">{site.score}<small>%</small></span>
      </div>
      <div className="site-subtitle"><MapPin size={14} /> {site.place} <span>·</span> {site.lat.toFixed(3)}°, {site.lon.toFixed(3)}°</div>
      <p className="site-description">{site.description}</p>
      <div className="detail-meta">
        <div><span>Ô H3</span><strong>{h3Index}</strong></div>
        <div><span>Hậu cần</span><strong>{site.logisticsTier}</strong></div>
        <div><span>Cửa sổ thử nghiệm</span><strong>{site.bestTestingWindow}</strong></div>
      </div>
      <div className="subsection-heading"><h3>Tiêu chí tương đồng</h3><span>G‑GD · {modes[modeKey].short}</span></div>
      <MetricBars result={site} />
      {site.rolloverHazard && <div className="hazard"><ShieldAlert size={17} /><span>Độ dốc vượt 20°. Điểm đã áp dụng hệ số an toàn 0,65.</span></div>}
      {lowSun && <div className="mitigation"><Sparkles size={16} /><span>Để thử nghiệm cảm biến ở góc nắng thấp, hãy chọn khung giờ gần bình minh hoặc hoàng hôn và đo lại góc chiếu sáng tại hiện trường.</span></div>}
      <p className="panel-footnote">Giá trị địa chất, albedo và nhiệt trong danh mục này là dữ liệu mẫu của nhóm. Điểm số chưa phải phép đo kiểm chứng tại ô H3.</p>
    </section>
  );
}

function TargetCard() {
  return (
    <section className="target-card">
      <div className="target-graphic"><img src="/media/lunar-disk.jpg" alt="" /></div>
      <div className="target-content">
        <span className="section-kicker">Mission target / Moon</span>
        <h2>{target.name}</h2>
        <p>Thử nghiệm xe tự hành LTV trong điều kiện địa hình lòng chảo, đá mafic và góc nắng thấp của vùng cực Nam.</p>
        <div className="target-tags"><span><Moon size={13} /> {target.region}</span><span><Compass size={13} /> NASA LTV</span><a href="https://science.nasa.gov/moon/daily-moon-guide/" target="_blank" rel="noreferrer">Ảnh Mặt Trăng · NASA SVS <ArrowUpRight size={12} /></a></div>
      </div>
    </section>
  );
}

export default function SpaApp() {
  const [modeKey, setModeKey] = useState("CREWED_TRAVERSE");
  const [selectedId, setSelectedId] = useState(candidates[1].id);
  const [activeSection, setActiveSection] = useState("overview");
  const [marsOpen, setMarsOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const ranked = useMemo(
    () => candidates.map((candidate) => ({ ...candidate, ...evaluateCandidate(candidate, modeKey) }))
      .sort((a, b) => b.score - a.score),
    [modeKey],
  );
  const selected = ranked.find((candidate) => candidate.id === selectedId) ?? ranked[0];
  const dualSite = ranked[0].score < 85
    ? {
      mechanics: [...ranked].sort((a, b) => (b.breakdown.roughness + b.breakdown.geology) - (a.breakdown.roughness + a.breakdown.geology))[0],
      optics: [...ranked].sort((a, b) => (b.breakdown.albedoLight + b.breakdown.horizonOcclusion) - (a.breakdown.albedoLight + a.breakdown.horizonOcclusion))[0],
    }
    : null;
  const navigation = [
    { id: "overview", label: "Khám phá analog", icon: Globe2 },
    { id: "mission", label: "Mục tiêu SPA", icon: Moon },
    { id: "candidates", label: "Ô lưới ứng viên", icon: Hexagon },
    { id: "analysis", label: "Phân tích LTV", icon: SlidersHorizontal },
    { id: "sources", label: "Nguồn dữ liệu", icon: Database },
  ];

  return (
    <div className="spa-shell">
      <aside className={`spa-sidebar ${mobileNavOpen ? "open" : ""}`}>
        <a className="spa-brand" href="#overview" onClick={() => setActiveSection("overview")}><span><Hexagon size={22} /></span><strong>ACS<span>.</span>AEROTECH</strong></a>
        <p className="sidebar-caption">Mission control</p>
        <nav aria-label="Điều hướng nghiên cứu">
          {navigation.map(({ id, label, icon: Icon }) => <a key={id} className={activeSection === id ? "active" : ""} href={`#${id}`} aria-current={activeSection === id ? "location" : undefined} onClick={() => { setActiveSection(id); setMobileNavOpen(false); }}><Icon size={17} /> {label}</a>)}
        </nav>
        <div className="sidebar-bottom"><span className="online-dot" /> Bản xem trước kỹ thuật <small>NASA Space Apps Challenge 2026</small></div>
      </aside>
      <main className="spa-main" id="overview">
        <header className="spa-topbar">
          <button className="mobile-menu" aria-label="Mở menu" onClick={() => setMobileNavOpen(!mobileNavOpen)}><Menu size={21} /></button>
          <div className="topbar-route">Workspace <ChevronRight size={13} /> <strong>SPA Basin analog explorer</strong></div>
          <div className="topbar-right"><span className="preview-badge"><span /> Bản mẫu thiết kế</span><span className="project-name">PROJECT ACS / 2026</span></div>
        </header>
        <div className="spa-content">
          <div className="page-intro">
            <div><span className="eyebrow"><span /> EARTH ANALOG DISCOVERY</span><h1>Tìm nơi trên Trái Đất<br /><em>để thử nghiệm LTV.</em></h1><p>Quét ứng viên theo môi trường bồn địa South Pole–Aitken và yêu cầu vận hành của xe địa hình Mặt Trăng.</p></div>
            <button className="mars-button" onClick={() => setMarsOpen(true)}><span>Mars cross-compatible</span> Jezero Crater <ArrowUpRight size={16} /></button>
          </div>
          <div id="mission"><TargetCard /></div>
          <div className="section-title" id="analysis"><div><span className="section-kicker">01 / LTV configuration</span><h2>Chế độ vận hành</h2></div><p>Trọng số và tiêu chí trọng yếu thay đổi theo bài thử nghiệm.</p></div>
          <div className="mode-grid" role="group" aria-label="Chế độ vận hành LTV">
            {Object.entries(modes).map(([key, mode]) => (
              <button type="button" key={key} className={`mode-card ${key === modeKey ? "active" : ""}`} onClick={() => setModeKey(key)} aria-pressed={key === modeKey}>
                <span className="mode-top"><span className="mode-icon">{key === modeKey ? <Check size={15} /> : <Compass size={15} />}</span><span className="mode-index">0{Object.keys(modes).indexOf(key) + 1}</span></span>
                <strong>{mode.label}</strong><small>{mode.short}</small>
              </button>
            ))}
          </div>
          <p className="mode-description"><Info size={15} /> {modes[modeKey].description}</p>
          <div className="section-title" id="candidates"><div><span className="section-kicker">02 / Geospatial scan</span><h2>Bản đồ ô lưới H3</h2></div><p>Chọn điểm trên bản đồ hoặc danh sách để xem phân tích.</p></div>
          <div className="explorer-grid">
            <div className="panel map-panel"><div className="panel-heading"><div><span className="section-kicker">Earth / candidate regions</span><h2>6 bồn địa ứng viên</h2></div><span className="map-status"><span /> H3 res 4</span></div><BasinMap ranked={ranked} selected={selected} onSelect={setSelectedId} /><div className="map-legend"><span><i /> Ô đang chọn</span><span><i /> Ứng viên khác</span></div></div>
            <CandidateList ranked={ranked} selectedId={selected.id} onSelect={setSelectedId} />
          </div>
          <div className="analysis-grid">
            <SiteDetail site={selected} modeKey={modeKey} />
            <div className="analysis-side"><TraverseProfile site={selected} />
              {dualSite && <section className="panel pairing-panel"><span className="section-kicker">Dual-site testing</span><h2>Cặp địa điểm bổ trợ</h2><p>Điểm cao nhất dưới 85%. Kết hợp hai địa điểm để tách bài thử nghiệm cơ học và quang học.</p><div><span>Cơ học</span><strong>{dualSite.mechanics.name}</strong></div><div><span>Quang học</span><strong>{dualSite.optics.name}</strong></div></section>}
              <section className="panel method-panel" id="sources"><span className="section-kicker">Method / G‑GD</span><h2>Cách tính điểm</h2><p>Điểm Gaussian theo từng tiêu chí, nhân hệ số phạt tiêu chí trọng yếu và hệ số an toàn khi dốc vượt 20°. Bộ mẫu hiện có NDVI để lọc thảm thực vật. Chưa có dữ liệu LandCover để lọc nước và đô thị.</p><a href="https://h3geo.org/docs/" target="_blank" rel="noreferrer">H3 documentation <ArrowRight size={15} /></a><a href="https://open-meteo.com/en/docs/elevation-api" target="_blank" rel="noreferrer">Copernicus DEM qua Open-Meteo <ArrowRight size={15} /></a></section>
            </div>
          </div>
          <footer className="spa-footer"><span>ACS.AEROTECH · Technical prototype</span><span>Ứng viên và chỉ số mô phỏng từ tài liệu thiết kế của nhóm.</span></footer>
        </div>
      </main>
      {marsOpen && <div className="modal-backdrop" role="presentation" onClick={() => setMarsOpen(false)}><div className="mars-modal" role="dialog" aria-modal="true" aria-labelledby="mars-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" aria-label="Đóng" onClick={() => setMarsOpen(false)}><X size={19} /></button><span className="section-kicker">Cross-compatible mode</span><h2 id="mars-title">Jezero Crater · Mars</h2><p>Tài liệu định hướng Jezero là mục tiêu tương thích chéo cho rover bồn địa va chạm. Bộ tham số và dữ liệu Sao Hỏa chưa được cung cấp để tính điểm G‑GD, nên màn hình này giới thiệu phạm vi mở rộng.</p><button className="secondary-action" onClick={() => setMarsOpen(false)}>Trở về phân tích SPA <ArrowRight size={15} /></button></div></div>}
    </div>
  );
}
