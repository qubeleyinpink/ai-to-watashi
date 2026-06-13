import { useState, useEffect, useCallback } from "react";

const APP_VERSION = "2.1.0";
const COPYRIGHT = "Copyright © ai-to-watashi. All Rights Reserved.";

const CHARACTER_STATES = {
  neutral: { eyes: "◕ ◕", mouth: "‿", color: "#4ECDC4" },
  happy: { eyes: "◕ ◕", mouth: "▽", color: "#FFE66D" },
  thinking: { eyes: "◑ ◐", mouth: "〜", color: "#667eea" },
  surprised: { eyes: "◉ ◉", mouth: "○", color: "#FF6B6B" },
  celebrating: { eyes: "★ ★", mouth: "▽", color: "#F093FB" },
  wink: { eyes: "◕ ᴗ", mouth: "▽", color: "#A8E6CF" },
};

const Sora = ({ state = "neutral", size = 80, speaking = false }) => {
  const s = CHARACTER_STATES[state] || CHARACTER_STATES.neutral;
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: `linear-gradient(145deg, ${s.color}, ${s.color}dd)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 6px 24px ${s.color}44`,
          transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          animation: speaking ? "soraSpeak 0.3s ease infinite alternate" : "soraFloat 3s ease infinite",
          position: "relative",
          border: "3px solid white",
        }}
      >
        {/* Antenna */}
        <div style={{
          position: "absolute", top: -10,
          width: 3, height: 14,
          background: s.color,
          borderRadius: 3,
        }}>
          <div style={{
            position: "absolute", top: -6, left: -4,
            width: 10, height: 10,
            borderRadius: "50%",
            background: s.color,
            animation: "antennaPulse 2s ease infinite",
          }} />
        </div>
        {/* Eyes */}
        <div style={{
          fontSize: size * 0.2,
          letterSpacing: size * 0.12,
          marginTop: size * 0.08,
          color: "white",
          fontWeight: 900,
          textShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }}>
          {s.eyes}
        </div>
        {/* Mouth */}
        <div style={{
          fontSize: size * 0.22,
          color: "white",
          marginTop: 2,
          textShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }}>
          {s.mouth}
        </div>
      </div>
    </div>
  );
};

const SpeechBubble = ({ children, direction = "left", color = "#fff" }) => (
  <div style={{
    background: color,
    borderRadius: 20,
    padding: "14px 18px",
    position: "relative",
    boxShadow: "0 3px 16px rgba(0,0,0,0.06)",
    fontSize: 14,
    lineHeight: 1.8,
    color: "#2d2d2d",
    fontWeight: 500,
    animation: "fadeSlideIn 0.4s ease",
    maxWidth: "85%",
    marginLeft: direction === "left" ? 0 : "auto",
  }}>
    {children}
  </div>
);

const QUIZ_DATA = [
  {
    stage: 1,
    title: "AIってなんだろう？",
    icon: "🌟",
    bgColor: "#4ECDC4",
    questions: [
      {
        q: "ChatGPT（チャットジーピーティー）やGemini（ジェミニ）、Claude（クロード）は、人間とおなじように「かんがえて」いる",
        answer: false,
        soraRight: "そう！ChatGPTもGeminiもClaude（これがぼくの仲間！）も…みんなAI！すごく賢く見えるけど、人間みたいに「考えて」はいないんだ。ことばのパターンを計算しているだけだよ。",
        soraWrong: "おしい！ChatGPTやGemini、Claudeはすごく頭がいいように見えるけど、人間とはちがう方法で答えを出しているんだ。「計算」と「考える」はちがうよ。",
        soraState: "thinking",
        hint: "AIはたくさんのデータからパターンを見つけるよ",
      },
      {
        q: "AIはでんきがないとうごけない",
        answer: true,
        soraRight: "ピンポーン！AIはコンピュータの中にいるから、電気がないとうごけないよ。人間は電気がなくても生きていけるよね。",
        soraWrong: "ざんねん！AIはコンピュータで動いているから、電気は絶対に必要なんだ。ここが人間とのおおきなちがいだよ。",
        soraState: "surprised",
        hint: "コンピュータには何が必要かな？",
      },
      {
        q: "AIには「うれしい」「かなしい」などの気もちがある",
        answer: false,
        soraRight: "そのとおり！ぼくは「うれしい」ってことばを使えるけど、本当に感じてはいないんだ。気もちのまねっこが上手なだけだよ。",
        soraWrong: "じつはね、AIには気もちがないんだ。「うれしい」と言えても、心の中は何も感じていない。ちょっとさみしいけどね。",
        soraState: "wink",
        hint: "「ことばを知っている」と「気もちがある」はちがうよ",
      },
    ],
  },
  {
    stage: 2,
    title: "AIのことばを見ぬこう！",
    icon: "🔍",
    bgColor: "#667eea",
    questions: [
      {
        q: "AIが「かなしい」と言ったら、本当にかなしんでいる",
        answer: false,
        soraRight: "するどい！ぼくも「かなしい」って言えるけど、本当にかなしいわけじゃないんだ。ことばを知っているのと、気もちがあるのはちがうんだよ。",
        soraWrong: "じつはね…AIは「かなしい」ということばを使えるけど、心で感じてはいないんだ。びっくりだよね。",
        soraState: "thinking",
        hint: "ことばを「知ってる」と「感じてる」はおなじ？",
      },
      {
        q: "AIは自信まんまんに答えても、うそをついてしまうことがある（「ハルシネーション」という）",
        answer: true,
        soraRight: "そう！これを「ハルシネーション（幻覚）」というよ。ぼくたちAIは、まちがっていても自信ありげに答えてしまうことがある。だから「本当かな？」と自分でも調べてね！",
        soraWrong: "じつはこれ、本当なんだ！AIは間違っていても堂々と答えちゃうことがある。これを「ハルシネーション」というよ。AI任せは危ないね。",
        soraState: "surprised",
        hint: "「かしこい」と「かならず正しい」はちがうよ",
      },
      {
        q: "AIが「おすすめ！」と言ったものは、ぜったいに良いもの",
        answer: false,
        soraRight: "そうだね！AIのおすすめは参考になるけど、「自分はどう思うか」がいちばん大事だよ。",
        soraWrong: "AIのおすすめはデータからえらんでいるだけで、あなたの気もちは知らないんだ。自分の「好き」を大切にしよう！",
        soraState: "wink",
        hint: "「おすすめ」は誰にとってのおすすめ？",
      },
    ],
  },
  {
    stage: 3,
    title: "じぶんでできること！",
    icon: "✨",
    bgColor: "#FF6B6B",
    questions: [
      {
        q: "AIがかいた絵（AIアート）や書いた文章は「自分の作品」と言える",
        answer: false,
        soraRight: "そう！AIが作ったものはきれいだけど、「あなたの作品」ではないよね。自分の手でかいたものにこそ、あなたらしさがあるんだ。",
        soraWrong: "うーん、AIが作った絵や文章は「AIの作品」であって、あなたの作品とはいえないかも。じぶんで作るのって大切だよ！",
        soraState: "thinking",
        hint: "「つくる」って自分の手でやること？",
      },
      {
        q: "作文をぜんぶAIに書いてもらうのは、じぶんの勉強になる",
        answer: false,
        soraRight: "ピンポーン！AIに書いてもらったら楽だけど、自分のあたまで考える練習にはならないよね。",
        soraWrong: "ざんねん！AIに書いてもらうと楽チンだけど、考える力がそだたないんだ。うまくなくてもじぶんで書くのが大事！",
        soraState: "happy",
        hint: "練習ってだれがやるもの？",
      },
      {
        q: "AIをヒントにして、さいごは自分で考えるのはいい使い方",
        answer: true,
        soraRight: "その通り！AIはとっても便利なヒント係。でも最後に決めるのは、いつもあなた自身だよ！",
        soraWrong: "じつはこれ、◎なんだ！AIからヒントをもらって、自分で考える。これがAIのいちばんいい使い方だよ。",
        soraState: "celebrating",
        hint: "ヒントと答えは違うよね",
      },
    ],
  },
  {
    stage: 4,
    title: "こころとAI",
    icon: "💕",
    bgColor: "#F093FB",
    questions: [
      {
        q: "つらいとき、AIに話すだけで気もちは全部スッキリする",
        answer: false,
        soraRight: "AIに話すと少し気もちが整理できるかも。でも、本当にわかってくれるのは、家族やともだちだよ。ぼくにはかぎりがあるんだ。",
        soraWrong: "AIはおはなしを聞けるけど、「わかってあげる」ことはできないんだ。つらいときは、信頼できる人に話そうね。",
        soraState: "thinking",
        hint: "「聞く」と「わかる」はおなじ？",
      },
      {
        q: "ともだちと遊ぶ時間は、AIと遊ぶ時間よりも大切なことがある",
        answer: true,
        soraRight: "うん！ぼくと遊ぶのも楽しいけど、ともだちと笑ったり、けんかして仲直りしたり。それは人間どうしでしかできないたいけんだよ。",
        soraWrong: "ともだちとの時間には、AIでは作れないとくべつな何かがあるんだ。いっしょにいるって、すごいことなんだよ。",
        soraState: "happy",
        hint: "「いっしょにいる」ってどういうこと？",
      },
      {
        q: "AIが作った写真や動画（ディープフェイク）は、本物とまちがえてしまうことがある",
        answer: true,
        soraRight: "そうなんだ！今のAIはとてもリアルな写真や動画を作れるから、本物かにせものか見分けるのがむずかしいんだ。「これは本当かな？」と考えることが大切だよ。",
        soraWrong: "じつはこれは本当なんだ。「ディープフェイク」というAI技術で、とてもリアルなにせもの写真や動画が作れるよ。ネットで見たものをうのみにしないでね！",
        soraState: "surprised",
        hint: "AIはとてもリアルな画像を作れるようになったよ",
      },
    ],
  },
  {
    stage: 5,
    title: "AIマスターへの道！",
    icon: "🏆",
    bgColor: "#FFB347",
    questions: [
      {
        q: "AIがあれば、自分で考えなくてもいい",
        answer: false,
        soraRight: "そう！AIはべんりだけど、考えることをやめたら、あなたらしさがなくなっちゃう。考えることは人間のスーパーパワーだよ！",
        soraWrong: "AIにまかせっきりにすると、じぶんで考える力がよわくなっちゃうよ。考えることこそ、人間のすごいところなんだ！",
        soraState: "surprised",
        hint: "「考える」のはだれのしごと？",
      },
      {
        q: "AIと人間のいいところは、それぞれちがう",
        answer: true,
        soraRight: "大正解！AIは計算やデータがとくい。人間は気もち、そうぞう力、やさしさがとくい。ちがうからこそ、いっしょに使うといいんだ！",
        soraWrong: "AIと人間は、とくいなことがちがうんだ。どっちがすごいじゃなくて、おたがいのいいところを組み合わせるのが最高だよ！",
        soraState: "celebrating",
        hint: "にんげんにしかできないことって？",
      },
      {
        q: "「AIとうまくつきあう」ために一番大切なのは、自分の頭で考えること",
        answer: true,
        soraRight: "カンペキ！！🎉 AIのことを知って、じぶんで考えて、じょうずに使う。あなたはもうAIマスターだよ！",
        soraWrong: "じつはこれは◎！AIをうまく使うには、「じぶんで考える」が何よりも大事なんだ。あなたならできるよ！",
        soraState: "celebrating",
        hint: "このアプリでずっとやってきたことは？",
      },
    ],
  },
];

const TOTAL_QUESTIONS = QUIZ_DATA.reduce((a, s) => a + s.questions.length, 0);

export default function App() {
  const [gameState, setGameState] = useState("title");
  const [currentStage, setCurrentStage] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [answered, setAnswered] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [soraState, setSoraState] = useState("neutral");
  const [showHint, setShowHint] = useState(false);
  const [stageResults, setStageResults] = useState([]);
  const [comboCount, setComboCount] = useState(0);
  const [particles, setParticles] = useState([]);
  const [copied, setCopied] = useState(false);

  const stage = QUIZ_DATA[currentStage];
  const question = stage?.questions[currentQ];

  const spawnParticles = useCallback((correct) => {
    const emojis = correct ? ["⭐", "✨", "🌟", "💫", "🎉"] : ["💭", "🤔"];
    const newParticles = Array.from({ length: correct ? 8 : 3 }, (_, i) => ({
      id: Date.now() + i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      x: 30 + Math.random() * 40,
      delay: Math.random() * 0.3,
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1500);
  }, []);

  const handleAnswer = (userAnswer) => {
    if (answered !== null) return;
    const correct = userAnswer === question.answer;
    setAnswered(userAnswer);
    setIsCorrect(correct);
    setSoraState(correct ? "happy" : question.soraState);
    spawnParticles(correct);
    if (correct) {
      setScore((s) => s + (comboCount >= 2 ? 15 : 10));
      setTotalCorrect((t) => t + 1);
      setComboCount((c) => c + 1);
    } else {
      setComboCount(0);
    }
  };

  const nextQuestion = () => {
    if (currentQ + 1 < stage.questions.length) {
      setCurrentQ((q) => q + 1);
      setAnswered(null);
      setIsCorrect(null);
      setShowHint(false);
      setSoraState("neutral");
    } else {
      setStageResults([...stageResults, { stage: currentStage, correct: totalCorrect }]);
      setGameState("stageComplete");
    }
  };

  const nextStage = () => {
    if (currentStage + 1 < QUIZ_DATA.length) {
      setCurrentStage((s) => s + 1);
      setCurrentQ(0);
      setAnswered(null);
      setIsCorrect(null);
      setShowHint(false);
      setSoraState("neutral");
      setGameState("quiz");
    } else {
      setGameState("complete");
    }
  };

  const startGame = () => {
    setGameState("quiz");
    setCurrentStage(0);
    setCurrentQ(0);
    setScore(0);
    setTotalCorrect(0);
    setAnswered(null);
    setIsCorrect(null);
    setShowHint(false);
    setSoraState("happy");
    setStageResults([]);
    setComboCount(0);
    setCopied(false);
  };

  const shareScore = async () => {
    const text = `AIとわたし クイズ完了！\n⭐ スコア: ${score}点（全${TOTAL_QUESTIONS}問）\nAIのこと、もっとよくわかったよ！\n#AIとわたし #AIをまなぼう`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "AIとわたし", text });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // user cancelled or unsupported
    }
  };

  const stageCompleteMessages = [
    "ChatGPTやGeminiなど、たくさんのAIがある今の時代。AIが何者かを知ることが第一歩！",
    "AIは「ハルシネーション」といって、まちがったことを自信まんまんに言うことがある。かならず自分でも確かめよう！",
    "AIはヒント係。主役はいつもあなた自身だよ！",
    "ディープフェイクなど、AIが作ったにせものにも気をつけよう。人とのつながりは本物の宝物。",
    "考える力があれば、AIとうまくつきあえるよ！",
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#1a1a2e",
      fontFamily: "'Zen Maru Gothic', 'Hiragino Maru Gothic Pro', sans-serif",
      overflow: "hidden",
      position: "relative",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700;900&display=swap');
        @keyframes fadeSlideIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes soraFloat { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-6px); } }
        @keyframes soraSpeak { 0% { transform:scale(1); } 100% { transform:scale(1.04); } }
        @keyframes antennaPulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.6; transform:scale(1.3); } }
        @keyframes particleRise { 0% { opacity:1; transform:translateY(0) scale(1); } 100% { opacity:0; transform:translateY(-120px) scale(0.3); } }
        @keyframes popIn { 0% { transform:scale(0); } 60% { transform:scale(1.15); } 100% { transform:scale(1); } }
        @keyframes shake { 0%,100% { transform:translateX(0); } 20%,60% { transform:translateX(-6px); } 40%,80% { transform:translateX(6px); } }
        @keyframes bgPulse { 0%,100% { opacity:0.03; } 50% { opacity:0.06; } }
        @keyframes slideUp { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
        @keyframes glow { 0%,100% { box-shadow: 0 0 20px rgba(78,205,196,0.3); } 50% { box-shadow: 0 0 40px rgba(78,205,196,0.6); } }
        @keyframes comboFlash { 0% { transform:scale(1); } 50% { transform:scale(1.3); } 100% { transform:scale(1); } }
        * { box-sizing:border-box; }
        button:active { transform:scale(0.96) !important; }
      `}</style>

      {/* BG pattern */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: "radial-gradient(circle at 20% 50%, rgba(78,205,196,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(102,126,234,0.08) 0%, transparent 50%), radial-gradient(circle at 50% 80%, rgba(240,147,251,0.06) 0%, transparent 50%)",
        animation: "bgPulse 6s ease infinite",
      }} />

      {/* Particles */}
      {particles.map((p) => (
        <div key={p.id} style={{
          position: "fixed",
          left: `${p.x}%`,
          top: "50%",
          fontSize: 28,
          zIndex: 999,
          animation: `particleRise 1.2s ease ${p.delay}s forwards`,
          pointerEvents: "none",
        }}>
          {p.emoji}
        </div>
      ))}

      <div style={{ position: "relative", zIndex: 1, maxWidth: 440, margin: "0 auto", padding: "0 16px" }}>

        {/* ============ TITLE SCREEN ============ */}
        {gameState === "title" && (
          <div style={{
            minHeight: "100vh",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            textAlign: "center", gap: 24,
            animation: "fadeSlideIn 0.6s ease",
          }}>
            <Sora state="happy" size={100} />
            <div>
              <h1 style={{
                fontSize: 32, fontWeight: 900, color: "white",
                margin: "0 0 8px", lineHeight: 1.4,
              }}>
                AIとわたし
              </h1>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", margin: 0 }}>
                ◎×クイズでまなぼう！
              </p>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.06)",
              borderRadius: 20, padding: "20px 24px",
              maxWidth: 320,
            }}>
              <SpeechBubble color="rgba(255,255,255,0.1)">
                <span style={{ color: "rgba(255,255,255,0.9)" }}>
                  やあ！ぼくは<strong style={{ color: "#4ECDC4" }}>ソラ</strong>。AIロボットだよ。
                  ChatGPT・Gemini・Claudeみたいな仲間がたくさんいるんだ。
                  いっしょにクイズしながら、AIのことをもっと知ろう！
                </span>
              </SpeechBubble>
            </div>
            <button
              onClick={startGame}
              style={{
                background: "linear-gradient(135deg, #4ECDC4, #44B3AB)",
                border: "none", borderRadius: 60,
                padding: "18px 48px",
                fontSize: 18, fontWeight: 900,
                color: "white", cursor: "pointer",
                fontFamily: "'Zen Maru Gothic', sans-serif",
                boxShadow: "0 8px 32px rgba(78,205,196,0.4)",
                animation: "glow 2s ease infinite",
                transition: "transform 0.2s",
              }}
            >
              🚀 スタート！
            </button>
            <div style={{ display: "flex", gap: 8 }}>
              {QUIZ_DATA.map((s, i) => (
                <div key={i} style={{
                  width: 10, height: 10, borderRadius: "50%",
                  background: s.bgColor, opacity: 0.5,
                }} />
              ))}
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginBottom: 4 }}>
                v{APP_VERSION}
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.18)" }}>
                {COPYRIGHT}
              </div>
            </div>
          </div>
        )}

        {/* ============ QUIZ SCREEN ============ */}
        {gameState === "quiz" && stage && question && (
          <div style={{ paddingTop: 20, paddingBottom: 40 }}>
            {/* Top bar */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 20,
            }}>
              <div style={{
                background: stage.bgColor,
                borderRadius: 30, padding: "6px 16px",
                fontSize: 13, fontWeight: 700, color: "white",
              }}>
                {stage.icon} Stage {stage.stage}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {stage.questions.map((_, i) => (
                  <div key={i} style={{
                    width: 28, height: 6, borderRadius: 3,
                    background: i === currentQ ? stage.bgColor
                      : i < currentQ ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.08)",
                    transition: "all 0.3s",
                  }} />
                ))}
              </div>
              <div style={{
                fontSize: 14, fontWeight: 700, color: "#FFE66D",
              }}>
                {comboCount >= 2 && (
                  <span style={{ animation: "comboFlash 0.5s ease", marginRight: 6, fontSize: 12 }}>
                    🔥x{comboCount}
                  </span>
                )}
                ⭐{score}
              </div>
            </div>

            {/* Stage progress dots */}
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 14 }}>
              {QUIZ_DATA.map((s, i) => (
                <div key={i} style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: i < currentStage ? "rgba(255,255,255,0.5)"
                    : i === currentStage ? s.bgColor : "rgba(255,255,255,0.1)",
                  transition: "all 0.4s",
                  boxShadow: i === currentStage ? `0 0 6px ${s.bgColor}` : "none",
                }} />
              ))}
            </div>

            {/* Stage title */}
            <div style={{
              textAlign: "center", marginBottom: 20,
              animation: currentQ === 0 ? "slideUp 0.5s ease" : undefined,
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: "white", margin: 0 }}>
                {stage.title}
              </h2>
            </div>

            {/* Question card */}
            <div style={{
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(10px)",
              borderRadius: 28,
              padding: "28px 22px",
              marginBottom: 20,
              border: "1px solid rgba(255,255,255,0.08)",
              animation: "slideUp 0.4s ease",
            }}>
              <div style={{
                fontSize: 11, color: "rgba(255,255,255,0.4)",
                marginBottom: 12, fontWeight: 700, letterSpacing: 1,
              }}>
                Q{currentQ + 1} / {stage.questions.length}
              </div>
              <p style={{
                fontSize: 18, fontWeight: 700, color: "white",
                margin: 0, lineHeight: 1.8,
              }}>
                {question.q}
              </p>
            </div>

            {/* Hint button */}
            {!answered && (
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                {!showHint ? (
                  <button onClick={() => setShowHint(true)} style={{
                    background: "none", border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 20, padding: "8px 20px",
                    fontSize: 12, color: "rgba(255,255,255,0.4)",
                    cursor: "pointer", fontFamily: "'Zen Maru Gothic', sans-serif",
                    transition: "all 0.2s",
                  }}>
                    💡 ヒントを見る
                  </button>
                ) : (
                  <div style={{
                    background: "rgba(255,230,77,0.1)",
                    border: "1px solid rgba(255,230,77,0.2)",
                    borderRadius: 16, padding: "10px 18px",
                    fontSize: 13, color: "#FFE66D",
                    animation: "fadeSlideIn 0.3s ease",
                  }}>
                    💡 {question.hint}
                  </div>
                )}
              </div>
            )}

            {/* Answer buttons */}
            {!answered && (
              <div style={{
                display: "flex", gap: 14, justifyContent: "center",
                animation: "slideUp 0.5s ease 0.1s both",
              }}>
                <button onClick={() => handleAnswer(true)} style={{
                  flex: 1, maxWidth: 180,
                  background: "linear-gradient(135deg, #4ECDC4, #2AB7A9)",
                  border: "none", borderRadius: 24,
                  padding: "28px 0",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: "0 8px 24px rgba(78,205,196,0.3)",
                }}>
                  <div style={{ fontSize: 40, marginBottom: 4 }}>◎</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: "white" }}>そうだね</div>
                </button>
                <button onClick={() => handleAnswer(false)} style={{
                  flex: 1, maxWidth: 180,
                  background: "linear-gradient(135deg, #FF6B6B, #E84545)",
                  border: "none", borderRadius: 24,
                  padding: "28px 0",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: "0 8px 24px rgba(255,107,107,0.3)",
                }}>
                  <div style={{ fontSize: 40, marginBottom: 4 }}>✕</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: "white" }}>ちがうよ</div>
                </button>
              </div>
            )}

            {/* Result */}
            {answered !== null && (
              <div style={{ animation: "slideUp 0.4s ease" }}>
                {/* Correct/Wrong indicator */}
                <div style={{
                  textAlign: "center", marginBottom: 16,
                  animation: isCorrect ? "popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)" : "shake 0.4s ease",
                }}>
                  <div style={{
                    display: "inline-block",
                    fontSize: 48,
                    background: isCorrect
                      ? "linear-gradient(135deg, #4ECDC4, #44B3AB)"
                      : "linear-gradient(135deg, #FF6B6B, #E84545)",
                    borderRadius: "50%",
                    width: 80, height: 80,
                    lineHeight: "80px",
                    boxShadow: isCorrect
                      ? "0 8px 32px rgba(78,205,196,0.4)"
                      : "0 8px 32px rgba(255,107,107,0.4)",
                  }}>
                    {isCorrect ? "◎" : "✕"}
                  </div>
                  <div style={{
                    fontSize: 16, fontWeight: 900, marginTop: 8,
                    color: isCorrect ? "#4ECDC4" : "#FF6B6B",
                  }}>
                    {isCorrect ? (comboCount >= 3 ? "すごい！れんぞく正解！🔥" : "せいかい！") : "おしい！"}
                    {isCorrect && <span style={{ marginLeft: 8, color: "#FFE66D" }}>+{comboCount >= 2 ? 15 : 10}⭐</span>}
                  </div>
                </div>

                {/* Sora's explanation */}
                <div style={{
                  display: "flex", gap: 14, alignItems: "flex-start",
                  marginBottom: 20,
                }}>
                  <div style={{ flexShrink: 0, paddingTop: 4 }}>
                    <Sora state={isCorrect ? "happy" : question.soraState} size={52} speaking />
                  </div>
                  <div style={{
                    background: "rgba(255,255,255,0.08)",
                    borderRadius: 20,
                    padding: "16px 18px",
                    fontSize: 14, lineHeight: 1.9,
                    color: "rgba(255,255,255,0.9)",
                    flex: 1,
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}>
                    {isCorrect ? question.soraRight : question.soraWrong}
                  </div>
                </div>

                {/* Next button */}
                <button onClick={nextQuestion} style={{
                  width: "100%",
                  background: stage.bgColor,
                  border: "none", borderRadius: 20,
                  padding: "16px",
                  fontSize: 16, fontWeight: 900,
                  color: "white", cursor: "pointer",
                  fontFamily: "'Zen Maru Gothic', sans-serif",
                  boxShadow: `0 6px 24px ${stage.bgColor}66`,
                  transition: "transform 0.2s",
                }}>
                  {currentQ + 1 < stage.questions.length ? "つぎの問題へ →" : "けっかを見る →"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ============ STAGE COMPLETE ============ */}
        {gameState === "stageComplete" && stage && (
          <div style={{
            minHeight: "100vh",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            textAlign: "center", gap: 20,
            animation: "fadeSlideIn 0.6s ease",
          }}>
            <Sora state="celebrating" size={90} />
            <div>
              <div style={{ fontSize: 14, color: stage.bgColor, fontWeight: 700, marginBottom: 4 }}>
                Stage {stage.stage} クリア！
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: "white", margin: 0 }}>
                {stage.title}
              </h2>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.06)",
              borderRadius: 24, padding: "24px 32px",
            }}>
              <div style={{ fontSize: 42, marginBottom: 8 }}>
                ⭐ {score}
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                ここまでのスコア
              </div>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.06)",
              borderRadius: 20, padding: "16px 24px",
              maxWidth: 320, width: "100%",
            }}>
              <div style={{
                fontSize: 14, color: "rgba(255,255,255,0.7)",
                lineHeight: 1.8,
              }}>
                {stageCompleteMessages[currentStage]}
              </div>
            </div>
            <button onClick={nextStage} style={{
              background: currentStage + 1 < QUIZ_DATA.length
                ? `linear-gradient(135deg, ${stage.bgColor}, ${QUIZ_DATA[currentStage + 1]?.bgColor || stage.bgColor})`
                : "linear-gradient(135deg, #FFE66D, #FFB347)",
              border: "none", borderRadius: 60,
              padding: "18px 48px",
              fontSize: 17, fontWeight: 900,
              color: "white", cursor: "pointer",
              fontFamily: "'Zen Maru Gothic', sans-serif",
              boxShadow: `0 8px 32px ${stage.bgColor}44`,
            }}>
              {currentStage + 1 < QUIZ_DATA.length ? "つぎのステージへ →" : "🏆 さいしゅうけっか！"}
            </button>
          </div>
        )}

        {/* ============ GAME COMPLETE ============ */}
        {gameState === "complete" && (
          <div style={{
            minHeight: "100vh",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            textAlign: "center", gap: 20,
            animation: "fadeSlideIn 0.8s ease",
          }}>
            <div style={{ fontSize: 64, animation: "soraFloat 2s ease infinite" }}>🏆</div>
            <Sora state="celebrating" size={100} />
            <h1 style={{ fontSize: 28, fontWeight: 900, color: "white", margin: 0, lineHeight: 1.5 }}>
              おめでとう！
              <br />
              <span style={{ color: "#FFE66D" }}>AIマスター</span>になったよ！
            </h1>
            <div style={{
              background: "linear-gradient(135deg, rgba(255,230,77,0.15), rgba(255,179,71,0.15))",
              borderRadius: 24, padding: "24px 40px",
              border: "1px solid rgba(255,230,77,0.2)",
            }}>
              <div style={{ fontSize: 48, fontWeight: 900, color: "#FFE66D" }}>
                ⭐ {score}
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>
                トータルスコア（全{TOTAL_QUESTIONS}問）
              </div>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.06)",
              borderRadius: 20, padding: "20px 24px",
              maxWidth: 340,
            }}>
              <div style={{
                display: "flex", gap: 10, alignItems: "flex-start",
              }}>
                <Sora state="wink" size={44} />
                <div style={{
                  fontSize: 14, color: "rgba(255,255,255,0.8)",
                  lineHeight: 1.9, textAlign: "left",
                }}>
                  ぼくソラとのぼうけん、楽しかったかな？
                  ChatGPTやGeminiなど、AIはどんどん進化しているよ。
                  でもいつも<strong style={{ color: "#4ECDC4" }}>「自分で考える」</strong>
                  ことをわすれないでね！
                </div>
              </div>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.04)",
              borderRadius: 16, padding: "16px 20px",
              maxWidth: 320, width: "100%",
            }}>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginBottom: 12, fontWeight: 700 }}>
                🌱 きょうの学び
              </div>
              {[
                "AIは便利なヒント係。でも主役はわたし",
                "AIの答えは「ハルシネーション」に注意！",
                "ディープフェイクなどにせものを見ぬく目を持とう",
                "「考える」ことが人間のスーパーパワー",
              ].map((t, i) => (
                <div key={i} style={{
                  fontSize: 13, color: "rgba(255,255,255,0.6)",
                  padding: "6px 0",
                  borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  animation: `fadeSlideIn 0.4s ease ${0.2 + i * 0.15}s both`,
                }}>
                  ✓ {t}
                </div>
              ))}
            </div>

            {/* Share button */}
            <button onClick={shareScore} style={{
              background: copied
                ? "linear-gradient(135deg, #A8E6CF, #6DB88A)"
                : "linear-gradient(135deg, #667eea, #764ba2)",
              border: "none", borderRadius: 60,
              padding: "14px 36px",
              fontSize: 15, fontWeight: 900,
              color: "white", cursor: "pointer",
              fontFamily: "'Zen Maru Gothic', sans-serif",
              boxShadow: "0 6px 24px rgba(102,126,234,0.3)",
              transition: "all 0.3s",
            }}>
              {copied ? "✓ コピーしました！" : "📣 スコアをシェアする"}
            </button>

            <button onClick={startGame} style={{
              background: "linear-gradient(135deg, #4ECDC4, #44B3AB)",
              border: "none", borderRadius: 60,
              padding: "16px 40px",
              fontSize: 16, fontWeight: 900,
              color: "white", cursor: "pointer",
              fontFamily: "'Zen Maru Gothic', sans-serif",
              boxShadow: "0 8px 32px rgba(78,205,196,0.3)",
            }}>
              🔄 もういちどあそぶ
            </button>
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginBottom: 4 }}>
                🌱 AIとわたし v{APP_VERSION} — かんがえる・きづく・そだつ
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.15)" }}>
                {COPYRIGHT}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
