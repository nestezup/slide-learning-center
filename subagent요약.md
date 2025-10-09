아래는 Claude의 “Subagents” 기능 문서를 바탕으로 4장 분량의 슬라이드 요약안입니다. 필요하시면 디자인 제안이나 슬라이드 문구 다듬기도 도와드릴게요.

⸻

슬라이드 1: 개념 및 장점

제목: Subagents란 무엇인가? / 주요 이점
	•	정의 / 개념 요약
 • Subagent = 특정 역할이나 전문성을 가진 보조 AI 에이전트
 • 메인 대화 흐름과 별개의 컨텍스트 창을 가짐
 • 각 subagent는 고유한 시스템 프롬프트, 허용 도구 세트, 모델 구성 등을 가질 수 있음  ￼
 • Claude Code는 요청 내용과 subagent 설정을 기반으로 자동 혹은 명시 호출 방식으로 위임 가능  ￼
	•	주요 이점
 1. 컨텍스트 보존
  – subagent는 독립된 컨텍스트에서 작동하여 메인 대화가 복잡해지지 않게 함  ￼
 2. 전문성 강화
  – 역할별로 특화된 지침(prompt)과 도구를 줌으로써 해당 업무의 성공률 향상  ￼
 3. 재사용성
  – 한 번 정의해 놓으면 여러 프로젝트나 팀원들과 공유 가능  ￼
 4. 권한 / 도구 제어
  – 각 subagent에 필요한 도구만 허용하여 보안 및 책임 분리 가능  ￼

⸻

슬라이드 2: 설정 방식 및 구조

제목: Subagent 구성 및 설정 방법
	•	파일 기반 구성
 • subagent들은 Markdown 파일 형태로 정의됨 (YAML 전면부 + 본문 프롬프트)  ￼
 • 저장 위치 (우선순위):
  – 프로젝트 수준: .claude/agents/ — 현재 프로젝트에만 적용, 우선순위 높음  ￼
  – 사용자 수준: ~/.claude/agents/ — 모든 프로젝트에서 사용 가능, 우선순위 낮음  ￼
 • 이름 충돌 시: 프로젝트 수준 정의가 사용자 수준을 덮어씀  ￼
	•	CLI 기반 설정
 • --agents 플래그를 통해 세션별 또는 스크립트용 subagent 정의 가능  ￼
 • 이 방식의 우선순위는 프로젝트 수준보다는 낮고 사용자 수준보다는 높음  ￼
	•	파일 포맷 / 구성 필드
 • YAML 전면부 주요 필드
  – name (필수): 소문자 + 하이픈 조합
  – description (필수): 어떤 역할을 할지 설명
  – tools (선택): 허용할 도구 목록 (지정하지 않으면 메인 스레드의 도구 상속)  ￼
  – model (선택): 사용할 모델(alias 또는 inherit) 또는 생략 (기본값)  ￼
 • 본문: subagent의 시스템 프롬프트 (여러 문단 가능), 역할, 제한사항 등을 포함  ￼
	•	모델 선택과 도구 접근
 • model 필드:
  – alias (예: sonnet, opus, haiku)
  – inherit: 메인 세션에서 쓰는 모델과 동일하게 사용
  – 생략 시 기본 subagent 모델 사용  ￼
 • 도구 접근:
  – tools 필드가 없으면 메인 thread의 모든 도구를 상속
  – 명시하면 필요한 도구만 제한적으로 허용  ￼

⸻

슬라이드 3: 사용 방식 및 예시

제목: 사용 방식 / 예시 subagent
	•	Subagent 호출 방식
 • 자동 위임 (Automatic Delegation)
  – Claude Code가 요청 문맥과 subagent의 description을 기준으로 적절한 subagent를 자동으로 선택
  – description에 “use proactively” 또는 “MUST BE USED” 같은 표현을 포함하면 적극 위임 유도 가능  ￼
 • 명시적 호출 (Explicit Invocation)
  – 사용자가 직접 해당 subagent 이름을 요청 문장 안에 명시
   예: “Use the code-reviewer subagent to check my recent changes”  ￼
	•	예시 Subagent들
 1. code-reviewer
  – 역할: 코드 품질, 보안, 유지보수성 중심 리뷰
  – 도구: Read, Grep, Glob, Bash
  – 모델: inherit
  – 작동 예: git diff 분석, 우선순위 기준 피드백 제공  ￼

 2. debugger
  – 역할: 오류, 테스트 실패, 비정상 동작 진단
  – 도구: Read, Edit, Bash, Grep, Glob
  – 절차: 에러 메시지 → 재현 단계 → 원인 분석 → 최소 수정 → 검증  ￼

 3. data-scientist
  – 역할: 데이터 분석, SQL 쿼리 작성, BigQuery 활용
  – 도구: Bash, Read, Write
  – 모델: sonnet
  – 행동 흐름: 요구사항 이해 → 쿼리 작성 → 분석 → 요약 보고  ￼
	•	활용 팁 / 권고사항
 • 처음부터 Claude로 에이전트를 생성하고 커스터마이즈하는 방식 추천
 • 역할은 단일 책임 방식으로 설계 (한 agent에 여러 역할을 넣지 않기)
 • 프롬프트에는 제약, 예시, 가이드라인 등 구체적 지침 포함
 • 도구 접근은 최소한으로 제한하여 보안 및 집중도 확보
 • 프로젝트 subagent는 버전 관리 시스템에 포함시키기 권장  ￼

⸻

슬라이드 4: 고급 활용 및 고려사항

제목: 고급 사용 기법과 성능 고려사항
	•	서브에이전트 체이닝 (Chaining Subagents)
 • 복합 작업 시 여러 subagent를 순차적으로 호출
  예: 코드 분석 → 최적화 → 문서화
 • 다양한 subagent 간 흐름을 구성할 수 있음  ￼
	•	동적 Subagent 선택 (Dynamic Selection)
 • Claude Code가 문맥에 따라 적합한 subagent를 자동 판단
 • description 필드는 구체적이고 행동 지향적으로 작성하는 것이 중요  ￼
	•	성능 / 비용 고려사항
 • 컨텍스트 효율성: 메인 대화를 깔끔하게 유지하고 과도한 context 누수를 방지  ￼
 • 지연 시간 (Latency): Subagent가 호출될 때마다 초기 설정 및 문맥 로드가 필요하여 약간의 지연 발생 가능  ￼
	•	요약 및 참고
 • Subagent는 복잡도를 관리하고 전문성 집중을 가능케 함
 • 단일 책임 원칙 + 최소 권한 원칙을 지키는 설계가 바람직
 • 문서화, 버전 관리, 팀 공유가 중요
 • 관련 문서로는 “Slash commands”, “Hooks”, “MCP 도구 문서” 등이 있음  ￼

