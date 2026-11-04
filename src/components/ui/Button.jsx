import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-[#C9A96B] text-[#1A1A1A] hover:bg-[#D4B87A] border border-[#C9A96B]',
  secondary: 'bg-transparent text-[#F7F2EA] border border-[#F7F2EA]/30 hover:border-[#C9A96B] hover:text-[#C9A96B]',
  ghost: 'bg-transparent text-[#C9A96B] border border-[#C9A96B]/30 hover:bg-[#C9A96B]/10',
  dark: 'bg-[#1A1A1A] text-[#F7F2EA] border border-[#3A3228] hover:border-[#C9A96B]',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-base',
  xl: 'px-10 py-5 text-lg',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  as: Tag = 'button',
  href,
  ...props
}) {
  const base = `inline-flex items-center gap-2 font-display font-semibold rounded-sm tracking-wide transition-all duration-200 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed`;
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (Tag === 'a' || href) {
    return (
      <motion.a
        href={href}
        className={cls}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      className={cls}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
