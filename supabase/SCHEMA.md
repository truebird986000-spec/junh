# Carrier GreenON Supabase 스키마

연결 프로젝트: `jtmmepseiwkamcbehcwa` (ap-northeast-1)

적용된 원격 마이그레이션: `20260811062428_create_carrier_greenon_schema`

## 테이블

- `profiles`: `auth.users`와 1:1인 사용자 이름·GREEN LEVEL
- `missions`: 운영자가 관리하는 GREEN MISSION 카탈로그
- `user_missions`: 사용자별 일일 미션 참여·진행·성공 기록
- `point_transactions`: 적립/사용 포인트 원장. 클라이언트에는 사용자 본인 조회만 허용
- `rewards`: 운영자가 관리하는 리워드 카탈로그
- `reward_orders`: 사용자별 리워드 주문 기록
- `aircon_status`: 사용자별 가상 에어컨 상태

## 보안 원칙

- 모든 `public` 테이블에 RLS를 사용합니다.
- 개인 데이터 정책은 `TO authenticated`와 `(select auth.uid()) = user_id`(또는 `id`)를 함께 사용합니다.
- `profiles`는 `auth.users` 가입 트리거로 자동 생성됩니다. 트리거 함수는 API RPC로 실행할 수 없도록 `anon`, `authenticated`, `PUBLIC`의 실행 권한을 제거했습니다.
- `missions`, `rewards`는 로그인 사용자에게 활성 항목 읽기만 허용합니다. 카탈로그 변경은 서버/관리자 경로에서만 수행합니다.
- 포인트 적립·주문 확정은 클라이언트의 직접 INSERT 권한을 주지 않습니다. 다음 실제 DB 전환 단계에서 검증된 서버 경로 또는 제한된 RPC로 원자적으로 처리합니다.
- `public.complete_green_mission()`과 `public.purchase_green_reward()`는 `SECURITY INVOKER` 공개 래퍼입니다. 실제 권한 상승 작업은 비노출 `app_private` 스키마의 코어 함수에서만 실행하며, 두 경로 모두 `auth.uid()`가 없으면 거부합니다.
- 브라우저에는 Publishable key만 환경변수로 전달하며 `service_role`·Secret key는 절대 포함하지 않습니다.

## 검증

- 7개 테이블 모두 RLS 활성화 확인
- Supabase Security Advisor 경고 0건
- 외래 키 인덱스 보완 완료
- 공개 RPC가 `SECURITY INVOKER`, 비노출 코어가 `SECURITY DEFINER`인지 데이터베이스 메타데이터로 확인

빈 프로젝트이므로 Performance Advisor의 `unused index` 정보 알림은 실제 사용자 요청이 쌓이면 다시 검토합니다.
