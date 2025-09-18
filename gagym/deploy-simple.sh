#!/bin/bash

# GAGYM Docker 배포 스크립트 (간단한 버전 - API 키는 이미 설정됨)
echo "🏋️‍♂️ GAGYM 배포 시작 (간단한 버전)..."

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 함수 정의
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# 1. 환경 변수 파일 확인
print_step "1. 환경 변수 설정 확인"
if [ ! -f ".env" ]; then
    print_warning ".env 파일이 없습니다. env.simple을 복사합니다."
    cp env.simple .env
    print_status "✅ API 키들은 이미 application.properties에 설정되어 있습니다!"
fi

# EC2 Public IP 자동 감지
EC2_PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || curl -s ifconfig.me)
if [ -z "$EC2_PUBLIC_IP" ]; then
    print_warning "EC2 Public IP를 자동으로 감지할 수 없습니다."
    read -p "EC2 Public IP를 입력해주세요: " EC2_PUBLIC_IP
fi

echo "EC2_PUBLIC_IP=$EC2_PUBLIC_IP" >> .env
print_status "EC2 Public IP: $EC2_PUBLIC_IP"

# 2. Docker 및 Docker Compose 설치 확인
print_step "2. Docker 설치 확인"
if ! command -v docker &> /dev/null; then
    print_error "Docker가 설치되지 않았습니다."
    print_status "Docker 설치 중..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    sudo usermod -aG docker $USER
    print_warning "⚠️  로그아웃 후 다시 로그인해주세요."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose가 설치되지 않았습니다."
    print_status "Docker Compose 설치 중..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# 3. 기존 컨테이너 정리
print_step "3. 기존 컨테이너 정리"
print_status "기존 컨테이너 정리 중..."
docker-compose -f docker-compose.prod.yml down --remove-orphans
docker system prune -f

# 4. Docker 이미지 빌드
print_step "4. Docker 이미지 빌드"
print_status "Docker 이미지 빌드 중..."
docker-compose -f docker-compose.prod.yml build --no-cache

# 5. 컨테이너 시작
print_step "5. 컨테이너 시작"
print_status "컨테이너 시작 중..."
docker-compose -f docker-compose.prod.yml up -d

# 6. 상태 확인
print_step "6. 서비스 상태 확인"
print_status "컨테이너 상태 확인 중..."
sleep 10
docker-compose -f docker-compose.prod.yml ps

# 7. 로그 확인
print_step "7. 로그 확인"
print_status "최근 로그 확인 중..."
docker-compose -f docker-compose.prod.yml logs --tail=20

# 8. 헬스 체크
print_step "8. 서비스 헬스 체크"
print_status "서비스 헬스 체크 중..."
sleep 30

# MySQL 헬스 체크
if docker exec gagym_mysql mysqladmin ping -h localhost -u root -p${MYSQL_ROOT_PASSWORD:-gagym1234} > /dev/null 2>&1; then
    print_status "✅ MySQL 데이터베이스 정상"
else
    print_warning "⚠️  MySQL 데이터베이스 응답 없음"
fi

# 백엔드 헬스 체크
if curl -f http://localhost:8080/actuator/health > /dev/null 2>&1; then
    print_status "✅ 백엔드 서비스 정상"
else
    print_warning "⚠️  백엔드 서비스 응답 없음"
    print_status "백엔드 로그 확인:"
    docker-compose -f docker-compose.prod.yml logs backend --tail=10
fi

# 프론트엔드 헬스 체크
if curl -f http://localhost:80 > /dev/null 2>&1; then
    print_status "✅ 프론트엔드 서비스 정상"
else
    print_warning "⚠️  프론트엔드 서비스 응답 없음"
    print_status "프론트엔드 로그 확인:"
    docker-compose -f docker-compose.prod.yml logs frontend --tail=10
fi

# 9. 완료 메시지
echo
print_status "🎉 배포 완료!"
echo
print_status "📱 접속 정보:"
print_status "   프론트엔드: http://$EC2_PUBLIC_IP:80"
print_status "   백엔드 API: http://$EC2_PUBLIC_IP:8080"
print_status "   데이터베이스: localhost:3306"
echo
print_status "🔧 관리 명령어:"
print_status "   로그 확인: docker-compose -f docker-compose.prod.yml logs -f"
print_status "   서비스 중지: docker-compose -f docker-compose.prod.yml down"
print_status "   서비스 재시작: docker-compose -f docker-compose.prod.yml restart"
print_status "   컨테이너 상태: docker-compose -f docker-compose.prod.yml ps"
echo
print_warning "⚠️  보안 그룹에서 포트 80, 8080이 열려있는지 확인해주세요!"
print_status "✅ OAuth2 리다이렉트 URI가 자동으로 설정되었습니다:"
print_status "   Google: http://$EC2_PUBLIC_IP:8080/login/oauth2/code/google"
print_status "   Kakao: http://$EC2_PUBLIC_IP:8080/login/oauth2/code/kakao"
print_status "   Naver: http://$EC2_PUBLIC_IP:8080/login/oauth2/code/naver"
