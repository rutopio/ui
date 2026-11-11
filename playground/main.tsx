import { useState } from "react";
import { createRoot } from "react-dom/client";
import { Article, ArticleSection, articleMdxComponents } from "../src/components/article/article";
import { CodeBlock } from "../src/components/article/code-block";
import { Badge } from "../src/components/ui/badge";
import { Button } from "../src/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../src/components/ui/dialog";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "../src/components/ui/drawer";
import { Input } from "../src/components/ui/input";
import { PageIntro } from "../src/components/layout/page-intro";
import { PageTransition } from "../src/components/motion/page-transition";
import { ReadingProgressRing } from "../src/components/navigation/outline-menu";
import { SectionHeading } from "../src/components/article/section-heading";
import { SiteLayout } from "../src/components/layout/site-layout";
import { ThemeProvider } from "../src/providers/theme-provider";
import { ThemeToggle } from "../src/components/theme/theme-toggle";
import "./styles/globals.css";

const { p: Paragraph } = articleMdxComponents;
function App() {
  const [page, setPage] = useState(0);
  return (
    <ThemeProvider storageKey="ui-playground">
      <SiteLayout>
        <main className="py-6 sm:py-12">
          <Article>
            <PageIntro
              title="Rutopio UI"
              subtitle="共用介面的標準組合"
              actions={<ThemeToggle />}
            />
            <ArticleSection
              heading={
                <SectionHeading id="typography">文字與文章</SectionHeading>
              }
            >
              <Paragraph>
                正文使用 Inter，中文與日文加入 Noto
                Sans。章節之間留出空間，標題與內文保持緊密。
              </Paragraph>
              <div className="flex flex-col gap-2">
                <p className="font-normal">Regular · 400 / 14 · Aa 中文 日本語</p>
                <p className="font-semibold">Semibold · 550 / 18 · Aa 中文 日本語</p>
                <p className="font-bold">Bold · 700 / 25 · Aa 中文 日本語</p>
              </div>
              <Paragraph lang="ja">
                日本語の文章も、同じ文字サイズと余白で表示します。
              </Paragraph>
              <div className="max-w-xs space-y-6">
                <SectionHeading id="wrapped-heading">
                  換行的章節標題，分隔線接在最後一行文字後面
                </SectionHeading>
                <SectionHeading>
                  A longer heading with <em>inline emphasis</em> that wraps
                </SectionHeading>
              </div>
              <SectionHeading level={3} id="details">
                次標題
              </SectionHeading>
              <Paragraph>
                正文區塊間距 24px；標題後間距 8px；章節間距 64px。
              </Paragraph>
            </ArticleSection>
            <ArticleSection heading={<SectionHeading id="code">程式碼</SectionHeading>}>
              <CodeBlock><code>{'function example(value) {\n  return "# preserved" + value;\n}'}</code></CodeBlock>
            </ArticleSection>
            <ArticleSection
              heading={<SectionHeading id="controls">控制項</SectionHeading>}
            >
              <div className="flex flex-wrap items-center gap-2">
                <Button>主要按鈕</Button>
                <Button variant="outline">次要按鈕</Button>
                <Button variant="ghost">一般操作</Button>
                <Button disabled>停用</Button>
                <Badge>標籤</Badge>
                <Badge variant="secondary">次要標籤</Badge>
                <ReadingProgressRing progress={0.65} />
              </div>
              <label className="flex flex-col gap-2">
                輸入內容
                <Input placeholder="輸入文字" />
              </label>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger
                    render={<Button variant="outline">開啟對話框</Button>}
                  />
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>共用對話框</DialogTitle>
                      <DialogDescription>
                        Escape 關閉，焦點返回觸發按鈕。
                      </DialogDescription>
                    </DialogHeader>
                    <Input aria-label="對話框輸入" />
                  </DialogContent>
                </Dialog>
                <Drawer>
                  <DrawerTrigger
                    render={<Button variant="outline">開啟抽屜</Button>}
                  />
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>共用抽屜</DrawerTitle>
                      <DrawerDescription>
                        手機與桌面使用相同的標題樣式。
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4">
                      <Input aria-label="抽屜輸入" />
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>
            </ArticleSection>
            <ArticleSection
              heading={
                <SectionHeading id="motion">換頁與動態效果</SectionHeading>
              }
            >
              <Button variant="outline" onClick={() => setPage(page + 1)}>
                重新顯示內容
              </Button>
              <PageTransition key={page}>
                <Paragraph>
                  內容 {page + 1}。系統偏好減少動態效果時，直接顯示。
                </Paragraph>
              </PageTransition>
            </ArticleSection>
          </Article>
        </main>
      </SiteLayout>
    </ThemeProvider>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
