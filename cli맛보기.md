# 터미널(=CLI) 맛보기 — 실전 데모용 마크다운

> 목표: “왜 터미널이 편한가?”를 3분 만에 체감하게 만들기  
> 환경: macOS (기본 터미널), 크롬/VSCode 설치 가정

---

## 1) 터미널이 뭐죠?
- **CLI = 터미널**: 글자로 명령해서 컴퓨터를 조작
- 장점: **빠름 · 자동화 가능 · 깊은 제어 · 조합의 자유(파이프)**
- 핵심 메시지: “작은 명령어들을 **레고처럼** 이어붙여 강력한 작업을 한다”

---

## 2) 바로 실행해보는 명령 (생활형)

### 앱 열기
```bash
# 크롬 열기
open -a "Google Chrome"

# VS Code 열기 (둘 중 하나)
open -a "Visual Studio Code"
# 또는 code .   # 'Shell Command: Install 'code' in PATH' 설정한 경우

# 메일 앱 열기
open -a "Mail"

# 현재 폴더 Finder로 열기
open .

웹/파일 바로 열기

# URL 바로 열기
open "https://example.com"

# 특정 파일을 크롬으로 열기
open -a "Google Chrome" index.html


⸻

3) 파일/폴더 기본기

# 현재 위치
pwd

# 파일 목록(숨김 포함, 상세)
ls -la

# 폴더/파일 만들기·복사·이동·삭제
mkdir demo
echo "Hello CLI" > note.txt
cp note.txt demo/note-copy.txt
mv note.txt demo/
rm demo/note-copy.txt

# 내용 보기/검색
cat demo/note.txt
grep "CLI" demo/note.txt


⸻

4) 파이프(|) & 리다이렉션(>, >>)

# > : 새 파일로 저장 (덮어쓰기)
echo "첫 줄" > log.txt

# >> : 기존 파일에 이어쓰기
echo "둘째 줄" >> log.txt

# | : 앞 명령 결과를 다음 명령 입력으로 전달
cat log.txt | grep "첫"

# 조합 예: 크롬 프로세스 목록 저장
ps aux | grep "Chrome" > chrome-process.txt


⸻

5) “작은 명령 → 조합” 예시 3가지

(A) 빠른 메모 만들기 → 열기

echo "- 회의 10:30" > todo.md
open -a "Visual Studio Code" todo.md

(B) HTML 파일 만들어 크롬으로 미리보기

cat > index.html << 'HTML'
<!doctype html>
<html><head><meta charset="utf-8"><title>Demo</title></head>
<body><h1>터미널에서 만든 페이지</h1></body></html>
HTML
open -a "Google Chrome" index.html

(C) 로그에서 에러만 뽑아 보고서로

# 샘플 로그 생성
printf "INFO ok\nERROR fail A\nINFO ok\nERROR fail B\n" > app.log
# 에러만 추출해 파일로 저장
grep "ERROR" app.log > errors.txt
open -a "Visual Studio Code" errors.txt


⸻

6) 3분 데모 시나리오(강사용)
	1.	앱/웹 즉시 열기
open -a "Google Chrome" → “마우스 없이도 번개처럼 뜹니다.”
	2.	파일 생성→열기
echo "안녕하세요" > hello.txt && open -a "Visual Studio Code" hello.txt
	3.	파이프/검색
ps aux | grep Chrome > chrome.txt && open chrome.txt
	4.	작업 자동화 감각
“이런 줄들을 스크립트로 저장하면, 매일 클릭 대신 한 번에 끝납니다.”

⸻

7) 실습 미션(5분)
	•	미션 1: notes 폴더를 만들고 today.md에 세 줄 적어 VSCode로 열기

mkdir -p notes
printf "해야 할 일\n- AI 실습\n- 산책\n" > notes/today.md
open -a "Visual Studio Code" notes/today.md


	•	미션 2: app.log에서 WARN 또는 ERROR만 뽑아 report.txt로

printf "INFO start\nWARN low memory\nERROR crash\nINFO end\n" > app.log
egrep "WARN|ERROR" app.log > report.txt
cat report.txt


	•	미션 3: index.html을 만들고 크롬에서 열기

cat > index.html << 'HTML'
<!doctype html><meta charset="utf-8"><h2>CLI → HTML → 브라우저</h2>
HTML
open -a "Google Chrome" index.html



⸻

8) 왜 터미널을 쓰나요? (한 줄 요약)

“반복 작업을 한 줄로, 작은 도구들을 파이프로 연결해서,
클릭보다 빠르고 다시 쓰기 쉬운 방식으로 일하기 위해.”

⸻

9) 치트시트

# 길잡이
pwd           # 현재 폴더
ls -la        # 파일 목록(자세히)
cd 폴더명      # 이동

# 파일/폴더
mkdir 이름
echo "텍스트" > 파일
echo "추가" >> 파일
cp 원본 대상
mv 원본 대상
rm 파일
rm -rf 폴더   # 주의!

# 보기/검색/조합
cat 파일
grep "패턴" 파일
egrep "A|B" 파일
head -n 10 파일
tail -n 20 파일
ps aux | grep 앱이름
command1 | command2 > 결과.txt

# 앱/웹 열기
open .
open -a "Visual Studio Code"
open -a "Google Chrome" index.html
open "https://example.com"


⸻

10) 다음 단계 예고 (Claude Code와 연결)
	•	지금 보신 “파일 만들기·수정·열기”를
AI(Claude Code) 명령까지 붙이면?
	•	복붙 없이 → 터미널에서 바로 파일 생성/수정/실행
	•	즉, AI가 내 작업 폴더를 직접 다루는 바이브 코딩으로 확장!

