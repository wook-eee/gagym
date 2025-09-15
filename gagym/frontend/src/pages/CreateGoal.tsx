import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './CreateGoal.css';

interface Goal {
  id: number;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
  category: string;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}

const CreateGoal: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetDate: '',
    category: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const categories = [
    '건강/운동',
    '학습/교육',
    '경력/직업',
    '재정/투자',
    '관계/소통',
    '취미/여가',
    '자기계발',
    '기타'
  ];

  const priorities = [
    { value: 'low', label: '낮음', color: '#2ed573' },
    { value: 'medium', label: '보통', color: '#ffa502' },
    { value: 'high', label: '높음', color: '#ff4757' }
  ];

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.title.trim()) {
      newErrors.title = '목표 제목을 입력해주세요';
    }

    if (!formData.description.trim()) {
      newErrors.description = '목표 설명을 입력해주세요';
    }

    if (!formData.targetDate) {
      newErrors.targetDate = '목표 달성 날짜를 선택해주세요';
    } else {
      const selectedDate = new Date(formData.targetDate);
      const today = new Date();
      if (selectedDate < today) {
        newErrors.targetDate = '목표 날짜는 오늘 이후로 설정해주세요';
      }
    }

    if (!formData.category) {
      newErrors.category = '카테고리를 선택해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const newGoal: Goal = {
      id: Date.now(),
      ...formData,
      progress: 0,
      createdAt: new Date().toISOString()
    };

    const existingGoals = JSON.parse(localStorage.getItem('goals') || '[]');
    const updatedGoals = [...existingGoals, newGoal];
    localStorage.setItem('goals', JSON.stringify(updatedGoals));

    Swal.fire({
      icon: 'success',
      title: '목표 생성 완료!',
      text: '목표가 성공적으로 생성되었습니다! 🎉',
      confirmButtonColor: '#667eea',
      confirmButtonText: '확인'
    }).then(() => {
      navigate('/goals');
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // 에러 메시지 제거
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff4757';
      case 'medium': return '#ffa502';
      case 'low': return '#2ed573';
      default: return '#747d8c';
    }
  };

  return (
    <div className="create-goal">
      <div className="container">
        <div className="create-header">
          <h1>🎯 새 목표 만들기</h1>
          <p>당신의 마음가짐을 구체적인 목표로 만들어보세요!</p>
        </div>

        <form onSubmit={handleSubmit} className="goal-form">
          <div className="form-group">
            <label htmlFor="title">목표 제목 *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="예: 매일 30분 운동하기"
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">목표 설명 *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="목표에 대한 자세한 설명을 작성해주세요..."
              rows={4}
              className={errors.description ? 'error' : ''}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="targetDate">목표 달성 날짜 *</label>
              <input
                type="date"
                id="targetDate"
                name="targetDate"
                value={formData.targetDate}
                onChange={handleInputChange}
                className={errors.targetDate ? 'error' : ''}
              />
              {errors.targetDate && <span className="error-message">{errors.targetDate}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="category">카테고리 *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={errors.category ? 'error' : ''}
              >
                <option value="">카테고리 선택</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && <span className="error-message">{errors.category}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>우선순위</label>
            <div className="priority-options">
              {priorities.map(priority => (
                <label key={priority.value} className="priority-option">
                  <input
                    type="radio"
                    name="priority"
                    value={priority.value}
                    checked={formData.priority === priority.value}
                    onChange={handleInputChange}
                  />
                  <span 
                    className="priority-label"
                    style={{ 
                      backgroundColor: formData.priority === priority.value ? priority.color : '#f1f2f6',
                      color: formData.priority === priority.value ? 'white' : '#666'
                    }}
                  >
                    {priority.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/goals')} className="btn btn-secondary">
              취소
            </button>
            <button type="submit" className="btn btn-success">
              목표 생성하기
            </button>
          </div>
        </form>

        <div className="tips-section">
          <h3>💡 효과적인 목표 설정 팁</h3>
          <div className="tips-grid">
            <div className="tip-card">
              <h4>구체적이게</h4>
              <p>"운동하기"보다는 "매일 30분 걷기"처럼 구체적으로 작성하세요.</p>
            </div>
            <div className="tip-card">
              <h4>측정 가능하게</h4>
              <p>진행 상황을 숫자로 측정할 수 있도록 목표를 설정하세요.</p>
            </div>
            <div className="tip-card">
              <h4>달성 가능하게</h4>
              <p>현실적이고 달성 가능한 목표를 설정하세요.</p>
            </div>
            <div className="tip-card">
              <h4>기한을 정하세요</h4>
              <p>목표 달성 기한을 명확히 설정하여 동기부여를 유지하세요.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGoal; 