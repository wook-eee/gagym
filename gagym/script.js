// 전역 변수
let currentUser = null;
let gyms = [];
let trainers = [];
let tickets = [];
let purchases = [];

// API 기본 URL
const API_BASE_URL = 'http://localhost:8080/api';

// 페이지 전환 함수
function showPage(pageName) {
    // 모든 페이지 숨기기
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // 선택된 페이지 보이기
    document.getElementById(pageName + '-page').classList.add('active');
    
    // 네비게이션 링크 업데이트
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-page="${pageName}"]`).classList.add('active');
    
    // 페이지별 초기화
    switch(pageName) {
        case 'home':
            loadPopularGyms();
            break;
        case 'gyms':
            loadGyms();
            break;
        case 'trainers':
            loadTrainers();
            break;
        case 'tickets':
            loadTickets();
            break;
        case 'mypage':
            loadMyPage();
            break;
    }
}

// 헬스장 관련 함수들
async function loadGyms() {
    try {
        const response = await fetch(`${API_BASE_URL}/gyms`);
        gyms = await response.json();
        displayGyms(gyms);
    } catch (error) {
        console.error('헬스장 로딩 실패:', error);
        // 임시 데이터로 표시
        displayGyms(getMockGyms());
    }
}

function displayGyms(gymsToShow) {
    const gymsGrid = document.getElementById('gyms-grid');
    gymsGrid.innerHTML = gymsToShow.map(gym => createGymCard(gym)).join('');
}

function createGymCard(gym) {
    return `
        <div class="gym-card" data-gym-id="${gym.id}">
            <div class="gym-image">
                <i class="fas fa-dumbbell"></i>
            </div>
            <div class="gym-content">
                <h3 class="gym-title">${gym.name}</h3>
                <p class="gym-address">${gym.address}</p>
                <div class="gym-info">
                    <span class="gym-price">월 ${gym.monthlyFee?.toLocaleString() || '0'}원</span>
                    <div class="gym-rating">
                        <i class="fas fa-star"></i>
                        <span>${gym.rating || 0}</span>
                    </div>
                </div>
                <div class="gym-actions">
                    <button class="btn btn-primary" onclick="viewGymDetail(${gym.id})">
                        상세보기
                    </button>
                    <button class="btn btn-outline" onclick="toggleFavorite(${gym.id})">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function searchGyms() {
    const searchTerm = document.getElementById('gym-search').value.toLowerCase();
    const filteredGyms = gyms.filter(gym => 
        gym.name.toLowerCase().includes(searchTerm) ||
        gym.address.toLowerCase().includes(searchTerm)
    );
    displayGyms(filteredGyms);
}

function sortGyms() {
    const sortType = document.getElementById('sort-select').value;
    let sortedGyms = [...gyms];
    
    switch(sortType) {
        case 'rating':
            sortedGyms.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
        case 'price':
            sortedGyms.sort((a, b) => (a.monthlyFee || 0) - (b.monthlyFee || 0));
            break;
        case 'distance':
            // 거리순 정렬 (현재 위치 기준)
            break;
    }
    
    displayGyms(sortedGyms);
}

// 트레이너 관련 함수들
async function loadTrainers() {
    try {
        const response = await fetch(`${API_BASE_URL}/trainers`);
        trainers = await response.json();
        displayTrainers(trainers);
    } catch (error) {
        console.error('트레이너 로딩 실패:', error);
        displayTrainers(getMockTrainers());
    }
}

function displayTrainers(trainersToShow) {
    const trainersGrid = document.getElementById('trainers-grid');
    trainersGrid.innerHTML = trainersToShow.map(trainer => createTrainerCard(trainer)).join('');
}

function createTrainerCard(trainer) {
    return `
        <div class="gym-card" data-trainer-id="${trainer.id}">
            <div class="gym-image">
                <i class="fas fa-user-tie"></i>
            </div>
            <div class="gym-content">
                <h3 class="gym-title">${trainer.name}</h3>
                <p class="gym-address">${trainer.specialization} • ${trainer.experienceYears}년 경력</p>
                <div class="gym-info">
                    <span class="gym-price">P.T ${trainer.ptPrice?.toLocaleString() || '0'}원</span>
                    <div class="gym-rating">
                        <i class="fas fa-star"></i>
                        <span>${trainer.rating || 0}</span>
                    </div>
                </div>
                <div class="gym-actions">
                    <button class="btn btn-primary" onclick="viewTrainerDetail(${trainer.id})">
                        상세보기
                    </button>
                    <button class="btn btn-outline" onclick="toggleTrainerFavorite(${trainer.id})">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function searchTrainers() {
    const searchTerm = document.getElementById('trainer-search').value.toLowerCase();
    const filteredTrainers = trainers.filter(trainer => 
        trainer.name.toLowerCase().includes(searchTerm) ||
        trainer.specialization.toLowerCase().includes(searchTerm)
    );
    displayTrainers(filteredTrainers);
}

function sortTrainers() {
    const sortType = document.getElementById('trainer-sort').value;
    let sortedTrainers = [...trainers];
    
    switch(sortType) {
        case 'rating':
            sortedTrainers.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
        case 'experience':
            sortedTrainers.sort((a, b) => (b.experienceYears || 0) - (a.experienceYears || 0));
            break;
        case 'price':
            sortedTrainers.sort((a, b) => (a.ptPrice || 0) - (b.ptPrice || 0));
            break;
    }
    
    displayTrainers(sortedTrainers);
}

// 티켓 관련 함수들
async function loadTickets() {
    try {
        const response = await fetch(`${API_BASE_URL}/tickets`);
        tickets = await response.json();
        displayTickets(tickets);
    } catch (error) {
        console.error('티켓 로딩 실패:', error);
        displayTickets(getMockTickets());
    }
}

function displayTickets(ticketsToShow) {
    const ticketsGrid = document.getElementById('tickets-grid');
    ticketsGrid.innerHTML = ticketsToShow.map(ticket => createTicketCard(ticket)).join('');
}

function createTicketCard(ticket) {
    return `
        <div class="ticket-card" data-ticket-id="${ticket.id}">
            <div class="ticket-price">${ticket.price?.toLocaleString() || '0'}원</div>
            <h3 class="ticket-name">${ticket.name}</h3>
            <p class="ticket-description">${ticket.description}</p>
            <div class="gym-actions">
                <button class="btn btn-primary" onclick="purchaseTicket(${ticket.id})">
                    구매하기
                </button>
                <button class="btn btn-outline" onclick="viewTicketDetail(${ticket.id})">
                    상세보기
                </button>
            </div>
        </div>
    `;
}

// 구매 관련 함수들
async function purchaseTicket(ticketId) {
    if (!currentUser) {
        showLoginModal();
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/purchases/purchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `userId=${currentUser.id}&ticketId=${ticketId}&paymentMethod=CARD`
        });
        
        if (response.ok) {
            const purchase = await response.json();
            alert('티켓 구매가 완료되었습니다!');
            showPage('mypage');
        } else {
            alert('구매에 실패했습니다.');
        }
    } catch (error) {
        console.error('구매 실패:', error);
        alert('구매 중 오류가 발생했습니다.');
    }
}

// 마이페이지 관련 함수들
function loadMyPage() {
    if (!currentUser) {
        showLoginModal();
        return;
    }
    
    loadMyTickets();
    loadMyFavorites();
    loadMyPurchases();
}

async function loadMyTickets() {
    try {
        const response = await fetch(`${API_BASE_URL}/purchases/user/${currentUser.id}/active`);
        const activeTickets = await response.json();
        displayMyTickets(activeTickets);
    } catch (error) {
        console.error('내 티켓 로딩 실패:', error);
    }
}

function displayMyTickets(tickets) {
    const ticketsList = document.getElementById('my-tickets-list');
    ticketsList.innerHTML = tickets.map(ticket => `
        <div class="ticket-item">
            <h4>${ticket.ticketName}</h4>
            <p>만료일: ${new Date(ticket.expiryDate).toLocaleDateString()}</p>
            <button class="btn btn-small" onclick="useTicket('${ticket.qrCode}')">
                QR코드 사용
            </button>
        </div>
    `).join('');
}

// 인기 헬스장 로딩
async function loadPopularGyms() {
    try {
        const response = await fetch(`${API_BASE_URL}/gyms/sort/rating`);
        const popularGyms = await response.json();
        displayPopularGyms(popularGyms.slice(0, 4));
    } catch (error) {
        console.error('인기 헬스장 로딩 실패:', error);
        displayPopularGyms(getMockGyms().slice(0, 4));
    }
}

function displayPopularGyms(popularGyms) {
    const popularGymsGrid = document.getElementById('popular-gyms-grid');
    popularGymsGrid.innerHTML = popularGyms.map(gym => createGymCard(gym)).join('');
}

// 모달 관련 함수들
function showLoginModal() {
    document.getElementById('login-modal').style.display = 'block';
}

function showSignupModal() {
    document.getElementById('signup-modal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// 이메일 인증 관련 함수들
async function sendVerificationEmail() {
    const email = document.getElementById('signup-email').value;
    
    if (!email) {
        alert('이메일을 입력해주세요.');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/email/verification`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email })
        });
        
        if (response.ok) {
            document.getElementById('verification-code-group').style.display = 'block';
            document.getElementById('verification-status').textContent = '인증 코드가 이메일로 발송되었습니다.';
            document.getElementById('verification-status').className = 'verification-status success';
        } else {
            alert('인증 코드 발송에 실패했습니다.');
        }
    } catch (error) {
        console.error('인증 코드 발송 실패:', error);
        alert('인증 코드 발송 중 오류가 발생했습니다.');
    }
}

async function verifyEmail() {
    const email = document.getElementById('signup-email').value;
    const verificationCode = document.getElementById('verification-code').value;
    
    if (!verificationCode) {
        alert('인증 코드를 입력해주세요.');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/email/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                email: email, 
                verificationCode: verificationCode 
            })
        });
        
        if (response.ok) {
            document.getElementById('verification-status').textContent = '이메일 인증이 완료되었습니다!';
            document.getElementById('verification-status').className = 'verification-status success';
            document.getElementById('signup-form').style.display = 'block';
        } else {
            document.getElementById('verification-status').textContent = '인증 코드가 올바르지 않습니다.';
            document.getElementById('verification-status').className = 'verification-status error';
        }
    } catch (error) {
        console.error('이메일 인증 실패:', error);
        alert('이메일 인증 중 오류가 발생했습니다.');
    }
}

// 로그인 폼 처리
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        
        if (response.ok) {
            const userData = await response.json();
            currentUser = userData;
            closeModal('login-modal');
            alert('로그인되었습니다!');
            showPage('mypage');
        } else {
            alert('로그인에 실패했습니다.');
        }
    } catch (error) {
        console.error('로그인 실패:', error);
        // 임시 로그인 처리
        currentUser = { id: 1, username: username, email: 'user@example.com' };
        closeModal('login-modal');
        alert('로그인되었습니다!');
        showPage('mypage');
    }
});

// 회원가입 폼 처리
document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const nickname = document.getElementById('signup-nickname').value;
    const email = document.getElementById('signup-email').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, email, nickname })
        });
        
        if (response.ok) {
            closeModal('signup-modal');
            alert('회원가입이 완료되었습니다!');
            showLoginModal();
        } else {
            alert('회원가입에 실패했습니다.');
        }
    } catch (error) {
        console.error('회원가입 실패:', error);
        closeModal('signup-modal');
        alert('회원가입이 완료되었습니다!');
        showLoginModal();
    }
});

// 소셜 로그인 함수들
function socialLogin(provider) {
    // 실제 구현에서는 OAuth2 리다이렉트를 사용
    alert(`${provider} 로그인 기능은 준비 중입니다.`);
    
    // 임시 소셜 로그인 처리
    const mockUser = {
        id: 1,
        username: `user_${provider}`,
        email: `user@${provider}.com`,
        nickname: `${provider} 사용자`,
        authProvider: provider.toUpperCase()
    };
    
    currentUser = mockUser;
    closeModal('login-modal');
    alert(`${provider} 로그인되었습니다!`);
    showPage('mypage');
}

function socialSignup(provider) {
    // 실제 구현에서는 OAuth2 리다이렉트를 사용
    alert(`${provider} 회원가입 기능은 준비 중입니다.`);
    
    // 임시 소셜 회원가입 처리
    const mockUser = {
        id: 1,
        username: `user_${provider}`,
        email: `user@${provider}.com`,
        nickname: `${provider} 사용자`,
        authProvider: provider.toUpperCase()
    };
    
    currentUser = mockUser;
    closeModal('signup-modal');
    alert(`${provider} 회원가입이 완료되었습니다!`);
    showPage('mypage');
}

// 기타 유틸리티 함수들
function searchNearbyGyms() {
    const location = document.getElementById('location-search').value;
    if (location) {
        showPage('gyms');
        // 위치 기반 검색 구현
    }
}

function showMapView() {
    alert('지도 보기 기능은 준비 중입니다.');
}

function viewGymDetail(gymId) {
    alert(`헬스장 상세보기: ${gymId}`);
}

function viewTrainerDetail(trainerId) {
    alert(`트레이너 상세보기: ${trainerId}`);
}

function viewTicketDetail(ticketId) {
    alert(`티켓 상세보기: ${ticketId}`);
}

function toggleFavorite(gymId) {
    if (!currentUser) {
        showLoginModal();
        return;
    }
    alert('찜하기 기능은 준비 중입니다.');
}

function toggleTrainerFavorite(trainerId) {
    if (!currentUser) {
        showLoginModal();
        return;
    }
    alert('찜하기 기능은 준비 중입니다.');
}

function useTicket(qrCode) {
    alert(`QR코드 사용: ${qrCode}`);
}

// 티켓 타입 선택
document.querySelectorAll('.ticket-type-card').forEach(card => {
    card.addEventListener('click', () => {
        document.querySelectorAll('.ticket-type-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        
        const ticketType = card.dataset.type;
        filterTicketsByType(ticketType);
    });
});

function filterTicketsByType(type) {
    // 티켓 타입별 필터링 구현
    console.log('티켓 타입 필터:', type);
}

// 가격 필터 업데이트
document.getElementById('price-min').addEventListener('input', function() {
    document.getElementById('price-min-value').textContent = this.value + '원';
});

document.getElementById('price-max').addEventListener('input', function() {
    document.getElementById('price-max-value').textContent = this.value + '원';
});

// 모의 데이터
function getMockGyms() {
    return [
        {
            id: 1,
            name: '피트니스 월드',
            address: '서울시 강남구 역삼동 123-45',
            monthlyFee: 80000,
            rating: 4.5,
            imageUrl: '/images/gym1.jpg'
        },
        {
            id: 2,
            name: '헬스 스파',
            address: '서울시 서초구 서초동 456-78',
            monthlyFee: 120000,
            rating: 4.8,
            imageUrl: '/images/gym2.jpg'
        },
        {
            id: 3,
            name: '파워 피트니스',
            address: '서울시 마포구 합정동 789-12',
            monthlyFee: 60000,
            rating: 4.2,
            imageUrl: '/images/gym3.jpg'
        }
    ];
}

function getMockTrainers() {
    return [
        {
            id: 1,
            name: '김트레이너',
            specialization: '다이어트',
            experienceYears: 5,
            ptPrice: 50000,
            rating: 4.7
        },
        {
            id: 2,
            name: '박트레이너',
            specialization: '근력운동',
            experienceYears: 8,
            ptPrice: 70000,
            rating: 4.9
        }
    ];
}

function getMockTickets() {
    return [
        {
            id: 1,
            name: '일일권',
            description: '하루 자유이용',
            price: 15000,
            type: 'DAILY'
        },
        {
            id: 2,
            name: '월회비',
            description: '한 달 자유이용',
            price: 80000,
            type: 'MONTHLY'
        }
    ];
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    // 네비게이션 이벤트 설정
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            showPage(page);
        });
    });
    
    // 모달 외부 클릭 시 닫기
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // 홈 페이지 초기화
    showPage('home');
}); 