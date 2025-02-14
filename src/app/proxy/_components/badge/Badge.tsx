interface BadgeProps {
  label: string;
  textColor: string;
  bgColor: string;
  icon: any; 
}

const Badge: React.FC<BadgeProps> = ({ label, textColor, bgColor, icon: Icon }) => {
  return (
    <div
      style={{
        backgroundColor: bgColor,
        color: textColor,
        fontSize: '0.875rem',
        fontWeight: '600',
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'max-content'
      }}
    >
      <Icon size={16} style={{ marginRight: '0.5rem' }} />
      {label}
    </div>
  );
};

export default Badge;
