export default function StarBorder({
  as: Component = "div",
  className = "",
  color = "white",
  speed = "6s",
  thickness = 1,
  children,
  ...rest
}) {
  return (
    <Component
      className={`relative inline-block overflow-hidden rounded-[20px] ${className}`}
      style={{ padding: `${thickness}px 0`, ...(rest.style || {}) }}
      {...rest}
    >
      <div
        className="absolute w-[300%] h-[50%] opacity-70 bottom-[-11px] right-[-250%] rounded-full animate-star-movement-bottom z-0"
        style={{ background: `radial-gradient(circle, ${color}, transparent 10%)`, animationDuration: speed }}
      />
      <div
        className="absolute w-[300%] h-[50%] opacity-70 -top-2.5 left-[-250%] rounded-full animate-star-movement-top z-0"
        style={{ background: `radial-gradient(circle, ${color}, transparent 10%)`, animationDuration: speed }}
      />
      <div className="relative z-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-inherit rounded-[20px]">
        {children}
      </div>
    </Component>
  );
}
