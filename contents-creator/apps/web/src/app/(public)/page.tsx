import Link from "next/link";
import { Sparkles, Palette, Film, Wand2 } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI 대본 생성",
    description: "키워드만 입력하면 웹 리서치 기반 대본 자동 작성. 방향성과 구성까지 AI가 잡아줍니다.",
  },
  {
    icon: Palette,
    title: "스타일 통일",
    description: "레퍼런스 이미지 하나로 전체 씬의 비주얼 일관성 유지.",
  },
  {
    icon: Film,
    title: "씬 자동 생성",
    description: "대본을 이미지와 영상 클립으로 자동 변환. 편집 없이 완성본이 나옵니다.",
  },
  {
    icon: Wand2,
    title: "원클릭 렌더링",
    description: "TTS 음성, 유튜브 스타일 자막, BGM까지 자동 합성.",
  },
];

export default function LandingPage() {
  return (
    <>
      {/* Hero 섹션 */}
      <section className="relative pt-32 md:pt-40 pb-24 md:pb-32 px-6 text-center overflow-hidden">
        {/* 배경 그라데이션 원 */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 blur-3xl opacity-15 pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-blue-500 blur-3xl opacity-10 pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-[250px] h-[250px] rounded-full bg-violet-500 blur-3xl opacity-10 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto">
          {/* 배지 */}
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-violet-400" />
            <span className="text-sm text-zinc-400 font-medium">AI 영상 자동화 플랫폼</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400 mb-6">
            AI로 영상을<br />만들다
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            주제만 입력하면 대본부터 완성 영상까지.<br />
            복잡한 편집 없이, 원클릭으로.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="inline-block bg-white text-zinc-900 rounded-full px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              지금 시작하기 — 무료
            </Link>
            <Link
              href="#features"
              className="inline-block text-zinc-400 hover:text-zinc-50 transition-colors text-base font-medium px-4 py-4"
            >
              기능 살펴보기 →
            </Link>
          </div>

          {/* 소셜 프루프 */}
          <p className="mt-10 text-sm text-zinc-600">
            신용카드 불필요 · 즉시 사용 가능
          </p>
        </div>
      </section>

      {/* Features 섹션 */}
      <section id="features" className="py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-50 mb-4">
              핵심 기능
            </h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              아이디어에서 완성 영상까지, 모든 단계를 자동화합니다.
            </p>
          </div>

          {/* 비대칭 2×2 그리드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map(({ icon: Icon, title, description }, index) => (
              <div
                key={title}
                className={`group rounded-2xl border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm p-8 flex flex-col gap-5 hover:border-zinc-700 hover:-translate-y-1 transition-all duration-300 ${
                  index === 0 ? "sm:col-span-1" : ""
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center border border-zinc-800/50 group-hover:from-blue-500/30 group-hover:to-violet-500/30 transition-all duration-300">
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-50 mb-2">
                    {title}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works 섹션 */}
      <section className="py-24 md:py-32 px-6 border-t border-zinc-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-50 mb-4">
              3단계로 끝납니다
            </h2>
            <p className="text-zinc-400 text-lg">
              복잡한 설정 없이, 지금 바로 시작하세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "주제 입력", desc: "만들고 싶은 영상의 주제나 키워드를 입력합니다." },
              { step: "02", title: "AI 생성", desc: "대본, 이미지, 음성이 자동으로 생성됩니다." },
              { step: "03", title: "영상 완성", desc: "완성된 영상을 다운로드하거나 바로 업로드합니다." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col gap-4">
                <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500 leading-none">
                  {step}
                </span>
                <h3 className="text-xl font-semibold text-zinc-50">{title}</h3>
                <p className="text-zinc-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-2xl border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm p-12 md:p-20 text-center overflow-hidden">
            {/* 배경 글로우 */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-violet-600/10 to-purple-600/10 pointer-events-none" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-50 mb-4">
                무료로 시작하세요
              </h2>
              <p className="text-lg text-zinc-400 mb-10 max-w-md mx-auto">
                지금 가입하고 AI 영상 제작을 경험해보세요. 신용카드 없이 시작 가능합니다.
              </p>
              <Link
                href="/login"
                className="inline-block bg-white text-zinc-900 rounded-full px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                무료 가입하기
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
