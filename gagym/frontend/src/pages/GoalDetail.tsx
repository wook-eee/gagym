import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './GoalDetail.css';

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

const GoalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    targetDate: '',
    category: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  useEffect(() => {
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    const foundGoal = goals.find((g: Goal) => g.id === parseInt(id!));
    
    if (foundGoal) {
      setGoal(foundGoal);
      setEditData({
        title: foundGoal.title,
        description: foundGoal.description,
        targetDate: foundGoal.targetDate,
        category: foundGoal.category,
        priority: foundGoal.priority
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: '목표를 찾을 수 없습니다',
        text: '요청하신 목표를 찾을 수 없습니다.',
        confirmButtonColor: '#667eea',
        confirmButtonText: '확인'
      }).then(() => {
        navigate('/goals');
      });
    }
  }, [id, navigate]);

  const updateProgress = (newProgress: number) => {
    if (!goal) return;
    
    const updatedGoal = { ...goal, progress: Math.max(0, Math.min(100, newProgress)) };
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    const updatedGoals = goals.map((g: Goal) => g.id === goal.id ? updatedGoal : g);
    
    localStorage.setItem('goals', JSON.stringify(updatedGoals));
    setGoal(updatedGoal);
  };

  const deleteGoal = () => {
    if (!goal) return;
    
    Swal.fire({
      title: '목표 삭제',
      text: '정말로 이 목표를 삭제하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#667eea',
      cancelButtonColor: '#d33',
      confirmButtonText: '삭제',
      cancelButtonText: '취소'
    }).then((result) => {
      if (result.isConfirmed) {
        const goals = JSON.parse(localStorage.getItem('goals') || '[]');
        const updatedGoals = goals.filter((g: Goal) => g.id !== goal.id);
        localStorage.setItem('goals', JSON.stringify(updatedGoals));
        
        Swal.fire({
          icon: 'success',
          title: '목표 삭제 완료',
          text: '목표가 성공적으로 삭제되었습니다.',
          confirmButtonColor: '#667eea',
          confirmButtonText: '확인'
        }).then(() => {
          navigate('/goals');
        });
      }
    });
  };

  const saveChanges = () => {
    if (!goal) return;
    
    const updatedGoal = { ...goal, ...editData };
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    const updatedGoals = goals.map((g: Goal) => g.id === goal.id ? updatedGoal : g);
    
    localStorage.setItem('goals', JSON.stringify(updatedGoals));
    setGoal(updatedGoal);
    setIsEditing(false);
    Swal.fire({
      icon: 'success',
      title: '목표 수정 완료',
      text: '목표가 성공적으로 수정되었습니다!',
      confirmButtonColor: '#667eea',
      confirmButtonText: '확인'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff4757';
      case 'medium': return '#ffa502';
      case 'low': return '#2ed573';
      default: return '#747d8c';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return '#2ed573';
    if (progress >= 70) return '#ffa502';
    if (progress >= 30) return '#ff6348';
    return '#747d8c';
  };

  const getDaysRemaining = () => {
    if (!goal) return 0;
    const targetDate = new Date(goal.targetDate);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (!goal) {
    return <div className="loading">로딩 중...</div>;
  }

  const daysRemaining = getDaysRemaining();

  return (
    <div className="goal-detail">
      <div className="container">
        <div className="detail-header">
          <button onClick={() => navigate('/goals')} className="btn btn-secondary">
            ← 목록으로 돌아가기
          </button>
          <div className="header-actions">
            <button 
              onClick={() => setIsEditing(!isEditing)} 
              className="btn"
            >
              {isEditing ? '취소' : '수정'}
            </button>
            <button onClick={deleteGoal} className="btn btn-danger">
              삭제
            </button>
          </div>
        </div>

        <div className="goal-content">
          {isEditing ? (
            <div className="edit-form">
              <div className="form-group">
                <label>목표 제목</label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({...editData, title: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>목표 설명</label>
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({...editData, description: e.target.value})}
                  rows={4}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>목표 날짜</label>
                  <input
                    type="date"
                    value={editData.targetDate}
                    onChange={(e) => setEditData({...editData, targetDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>카테고리</label>
                  <select
                    value={editData.category}
                    onChange={(e) => setEditData({...editData, category: e.target.value})}
                  >
                    <option value="건강/운동">건강/운동</option>
                    <option value="학습/교육">학습/교육</option>
                    <option value="경력/직업">경력/직업</option>
                    <option value="재정/투자">재정/투자</option>
                    <option value="관계/소통">관계/소통</option>
                    <option value="취미/여가">취미/여가</option>
                    <option value="자기계발">자기계발</option>
                    <option value="기타">기타</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button onClick={saveChanges} className="btn btn-success">
                  저장
                </button>
              </div>
            </div>
          ) : (
            <div className="goal-info">
              <div className="goal-header">
                <h1>{goal.title}</h1>
                <div className="goal-badges">
                  <span 
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(goal.priority) }}
                  >
                    {goal.priority === 'high' ? '높음' : 
                     goal.priority === 'medium' ? '보통' : '낮음'}
                  </span>
                  <span className="category-badge">{goal.category}</span>
                </div>
              </div>

              <p className="goal-description">{goal.description}</p>

              <div className="goal-stats">
                <div className="stat-item">
                  <h3>목표 날짜</h3>
                  <p>{new Date(goal.targetDate).toLocaleDateString()}</p>
                  <span className={`days-remaining ${daysRemaining < 0 ? 'overdue' : ''}`}>
                    {daysRemaining > 0 ? `${daysRemaining}일 남음` : 
                     daysRemaining < 0 ? `${Math.abs(daysRemaining)}일 지남` : '오늘 마감'}
                  </span>
                </div>
                <div className="stat-item">
                  <h3>생성일</h3>
                  <p>{new Date(goal.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="stat-item">
                  <h3>진행률</h3>
                  <p className="progress-percentage">{goal.progress}%</p>
                </div>
              </div>

              <div className="progress-section">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${goal.progress}%`,
                      backgroundColor: getProgressColor(goal.progress)
                    }}
                  ></div>
                </div>
                <div className="progress-controls">
                  <button
                    onClick={() => updateProgress(goal.progress - 10)}
                    className="btn btn-small"
                    disabled={goal.progress <= 0}
                  >
                    -10%
                  </button>
                  <button
                    onClick={() => updateProgress(goal.progress - 5)}
                    className="btn btn-small"
                    disabled={goal.progress <= 0}
                  >
                    -5%
                  </button>
                  <button
                    onClick={() => updateProgress(goal.progress + 5)}
                    className="btn btn-small"
                    disabled={goal.progress >= 100}
                  >
                    +5%
                  </button>
                  <button
                    onClick={() => updateProgress(goal.progress + 10)}
                    className="btn btn-small"
                    disabled={goal.progress >= 100}
                  >
                    +10%
                  </button>
                </div>
              </div>

              {goal.progress === 100 && (
                <div className="completion-celebration">
                  <h2>🎉 축하합니다!</h2>
                  <p>목표를 달성하셨습니다!</p>
                </div>
              )}

              {daysRemaining < 0 && goal.progress < 100 && (
                <div className="overdue-warning">
                  <h3>⚠️ 기한이 지났습니다</h3>
                  <p>목표 달성 기한이 지났지만, 포기하지 마세요!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalDetail; 