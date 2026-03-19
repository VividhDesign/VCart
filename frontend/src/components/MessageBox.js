export default function MessageBox({ variant = 'info', children }) {
  const icons = {
    danger: 'fas fa-exclamation-circle',
    success: 'fas fa-check-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle',
  };
  return (
    <div className={`alert alert-${variant}`}>
      <i className={icons[variant] || icons.info}></i>
      <span>{children}</span>
    </div>
  );
}
