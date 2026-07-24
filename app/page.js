"use client";

import { useEffect, useMemo, useState } from "react";

const topics = [
  { id: "ethics", code: "01", zh: "道德与职业标准", en: "Ethical & Professional Standards", weight: "15–20%", color: "#A76D43", modules: ["道德与信任", "职业操守准则", "全球投资业绩标准"] },
  { id: "quant", code: "02", zh: "数量方法", en: "Quantitative Methods", weight: "6–9%", color: "#29766D", modules: ["货币时间价值", "统计与概率", "假设检验", "回归分析"] },
  { id: "economics", code: "03", zh: "经济学", en: "Economics", weight: "6–9%", color: "#657A3B", modules: ["市场结构", "经济周期", "货币与财政政策", "国际贸易"] },
  { id: "fsa", code: "04", zh: "财务报表分析", en: "Financial Statement Analysis", weight: "11–14%", color: "#7B5EA7", modules: ["利润表", "资产负债表", "现金流量表", "存货与长期资产"] },
  { id: "corporate", code: "05", zh: "公司发行人", en: "Corporate Issuers", weight: "6–9%", color: "#BC6B5C", modules: ["公司治理", "资本预算", "资本成本", "营运资本"] },
  { id: "equity", code: "06", zh: "权益投资", en: "Equity Investments", weight: "11–14%", color: "#B78624", modules: ["市场组织", "行业分析", "权益估值", "市场效率"] },
  { id: "fixed", code: "07", zh: "固定收益", en: "Fixed Income", weight: "11–14%", color: "#3E6E9C", modules: ["债券结构", "收益率与利差", "久期与凸性", "信用分析"] },
  { id: "derivatives", code: "08", zh: "衍生品", en: "Derivatives", weight: "5–8%", color: "#80614B", modules: ["远期与期货", "期权", "互换", "无套利定价"] },
  { id: "alternatives", code: "09", zh: "另类投资", en: "Alternative Investments", weight: "7–10%", color: "#4F7D65", modules: ["私募股权", "房地产", "商品", "对冲基金"] },
  { id: "portfolio", code: "10", zh: "投资组合管理", en: "Portfolio Management", weight: "8–12%", color: "#596A8D", modules: ["风险与收益", "现代投资组合理论", "CAPM", "投资者需求"] },
];

const questions = [
  { id: 1, topic: "ethics", module: "职业操守准则", difficulty: "基础", stem: "一名分析师发现客户计划利用尚未公开的并购消息交易。分析师最适当的做法是：", options: ["立即执行客户指令", "拒绝交易并向公司合规部门报告", "等待消息公开后补录该交易"], answer: 1, explanation: "重大非公开信息不得用于交易。分析师应拒绝执行，并遵循公司的合规与报告程序。", takeaway: "掌握 Standard II(A)：Material Nonpublic Information。" },
  { id: 2, topic: "ethics", module: "道德与信任", difficulty: "进阶", stem: "在当地法律与 CFA 职业操守准则冲突时，会员最适当的做法是遵守：", options: ["要求更严格的一方", "当地法律，无论其严格程度", "CFA 准则，无论当地法律如何"], answer: 0, explanation: "会员应遵守适用法律和准则中更严格的要求；若无法消除冲突，应与违规活动脱离。", takeaway: "先比较法律与准则的严格程度。" },
  { id: 3, topic: "quant", module: "货币时间价值", difficulty: "基础", stem: "投资者以年利率 6%、按年复利投资 10,000 元，两年后的终值最接近：", options: ["10,600 元", "11,200 元", "11,236 元"], answer: 2, explanation: "FV = 10,000 × (1.06)² = 11,236。", takeaway: "终值公式：FV = PV(1+r)ⁿ。" },
  { id: 4, topic: "quant", module: "统计与概率", difficulty: "进阶", stem: "若两个资产的相关系数为 −1，则由这两个资产构成的组合：", options: ["必然获得正收益", "可能通过适当权重消除风险", "方差必然等于两资产方差之和"], answer: 1, explanation: "完全负相关时，若波动率与权重匹配，可以构造零方差组合。", takeaway: "分散化效果取决于协方差，而非只看单项风险。" },
  { id: 5, topic: "economics", module: "货币与财政政策", difficulty: "基础", stem: "其他条件不变，中央银行在公开市场购买政府债券最可能导致：", options: ["银行准备金增加", "货币供给减少", "短期利率上升"], answer: 0, explanation: "央行买入债券向金融体系注入准备金，通常增加货币供给并压低短期利率。", takeaway: "公开市场买入属于扩张性货币政策。" },
  { id: 6, topic: "economics", module: "市场结构", difficulty: "进阶", stem: "与完全竞争市场相比，垄断企业长期均衡时最可能：", options: ["价格等于边际成本", "产量更低且价格更高", "不存在经济利润"], answer: 1, explanation: "垄断者在 MR=MC 处选择产量，再依据需求曲线定价，通常产生更低产量和更高价格。", takeaway: "垄断企业没有价格接受者的 P=MC 结果。" },
  { id: 7, topic: "fsa", module: "现金流量表", difficulty: "基础", stem: "按照 IFRS，企业支付的利息在现金流量表中：", options: ["只能列为经营活动", "只能列为融资活动", "可列为经营或融资活动，但应保持一致"], answer: 2, explanation: "IFRS 允许利息支付列入经营或融资现金流，但分类政策应一致运用。", takeaway: "注意 IFRS 与 US GAAP 的分类差异。" },
  { id: 8, topic: "fsa", module: "存货与长期资产", difficulty: "进阶", stem: "在价格持续上涨且存货数量不变时，与加权平均法相比，FIFO 最可能报告：", options: ["更高的期末存货", "更低的毛利润", "更高的存货周转率"], answer: 0, explanation: "FIFO 将较新的高成本保留在期末存货中，期末存货与利润通常更高，销货成本更低。", takeaway: "通胀环境下：FIFO → 较高存货、较低 COGS。" },
  { id: 9, topic: "corporate", module: "资本预算", difficulty: "基础", stem: "对于常规现金流项目，若内部收益率高于必要报酬率，该项目的净现值最可能：", options: ["小于零", "等于零", "大于零"], answer: 2, explanation: "常规现金流下，IRR 超过必要报酬率意味着按必要报酬率折现得到正 NPV。", takeaway: "独立项目优先依据 NPV 决策。" },
  { id: 10, topic: "corporate", module: "资本成本", difficulty: "进阶", stem: "计算 WACC 时，各融资来源权重最适合采用：", options: ["账面价值权重", "目标市场价值权重", "历史发行成本权重"], answer: 1, explanation: "WACC 应反映公司预期长期资本结构，因此通常采用目标市场价值权重。", takeaway: "成本和权重都应具有前瞻性。" },
  { id: 11, topic: "equity", module: "权益估值", difficulty: "基础", stem: "其他条件不变，股票必要报酬率上升，戈登增长模型估值最可能：", options: ["上升", "下降", "保持不变"], answer: 1, explanation: "V₀ = D₁/(r−g)。必要报酬率 r 上升会扩大分母并降低估值。", takeaway: "模型要求 r > g。" },
  { id: 12, topic: "equity", module: "市场效率", difficulty: "进阶", stem: "弱式有效市场假说认为当前价格已经反映：", options: ["全部公开与非公开信息", "全部公开信息", "历史价格与成交量信息"], answer: 2, explanation: "弱式效率仅要求价格反映历史市场数据；半强式进一步包含全部公开信息。", takeaway: "弱式→历史；半强式→公开；强式→全部信息。" },
  { id: 13, topic: "fixed", module: "久期与凸性", difficulty: "基础", stem: "其他条件相同，下列债券中利率风险最高的是：", options: ["期限较长、票息较低", "期限较短、票息较低", "期限较长、票息较高"], answer: 0, explanation: "较长期限和较低票息都使现金流回收更晚，从而提高久期与价格敏感度。", takeaway: "久期通常随期限增加、随票息增加而下降。" },
  { id: 14, topic: "fixed", module: "收益率与利差", difficulty: "进阶", stem: "无期权公司债相对同期限政府债的利差扩大，最可能意味着：", options: ["信用风险补偿上升", "债券价格相对上涨", "预期违约损失下降"], answer: 0, explanation: "信用利差扩大通常表示市场要求更高的信用和流动性风险补偿，对应相对价格下降。", takeaway: "利差与相对价格反向变化。" },
  { id: 15, topic: "derivatives", module: "远期与期货", difficulty: "基础", stem: "远期合约建立时，其价值通常最接近：", options: ["零", "标的资产现价", "执行价格"], answer: 0, explanation: "公平远期价格使合约初始时双方价值均为零，通常无需初始净付款。", takeaway: "区分远期价格与远期合约价值。" },
  { id: 16, topic: "derivatives", module: "期权", difficulty: "进阶", stem: "其他条件不变，标的资产波动率上升最可能使欧式看涨期权价值：", options: ["下降", "保持不变", "上升"], answer: 2, explanation: "期权具有不对称收益，波动率上升会增加潜在上行而最大损失受限，因此价值上升。", takeaway: "波动率对看涨和看跌期权价值通常均为正向。" },
  { id: 17, topic: "alternatives", module: "私募股权", difficulty: "基础", stem: "私募股权基金的 J 曲线最准确描述了：", options: ["早期负回报后转为正回报", "回报始终随时间线性上升", "基金杠杆率先升后降"], answer: 0, explanation: "早期管理费、投资成本及尚未退出的投资可能产生负回报，成熟后退出收益使累计回报转正。", takeaway: "J 曲线描述的是私募投资随时间的典型累计回报轨迹。" },
  { id: 18, topic: "alternatives", module: "房地产", difficulty: "进阶", stem: "房地产直接投资指数相较于上市房地产证券指数，报告波动率偏低最可能源于：", options: ["估值平滑", "每日市场定价", "更高的交易频率"], answer: 0, explanation: "评估值更新频率低并带有滞后，会产生估值平滑，低估真实波动率与相关性。", takeaway: "非流动资产的评估值收益常存在平滑偏差。" },
  { id: 19, topic: "portfolio", module: "风险与收益", difficulty: "基础", stem: "投资组合方差中，随着证券数量增加而最难被消除的是：", options: ["非系统性风险", "公司特有风险", "系统性风险"], answer: 2, explanation: "分散化可以大幅减少非系统性风险，但无法消除影响整个市场的系统性风险。", takeaway: "投资者因承担系统性风险而获得风险补偿。" },
  { id: 20, topic: "portfolio", module: "CAPM", difficulty: "进阶", stem: "根据 CAPM，贝塔为 1.2、无风险利率 3%、市场风险溢价 5% 的资产必要报酬率为：", options: ["8.0%", "9.0%", "9.2%"], answer: 1, explanation: "E(R)=Rf+β×MRP=3%+1.2×5%=9%。", takeaway: "CAPM 使用系统性风险 β，而不是总波动率。" },
];

const initialStats = { answered: 0, correct: 0, wrongIds: [], savedIds: [], topicStats: {} };

export default function Home() {
  const [view, setView] = useState("dashboard");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [quiz, setQuiz] = useState([]);
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [stats, setStats] = useState(initialStats);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cfa-lab-stats");
      if (saved) setStats(JSON.parse(saved));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem("cfa-lab-stats", JSON.stringify(stats));
  }, [stats, ready]);

  const accuracy = stats.answered ? Math.round((stats.correct / stats.answered) * 100) : 0;
  const activeQuestion = quiz[index];

  const filtered = useMemo(() => selectedTopic === "all" ? questions : questions.filter(q => q.topic === selectedTopic), [selectedTopic]);

  function startQuiz(topic = selectedTopic, mode = "normal") {
    let pool = topic === "all" ? questions : questions.filter(q => q.topic === topic);
    if (mode === "wrong") pool = questions.filter(q => stats.wrongIds.includes(q.id));
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setQuiz(shuffled);
    setIndex(0);
    setChoice(null);
    setRevealed(false);
    setView("quiz");
  }

  function submit() {
    if (choice === null || revealed) return;
    const correct = choice === activeQuestion.answer;
    setStats(s => {
      const topic = s.topicStats[activeQuestion.topic] || { answered: 0, correct: 0 };
      const wrong = correct ? s.wrongIds.filter(id => id !== activeQuestion.id) : Array.from(new Set([...s.wrongIds, activeQuestion.id]));
      return {
        ...s,
        answered: s.answered + 1,
        correct: s.correct + (correct ? 1 : 0),
        wrongIds: wrong,
        topicStats: { ...s.topicStats, [activeQuestion.topic]: { answered: topic.answered + 1, correct: topic.correct + (correct ? 1 : 0) } }
      };
    });
    setRevealed(true);
  }

  function next() {
    if (index + 1 >= quiz.length) {
      setView("results");
    } else {
      setIndex(i => i + 1);
      setChoice(null);
      setRevealed(false);
    }
  }

  function toggleSaved(id) {
    setStats(s => ({ ...s, savedIds: s.savedIds.includes(id) ? s.savedIds.filter(x => x !== id) : [...s.savedIds, id] }));
  }

  function resetProgress() {
    if (window.confirm("确定清除本机的全部练习记录吗？")) setStats(initialStats);
  }

  return (
    <main>
      <header className="topbar">
        <button className="brand" onClick={() => setView("dashboard")} aria-label="返回首页">
          <span className="brand-mark">I</span>
          <span><strong>LEVEL ONE</strong><small>SELF-ASSESSMENT LAB</small></span>
        </button>
        <nav>
          <button className={view === "dashboard" ? "active" : ""} onClick={() => setView("dashboard")}>学习台</button>
          <button onClick={() => { setSelectedTopic("all"); setView("topics"); }}>章节题库</button>
          <button onClick={() => startQuiz("all")}>随机练习</button>
        </nav>
        <div className="year-pill"><span></span> 2026 考纲</div>
      </header>

      {view === "dashboard" && (
        <div className="page dashboard">
          <section className="hero">
            <div>
              <p className="eyebrow">YOUR STUDY DESK · 第 1 阶段</p>
              <h1>把知识点，<br/><em>练成确定性。</em></h1>
              <p className="hero-copy">围绕 CFA Level I 十大科目，用章节练习、即时解析与错题复盘建立稳定得分能力。</p>
              <div className="hero-actions">
                <button className="primary" onClick={() => startQuiz("all")}>开始今日练习 <span>→</span></button>
                <button className="ghost" onClick={() => setView("topics")}>浏览全部章节</button>
              </div>
            </div>
            <div className="hero-score">
              <div className="score-ring" style={{"--score": `${accuracy * 3.6}deg`}}>
                <div><strong>{accuracy}</strong><span>%</span><small>当前正确率</small></div>
              </div>
              <p>{stats.answered ? "数据已记录，继续保持节奏。" : "完成第一组题后生成掌握度。"}</p>
            </div>
          </section>

          <section className="metrics">
            <article><span>累计作答</span><strong>{stats.answered}</strong><small>QUESTIONS</small></article>
            <article><span>已掌握科目</span><strong>{Object.values(stats.topicStats).filter(x => x.answered >= 2 && x.correct / x.answered >= .7).length}<i>/10</i></strong><small>TOPICS</small></article>
            <article><span>待复盘错题</span><strong>{stats.wrongIds.length}</strong><small>REVIEW</small></article>
            <article><span>收藏题目</span><strong>{stats.savedIds.length}</strong><small>SAVED</small></article>
          </section>

          <div className="dashboard-grid">
            <section className="panel topic-progress">
              <div className="panel-head"><div><p className="eyebrow">CURRICULUM MAP</p><h2>科目掌握度</h2></div><button onClick={() => setView("topics")}>查看全部 →</button></div>
              <div className="topic-list">
                {topics.slice(0, 6).map(t => {
                  const ts = stats.topicStats[t.id];
                  const pct = ts?.answered ? Math.round(ts.correct / ts.answered * 100) : 0;
                  return <button key={t.id} onClick={() => { setSelectedTopic(t.id); setView("topics"); }}>
                    <span className="topic-code" style={{background: t.color}}>{t.code}</span>
                    <span className="topic-name"><b>{t.zh}</b><small>{t.en}</small></span>
                    <span className="bar"><i style={{width: `${pct}%`, background: t.color}}></i></span>
                    <strong>{pct}%</strong>
                  </button>;
                })}
              </div>
            </section>
            <aside className="panel review-card">
              <p className="eyebrow">SMART REVIEW</p>
              <h2>今天，先攻克<br/>最薄弱的一环。</h2>
              <div className="review-visual"><span>{stats.wrongIds.length}</span><small>道待复盘题</small></div>
              <p>错题会自动保留在本机。答对一次后，将从待复盘列表中移除。</p>
              <button disabled={!stats.wrongIds.length} onClick={() => startQuiz("all", "wrong")}>进入错题强化 <span>→</span></button>
            </aside>
          </div>
        </div>
      )}

      {view === "topics" && (
        <div className="page topics-page">
          <div className="page-title"><p className="eyebrow">2026 LEVEL I CURRICULUM</p><h1>选择你的训练场</h1><p>从科目进入章节练习。题目均为原创训练题，按 CFA Level I 三选一形式设计。</p></div>
          <div className="topic-grid">
            {topics.map(t => {
              const count = questions.filter(q => q.topic === t.id).length;
              const ts = stats.topicStats[t.id];
              const pct = ts?.answered ? Math.round(ts.correct / ts.answered * 100) : 0;
              return <article key={t.id} className="topic-card" style={{"--accent": t.color}}>
                <div className="card-top"><span>{t.code}</span><small>考试权重 {t.weight}</small></div>
                <h2>{t.zh}</h2><p>{t.en}</p>
                <div className="module-tags">{t.modules.map(m => <span key={m}>{m}</span>)}</div>
                <div className="card-foot"><div><small>当前题量</small><b>{count} 题 · 掌握度 {pct}%</b></div><button onClick={() => { setSelectedTopic(t.id); startQuiz(t.id); }}>开始 →</button></div>
              </article>;
            })}
          </div>
        </div>
      )}

      {view === "quiz" && activeQuestion && (
        <div className="quiz-shell">
          <aside className="quiz-side">
            <button className="back" onClick={() => setView("dashboard")}>← 退出练习</button>
            <p className="eyebrow">SESSION PROGRESS</p>
            <strong>{String(index + 1).padStart(2, "0")} <i>/ {String(quiz.length).padStart(2, "0")}</i></strong>
            <div className="vertical-progress"><i style={{height: `${((index + 1) / quiz.length) * 100}%`}}></i></div>
            <small>建议每题<br/>控制在 90 秒内</small>
          </aside>
          <section className="question-card">
            <div className="question-meta">
              <span style={{background: topics.find(t => t.id === activeQuestion.topic)?.color}}>{topics.find(t => t.id === activeQuestion.topic)?.zh}</span>
              <span>{activeQuestion.module}</span><span>{activeQuestion.difficulty}</span>
              <button onClick={() => toggleSaved(activeQuestion.id)}>{stats.savedIds.includes(activeQuestion.id) ? "★ 已收藏" : "☆ 收藏"}</button>
            </div>
            <h1>{activeQuestion.stem}</h1>
            <div className="options">
              {activeQuestion.options.map((o, i) => {
                let cls = choice === i ? "selected" : "";
                if (revealed && i === activeQuestion.answer) cls = "correct";
                else if (revealed && choice === i) cls = "wrong";
                return <button disabled={revealed} className={cls} key={o} onClick={() => setChoice(i)}>
                  <span>{String.fromCharCode(65 + i)}</span><b>{o}</b>{revealed && i === activeQuestion.answer && <i>✓</i>}
                </button>;
              })}
            </div>
            {revealed && <div className="explanation">
              <p className="eyebrow">{choice === activeQuestion.answer ? "CORRECT · 回答正确" : "REVIEW · 需要复盘"}</p>
              <h3>答案解析</h3><p>{activeQuestion.explanation}</p>
              <div><b>记忆锚点</b><span>{activeQuestion.takeaway}</span></div>
            </div>}
            <div className="question-actions">
              {!revealed ? <button className="primary" disabled={choice === null} onClick={submit}>确认答案</button> : <button className="primary" onClick={next}>{index + 1 === quiz.length ? "查看结果" : "下一题 →"}</button>}
            </div>
          </section>
        </div>
      )}

      {view === "results" && (
        <div className="page result-page">
          <p className="eyebrow">SESSION COMPLETE</p><h1>这一组练习完成了。</h1>
          <div className="result-number">{accuracy}<span>%</span></div>
          <p>累计完成 {stats.answered} 道题，当前有 {stats.wrongIds.length} 道题等待复盘。</p>
          <div><button className="primary" onClick={() => startQuiz(selectedTopic)}>再练一组</button><button className="ghost" onClick={() => setView("dashboard")}>返回学习台</button></div>
        </div>
      )}

      <footer>
        <span>LEVEL ONE SELF-ASSESSMENT LAB</span>
        <p>原创学习工具，非 CFA Institute 官方产品或授权备考机构。</p>
        <button onClick={resetProgress}>清除本机记录</button>
      </footer>
    </main>
  );
}
