import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './GoalList.css';

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

const GoalList: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedGoals = JSON.parse(localStorage.getItem('goals') || '[]');
    setGoals(savedGoals);
  }, []);

  const filteredGoals = goals.filter(goal => {
    const matchesFilter = filter === 'all' || 
      (filter === 'completed' && goal.progress === 100) ||
      (filter === 'in-progress' && goal.progress > 0 && goal.progress < 100) ||
      (filter === 'not-started' && goal.progress === 0);
    
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const deleteGoal = (id: number) => {
    if (window.confirm('정말로 이 목표를 삭제하시겠습니까?')) {
      const updatedGoals = goals.filter(goal => goal.id !== id);
      setGoals(updatedGoals);
      localStorage.setItem('goals', JSON.stringify(updatedGoals));
    }
  };

  const updateProgress = (id: number, newProgress: number) => {
    const updatedGoals = goals.map(goal => 
      goal.id === id ? { ...goal, progress: Math.max(0, Math.min(100, newProgress)) } : goal
    );
    setGoals(updatedGoals);
    localStorage.setItem('goals', JSON.stringify(updatedGoals));
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

  return (
    <div className="goal-list">
      <div className="container">
        <div className="list-header">
          <h1>📋 목표 목록</h1>
          <Link to="/create" className="btn btn-success">
            새 목표 만들기
          </Link>
        </div>

        <div className="filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="목표 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              전체 ({goals.length})
            </button>
            <button
              className={`filter-btn ${filter === 'in-progress' ? 'active' : ''}`}
              onClick={() => setFilter('in-progress')}
            >
              진행 중 ({goals.filter(g => g.progress > 0 && g.progress < 100).length})
            </button>
            <button
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              완료 ({goals.filter(g => g.progress === 100).length})
            </button>
            <button
              className={`filter-btn ${filter === 'not-started' ? 'active' : ''}`}
              onClick={() => setFilter('not-started')}
            >
              시작 전 ({goals.filter(g => g.progress === 0).length})
            </button>
          </div>
        </div>

        {filteredGoals.length === 0 ? (
          <div className="empty-state">
            <h2>🎯 목표가 없습니다</h2>
            <p>새로운 목표를 만들어보세요!</p>
            <Link to="/create" className="btn btn-success">
              첫 번째 목표 만들기
            </Link>
          </div>
        ) : (
          <div className="goal-grid">
            {filteredGoals.map((goal) => (
              <div key={goal.id} className="card goal-card">
                <div className="goal-header">
                  <h3>{goal.title}</h3>
                  <div className="goal-actions">
                    <Link to={`/goals/${goal.id}`} className="btn btn-small">
                      보기
                    </Link>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="btn btn-small btn-danger"
                    >
                      삭제
                    </button>
                  </div>
                </div>
                
                <p className="goal-description">{goal.description}</p>
                
                <div className="goal-meta">
                  <span 
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(goal.priority) }}
                  >
                    {goal.priority === 'high' ? '높음' : 
                     goal.priority === 'medium' ? '보통' : '낮음'}
                  </span>
                  <span className="category">{goal.category}</span>
                  <span className="date">
                    {new Date(goal.targetDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="progress-section">
                  <div className="progress-header">
                    <span>진행률</span>
                    <span className="progress-percentage">{goal.progress}%</span>
                  </div>
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
                      onClick={() => updateProgress(goal.id, goal.progress - 10)}
                      className="btn btn-small"
                      disabled={goal.progress <= 0}
                    >
                      -10%
                    </button>
                    <button
                      onClick={() => updateProgress(goal.id, goal.progress + 10)}
                      className="btn btn-small"
                      disabled={goal.progress >= 100}
                    >
                      +10%
                    </button>
                  </div>
                </div>

                {goal.progress === 100 && (
                  <div className="completion-badge">
                    🎉 완료!
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalList; 