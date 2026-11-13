export function Brand({ small = false }: { small?: boolean }) {
  return (
    <span className={`brand ${small ? "brand-small" : ""}`}>
      <svg
        viewBox="0 0 32 32"
        width={small ? 23 : 30}
        height={small ? 23 : 30}
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M9 4h19v6H9zM15 13h13v6H15zM3 22h25v6H3z"
        />
      </svg>
      <span>
        Lotvale<span className="brand-period">.</span>
      </span>
    </span>
  );
}
