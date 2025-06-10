import './StatCard.css';

export default function StatCard({ title, value, icon, change }) {
  return (
    <div className="stat-card-cr">
      <div className="stat-card-header">
        <div className="stat-card-title">{title}</div>
        {icon && <div className="stat-card-icon">{icon}</div>}
      </div>
      <div className="stat-card-value">{value}</div>
      {change && <div className="stat-card-change">{change}</div>}
    </div>
  );
}
