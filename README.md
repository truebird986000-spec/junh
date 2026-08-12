# Carrier GreenON

Carrier GreenON은 캐리어 에어컨 사용자를 위한 친환경 냉방 미션·GREEN POINT·리워드 웹앱입니다. 실제 캐리어 API를 호출하지 않고 가상 IoT 상태와 샘플 날씨로 동작합니다.

## 기능

- 가상 Carrier 에어컨 상태 및 이상 상태 Red UI
- 날씨별 GREEN MISSION, +30분 시뮬레이션, 성공/실패 처리
- GREEN POINT 지갑과 리워드 구매
- Supabase Auth, 사용자별 미션·포인트·주문·에어컨 상태
- 사용자 소유 RLS 정책과 안전한 포인트/주문 RPC

## 로컬 실행

Node.js 20 이상을 설치한 뒤 아래 명령을 실행합니다.

```bash
copy .env.example .env
npm run build
npm start
```

브라우저에서 `http://localhost:3000`을 엽니다. `.env`에는 Supabase 프로젝트 URL과 **Publishable key**만 넣습니다. `service_role`, `sb_secret_` 키, 데이터베이스 비밀번호는 브라우저·`.env.example`·Git에 넣지 않습니다.

## Supabase 설정

원격 스키마와 RLS 원칙은 [supabase/SCHEMA.md](supabase/SCHEMA.md)에 정리되어 있습니다. 이 프로젝트의 데이터 API용 권한은 명시적으로 부여됐고, 모든 `public` 테이블은 RLS를 사용합니다.

미션 완료와 리워드 구매는 클라이언트가 포인트를 직접 쓰지 않습니다. 인증 사용자만 호출 가능한 공개 래퍼가 비노출 스키마의 원자 처리 로직을 호출합니다.

## 수동 점검 흐름

1. 회원가입 후 이메일 인증 설정에 맞춰 로그인합니다.
2. 정상 냉방 상태에서 미션을 시작하고 `+30분`을 네 번 실행합니다.
3. GREEN POINT 적립 및 새로고침 후 유지 여부를 확인합니다.
4. 리워드 구매 후 포인트 차감·구매 내역을 확인합니다.
5. 다른 계정으로 로그인해 첫 계정의 포인트·미션·주문이 보이지 않는지 확인합니다.

## Render 배포

Render의 Web Service에서 다음 값을 사용합니다.

- Build Command: `npm run build`
- Start Command: `npm start`
- Environment: `Node`
- 환경변수: `.env.example`에 적힌 `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, 필요 시 `WEATHER_API_URL`

배포 후에는 위 수동 점검 흐름을 다시 수행합니다.
