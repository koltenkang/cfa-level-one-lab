"use client";

import { useEffect, useMemo, useState } from "react";
import { questions } from "./questions";

const topics = [
  { id: "ethics", code: "01", zh: "道德与职业标准", en: "Ethical & Professional Standards", weight: "15–20%", color: "#A76D43", modules: ["Ethics and Trust", "Code of Ethics", "Standards I–VII", "Professionalism", "Capital Market Integrity", "Client Duties", "Employer Duties", "Investment Analysis", "Conflicts of Interest", "GIPS"] },
  { id: "quant", code: "02", zh: "数量方法", en: "Quantitative Methods", weight: "6–9%", color: "#29766D", modules: ["Rates and Returns", "Time Value of Money", "Statistical Measures", "Probability Trees", "Portfolio Mathematics", "Simulation Methods", "Estimation", "Hypothesis Testing", "Correlation", "Linear Regression"] },
  { id: "economics", code: "03", zh: "经济学", en: "Economics", weight: "6–9%", color: "#657A3B", modules: ["Supply and Demand", "The Firm", "Market Structures", "Business Cycles", "Fiscal Policy", "Monetary Policy", "Geopolitics", "International Trade", "Capital Flows", "Currency Exchange Rates"] },
  { id: "fsa", code: "04", zh: "财务报表分析", en: "Financial Statement Analysis", weight: "11–14%", color: "#7B5EA7", modules: ["FSA Framework", "Income Statements", "Balance Sheets", "Cash Flow Statements", "Inventories", "Long-Lived Assets", "Income Taxes", "Long-Term Liabilities", "Financial Reporting Quality", "Ratio Analysis"] },
  { id: "corporate", code: "05", zh: "公司发行人", en: "Corporate Issuers", weight: "6–9%", color: "#BC6B5C", modules: ["Organizational Forms", "Stakeholders", "Corporate Governance", "Working Capital", "Capital Budgeting", "Cost of Capital", "Capital Structure", "Business Models", "Operating Leverage", "Corporate Restructuring"] },
  { id: "equity", code: "06", zh: "权益投资", en: "Equity Investments", weight: "11–14%", color: "#B78624", modules: ["Market Organization", "Market Indexes", "Market Efficiency", "Equity Securities", "Company Analysis", "Industry Analysis", "Forecasting", "Dividend Discount Models", "Multiples Valuation", "Private Company Equity"] },
  { id: "fixed", code: "07", zh: "固定收益", en: "Fixed Income", weight: "11–14%", color: "#3E6E9C", modules: ["Bond Features", "Cash Flow Structures", "Issuance and Trading", "Bond Valuation", "Yield Measures", "Spot and Forward Rates", "Duration", "Convexity", "Credit Risk", "Securitization"] },
  { id: "derivatives", code: "08", zh: "衍生品", en: "Derivatives", weight: "5–8%", color: "#80614B", modules: ["Derivative Markets", "Forward Commitments", "Futures", "Swaps", "Options", "Put–Call Parity", "Forward Pricing", "Option Value", "Arbitrage", "Risk Management Uses"] },
  { id: "alternatives", code: "09", zh: "另类投资", en: "Alternative Investments", weight: "7–10%", color: "#4F7D65", modules: ["Features and Structures", "Fees and Returns", "Private Equity", "Private Debt", "Real Estate", "Infrastructure", "Natural Resources", "Hedge Funds", "Digital Assets", "Diversification"] },
  { id: "portfolio", code: "10", zh: "投资组合管理", en: "Portfolio Management", weight: "8–12%", color: "#596A8D", modules: ["Portfolio Process", "Risk and Return", "Diversification", "Efficient Frontier", "Investor Utility", "CAPM", "Risk Management", "Technical Analysis", "Fintech", "Investor Types"] },
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
                <small className="subtopic-label">细分章节 · SUBTOPICS</small>
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
