import blueLogo from "@/assets/frigus-logo-blue.svg";
import whiteLogo from "@/assets/frigus-logo-white.png";
import type { BrandLogoProps } from "@/types/ui-component-props.type";

export default function BrandLogo({ surface, className = "" }: BrandLogoProps) {
  const blueClasses = surface === "dark" ? "hidden" : surface === "theme" ? "dark:hidden" : "";
  const whiteClasses = surface === "light" ? "hidden" : surface === "theme" ? "hidden dark:block" : "";

  return (
    <>
      <img src={blueLogo} alt="Frigus" className={`${blueClasses} ${className}`} />
      <img src={whiteLogo} alt="Frigus" className={`${whiteClasses} ${className}`} />
    </>
  );
}
