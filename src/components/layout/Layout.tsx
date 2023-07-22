import { styleTheme } from "../../../styles";

export const iconStyle = { width: 30, height: 30 };

interface IconProps {
  icon: JSX.Element;
  filled?: boolean;
  style?: typeof iconStyle;
}

export const Icon: React.FC<IconProps> = ({
  icon,
  filled,
  style = iconStyle,
}) => {
  const Icon = icon;

  return (
    <Icon
      style={filled ? { ...iconStyle, fill: theme.colors.primary } : style}
    />
  );
};

interface ButtonProps {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      {children}
    </button>
  );
};
