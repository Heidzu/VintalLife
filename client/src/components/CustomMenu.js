import '../assets/styles/CustomMenu.css';;

function CustomMenu({ isOpen, onClose, theme }) {
  if (!isOpen) return null;

  const menuItems = [
    { name: 'Переваги', href: '#advantages' },
    { name: 'Каталог', href: '#catalog' },
    { name: 'Партнери', href: '#partners' },
    { name: 'Розстрочка', href: '#installment' },
    { name: 'Контакти', href: '#contacts' }
  ];

  return (
    <div className={`menu-overlay ${theme}`} onClick={onClose}>
      <div className="menu-content" onClick={(e) => e.stopPropagation()}>
        <nav className="menu-nav">
          {menuItems.map((item, index) => (
            <a 
              key={index} 
              href={item.href} 
              className="menu-link"
              onClick={onClose} 
            >
              {item.name}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default CustomMenu;