# 한국어 TTS (Text-to-Speech) 애플리케이션

Next.js와 OpenAI TTS API를 활용한 한국어 텍스트 음성 변환 서비스입니다.

## 주요 기능

- ✨ 한국어 텍스트를 자연스러운 음성으로 변환
- 🎙️ 6가지 보이스 옵션 (Alloy, Echo, Fable, Onyx, Nova, Shimmer)
- 🎵 다양한 오디오 포맷 지원 (MP3, Opus, AAC, FLAC, WAV, PCM)
- 🚀 두 가지 모델 선택 (TTS-1: 저지연, TTS-1 HD: 고품질)
- 📥 생성된 음성 다운로드
- 📜 최근 생성 이력 (최대 5개)
- 🔄 자동 재시도 기능 (최대 3회)
- 🌐 반응형 디자인

## 시작하기

### 1. 환경 변수 설정

`.env.local.example` 파일을 복사하여 `.env.local` 파일을 생성하고 OpenAI API 키를 설정하세요:

```bash
cp .env.local.example .env.local
```

`.env.local` 파일에 API 키를 입력:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

OpenAI API 키는 [OpenAI Platform](https://platform.openai.com/api-keys)에서 발급받을 수 있습니다.

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 애플리케이션을 확인하세요.

## 사용 방법

1. **텍스트 입력**: 한국어 텍스트를 입력 영역에 작성합니다 (최대 4096자)
2. **옵션 선택**:
   - 모델: TTS-1 (빠름) 또는 TTS-1 HD (고품질)
   - 보이스: 6가지 음성 중 선택
   - 포맷: 원하는 오디오 포맷 선택
3. **생성**: "음성 생성" 버튼 클릭
4. **재생/다운로드**: 생성된 음성을 바로 재생하거나 다운로드

## 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **API**: OpenAI TTS API
- **Icons**: Lucide React

## 프로젝트 구조

```
src/
├── app/
│   ├── api/
│   │   ├── tts/          # TTS API 라우트
│   │   └── voices/       # 보이스 목록 API
│   ├── layout.tsx        # 루트 레이아웃
│   ├── page.tsx          # 메인 페이지
│   └── globals.css       # 글로벌 스타일
├── components/
│   ├── ui/               # shadcn/ui 컴포넌트
│   ├── AudioPlayer.tsx   # 오디오 플레이어
│   ├── TTSForm.tsx       # TTS 입력 폼
│   └── HistoryList.tsx   # 생성 이력 목록
├── lib/
│   ├── hooks/
│   │   └── useTTS.ts     # TTS 커스텀 훅
│   └── utils.ts          # 유틸리티 함수
└── types/
    └── tts.ts            # TypeScript 타입 정의
```

## API 엔드포인트

### POST /api/tts

텍스트를 음성으로 변환합니다.

**요청 본문**:
```json
{
  "text": "안녕하세요",
  "model": "tts-1",
  "voice": "alloy",
  "format": "mp3"
}
```

**응답**: 오디오 바이너리 스트림

### GET /api/voices

사용 가능한 보이스 목록을 반환합니다.

**응답**:
```json
{
  "voices": [
    {
      "value": "alloy",
      "label": "Alloy",
      "description": "중성적이고 균형잡힌 목소리"
    }
  ]
}
```

## 제한 사항

- 최대 텍스트 길이: 4096자
- OpenAI API 사용량 제한 적용

## 라이선스

ISC
