import "./styles.css";

export const metadata = {
  title: "CFA Level I 自测实验室",
  description: "覆盖 CFA Level I 十大科目的章节练习与智能复盘。",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
