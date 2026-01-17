"use client";
import NextLink from 'next/link';
import { forwardRef, AnchorHTMLAttributes, ReactNode } from 'react';
import { ComponentType, SVGAttributes } from 'react';

type LinkVariant = 'default' | 'muted' | 'primary';
type LinkSize = 'sm' | 'md' | 'lg';

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  variant?: LinkVariant;
  size?: LinkSize;
  external?: boolean;
  icon?: ComponentType<SVGAttributes<SVGElement>>;
  iconPosition?: 'left' | 'right';
  children: ReactNode;
}

const variantStyles: Record<LinkVariant, string> = {
  default: 'text-[#FCFCFC] hover:text-[#FCFCFC]/80',
  muted: 'text-[#5e8284] hover:text-[#FCFCFC]',
  primary: 'text-blue-400 hover:text-blue-300 hover:underline',
};

const sizeStyles: Record<LinkSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

const iconSizeStyles: Record<LinkSize, string> = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

const Link = forwardRef<HTMLAnchorElement, LinkProps>(({
  href,
  variant = 'default',
  size = 'md',
  external = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  children,
  ...props
}, ref) => {
  const iconClass = iconSizeStyles[size];
  const combinedClassName = `
    inline-flex items-center gap-1.5
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    transition-colors duration-200
    ${className}
  `;

  const content = (
    <>
      {Icon && iconPosition === 'left' && <Icon className={iconClass} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className={iconClass} />}
    </>
  );

  if (external) {
    return (
      <a
        ref={ref}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={combinedClassName}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <NextLink
      ref={ref}
      href={href}
      className={combinedClassName}
      {...props}
    >
      {content}
    </NextLink>
  );
});

Link.displayName = 'Link';

export default Link;
