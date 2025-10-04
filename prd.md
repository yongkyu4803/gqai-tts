알겠습니다. **Next.js 기반 TTS 기본 애플리케이션(PRD)**을 OpenAI 공식 문서에 기반해 정리했습니다. (모델/엔드포인트/리텐션·보안/실시간 옵션 등은 문서 근거를 포함했습니다.)

---

# 제품 요구사항 문서(PRD): Next.js TTS 기본 애플리케이션

## 1. 배경/목표

* **목표:** 텍스트를 입력하면 **자연스러운 음성 파일(MP3/WAV/OGG/Opus)**을 생성·재생하는 **웹 애플리케이션**을 Next.js로 구축한다. 1차 목표는 **파일 생성형 TTS**이며, 2차 목표로 **저지연(실시간) 음성 합성**(옵션)을 고려한다.
* **근거:** OpenAI는 `/v1/audio/speech` 엔드포인트로 **Text→Speech**를 제공하며, 웹 앱에서 JS/Node로 쉽게 호출할 수 있다. 실시간 상호작용이 필요하면 **Realtime API**로 오디오 스트리밍을 제공한다. ([OpenAI 플랫폼][1])

## 2. 범위(Scope)

* **In-Scope (MVP)**

  1. 텍스트 입력 → 서버 액션/Route Handler가 `/v1/audio/speech` 호출 → 음성 바이너리 반환 → **클라이언트에서 재생/다운로드**
  2. 선택 가능한 **모델**(`tts-1`, `tts-1-hd`)과 **보이스 프리셋** 옵션
  3. **오디오 포맷 선택**: mp3(기본), wav/ogg/opus
  4. **세션 로그**(요청 텍스트 길이, 모델/보이스/포맷, 생성 시간, 에러 코드)
* **Out-of-Scope (MVP 이후)**

  * 사용자 보이스 클로닝, 폴리싱(디에스핑/노멀라이즈) 파이프라인
  * 계정/결제, 크레딧 차감 UI
  * 전화/콜봇 연동(**SIP Realtime**)은 2단계 고려. ([OpenAI 플랫폼][2])

## 3. 핵심 사용자 시나리오(User Stories)

* **U1**: 사용자는 텍스트를 붙여넣고 “생성”을 누르면 **수 초 내 MP3**가 재생된다.
* **U2**: 사용자는 모델(`tts-1`/`tts-1-hd`)과 보이스를 바꾸며 품질/지연을 비교한다. `tts-1`은 저지연, `tts-1-hd`는 고품질을 지향. ([OpenAI 플랫폼][3])
* **U3**: 긴 텍스트(예: 5~10분 분량)를 문단 단위로 나눠 **순차 합성→연결**할 수 있다.
* **U4 (옵션)**: 실시간 대화형 데모에서 **마이크 입력 → 즉시 음성 응답(Streaming)**을 체험한다(Realtime API). ([OpenAI 플랫폼][4])

## 4. 기능 요구사항(Functional Requirements)

1. **텍스트→오디오 생성**

   * `POST /api/tts` (Next.js Route Handler) → OpenAI `/v1/audio/speech` 프록시 호출
   * 요청 필드: `text`(필수), `model`(`tts-1`|`tts-1-hd`), `voice`(선택), `format`(mp3|wav|ogg|opus)
   * 응답: `audio/*` 바이너리 스트림(기본 mp3)
   * 참고: OpenAI Audio API 레퍼런스(텍스트→오디오). ([OpenAI 플랫폼][1])
2. **플레이어 UI**

   * `<audio controls>`로 즉시 재생, **다운로드 버튼** 제공
   * 최근 5개 생성 이력 목록(텍스트 앞 50자 미리보기, 모델/보이스/포맷, 생성시각)
3. **모델/보이스 선택**

   * 기본 모델: `tts-1`(속도), 고품질 옵션: `tts-1-hd`(더 자연스러움)
   * 보이스: 문서에 제시된 **프리셋 이름 목록**을 드롭다운으로 제공(향후 업데이트 가능) ([OpenAI 플랫폼][3])
4. **긴 텍스트 처리**

   * 5,000자 초과 시 **문단 분할**(클라이언트 또는 서버) → 병렬/직렬 합성 → **순서대로 이어붙이기**(옵션 제공)
5. **실시간(옵션 토글)**

   * Realtime API(WebRTC) 데모 페이지: 연결/마이크 권한/지연 표시(밀리초)
   * 서버 사이드 토큰 중계(웹소켓/서버 전송 이벤트) ([OpenAI 플랫폼][5])
6. **오류 처리**

   * 400(입력 과다), 401(API Key), 429(레이트 한도), 5xx(일시 장애) 별 **토스트/가이드 메시지**
   * 재시도 정책(지수 백오프, 최대 3회)

## 5. 비기능 요구사항(Non-Functional)

* **응답 시간:** 파일 생성형 TTS는 **< 4초(평균)** 목표, Realtime 데모는 **< 300ms 지각** 목표(네트워크 포함, 최적화는 2단계). ([OpenAI 플랫폼][4])
* **가용성/안정성:** OpenAI API 장애 시 안내 배너 + 대체 시도(큐잉 후 재시도)
* **보안:** 브라우저에서 **직접 OpenAI 키 노출 금지** → 모든 호출은 서버 경유(Edge/Node).
* **개인정보/데이터 보존:** `/v1/audio/speech` 요청의 **로그 보존·스토리지 정책**을 내부 규정에 맞춰 최소화. (OpenAI 플랫폼 **데이터 컨트롤** 표에 따르면 각 엔드포인트의 보존 정책이 명시됨) ([OpenAI 플랫폼][6])
* **브라우저 호환:** 최신 Chrome/Safari/Edge, iOS/Android WebView 기본 테스트

## 6. 시스템 아키텍처(요약)

* **Next.js(App Router)**

  * **UI 페이지**: `/`(생성형), `/realtime`(옵션)
  * **Route Handlers**:

    * `POST /api/tts` → OpenAI `/v1/audio/speech` 프록시
    * `GET /api/voices` → 보이스 목록(정적 혹은 캐시)
  * **서버 환경**: Vercel/Node (Edge 런타임 가능)
* **OpenAI API**

  * **Text→Speech**: `POST https://api.openai.com/v1/audio/speech` (바이너리 반환)
  * **Realtime(옵션)**: WebRTC/WS로 양방향 오디오 스트리밍(모델: Realtime 계열) ([OpenAI 플랫폼][1])

## 7. 상세 API 계약(내부)

### 7.1 `POST /api/tts` (서버)

* **Request(JSON)**

  ```json
  {
    "text": "안녕하세요. 오늘 일정은...",
    "model": "tts-1",
    "voice": "alloy",
    "format": "mp3"
  }
  ```
* **Server → OpenAI**

  * `POST /v1/audio/speech`
  * Headers: `Authorization: Bearer <API_KEY>`, `Content-Type: application/json`
  * Body: `{ "model": "tts-1", "input": "<text>", "voice": "alloy", "format": "mp3" }`  ([OpenAI 플랫폼][1])
* **Response**

  * `Content-Type: audio/mpeg` 등으로 바이너리 스트림 반환
* **오류**

  * 400: text 누락/길이 초과, 401: 키 오류, 429: 레이트 초과, 5xx: OpenAI 장애

### 7.2 `GET /api/voices`

* 정적 목록(예: `alloy`, `verse`, …) 또는 문서 업데이트 반영해 수동 관리(캐시 24h)

## 8. 데이터 모델/저장

* **세션 로그(옵션, 서버측 DB)**

  * `id`, `created_at`, `text_hash`(원문 저장 대신 해시), `chars`, `model`, `voice`, `format`, `duration_ms`, `status`, `error_code`
* **캐시(옵션)**

  * 동일 `text+model+voice+format` 조합 결과를 **파일 스토리지**에 캐시하여 재사용

## 9. UX 플로우

1. 홈 진입 → 텍스트 입력 → 모델/보이스/포맷 선택 → **[생성]**
2. 로딩 스피너 → 성공 시 오디오 플레이어 표시(자동 재생) + **[다운로드]**
3. 하단에 “최근 생성” 카드 리스트
4. (옵션) Realtime 탭: **[연결]** → 마이크 권한 → **지연(ms)** 표시 + 음성 응답 스트리밍

## 10. 성능/비용 가이드

* **모델 선택 기준:**

  * `tts-1` = **낮은 지연** 우선, `tts-1-hd` = **음질** 우선(내레이션/보이스오버). ([OpenAI 플랫폼][3])
* **대용량 텍스트:** 문단 분할 합성(병렬 시 동시 연결 처리), 네트워크 병목 최소화(HTTP/2, CDN 캐시)
* **요청 최적화:** 클라이언트 Debounce, 중복 요청 방지(Progress 상태 관리)

## 11. 보안/프라이버시

* OpenAI API 키는 **서버 비밀 변수**(환경변수)로만 보관
* 로그에는 **원문 텍스트 저장 금지**(해시/길이만 기록)
* 데이터 보존 정책은 OpenAI **Data controls** 문서와 내부 정책을 모두 준수(오디오 엔드포인트의 저장/보존 항목 확인) ([OpenAI 플랫폼][6])

## 12. 수용 기준(Acceptance Criteria)

* [ ] 200자 텍스트로 mp3 생성 ≤ 4초(평균, 한국/아시아 리전 기준)
* [ ] `tts-1`/`tts-1-hd` 전환 시 정상 동작
* [ ] 보이스/포맷 변경 즉시 반영 및 재생 가능
* [ ] 429/401/5xx 상황에서 사용자 친화적 에러 UI
* [ ] (옵션) Realtime 데모에서 왕복 지연 표기 및 연속 응답

## 13. 리스크 & 대응

* **API 변경/모델 업데이트**: 모델·보이스 프리셋 변경 가능성 → **버전 라벨링/피처 플래그**
* **브라우저 오디오 호환성**: iOS Safari의 자동재생 제한 → **사용자 제스처 트리거** 필요
* **네트워크 변동**: 지역/시간대별 지연 편차 → Vercel Edge/리전 라우팅 고려

## 14. 로드맵(권장)

* **v1 (MVP)**: 파일 생성형 TTS, 로그/다운로드, 기본 보이스
* **v1.1**: 문단 분할/합성 병렬화, 캐시 도입
* **v2**: Realtime 데모(마이크/스트리밍), 지연 모니터, 간단 콜봇 샘플 ([OpenAI 플랫폼][4])
* **v3**: 사용자 세션/프로필, 즐겨찾기 보이스, 배치 생성

## 15. 개발 체크리스트

* [ ] **환경변수**: `OPENAI_API_KEY`
* [ ] **Route Handlers**: `/api/tts`, 오류/스트림 처리
* [ ] **CORS/보안**: 서버 프록시만 노출
* [ ] **오디오 플레이어**: 모바일 자동재생 정책 준수
* [ ] **테스트**: 짧은/긴 텍스트, 포맷별 디코딩, 레이트 초과 시 재시도
* [ ] **문서화**: 모델/보이스/포맷 차이 설명, 한계 및 FAQ

---

### 참고 근거(주요 문서)

* **Audio API(텍스트→스피치, `/v1/audio/speech`)**: 엔드포인트/파라미터/JS 예시. ([OpenAI 플랫폼][1])
* **Realtime API 개념/웹RTC 가이드**: 저지연 오디오 상호작용, 서버 사이드 컨트롤. ([OpenAI 플랫폼][4])
* **모델 페이지(오디오/리얼타임)**: 모델 역량 개요(gpt-audio, gpt-realtime). ([OpenAI 플랫폼][7])
* **Data Controls(보존/저장 정책 표)**: 엔드포인트별 보존 정보 참고. ([OpenAI 플랫폼][6])

원하시면, 위 PRD에 맞춰 **Next.js 앱 기본 골격(페이지/Route Handler/클라이언트 훅)**과 **샘플 코드**까지 바로 만들어 드릴게요.

[1]: https://platform.openai.com/docs/api-reference/responses/object?utm_cta=website-workload-data-lake-7-considerations-for-migration%3Fwtime&wtime=&utm_source=chatgpt.com "API Reference"
[2]: https://platform.openai.com/docs/guides/realtime-sip?utm_source=chatgpt.com "Realtime API with SIP"
[3]: https://platform.openai.com/docs/api-reference/audio?lang=javascript&utm_source=chatgpt.com "API Reference"
[4]: https://platform.openai.com/docs/guides/realtime/concepts?utm_source=chatgpt.com "Realtime API"
[5]: https://platform.openai.com/docs/guides/realtime-webrtc?utm_source=chatgpt.com "Realtime API with WebRTC"
[6]: https://platform.openai.com/docs/guides/your-data?utm_source=chatgpt.com "Data controls in the OpenAI platform"
[7]: https://platform.openai.com/docs/models?utm_source=chatgpt.com "Models - OpenAI API"
