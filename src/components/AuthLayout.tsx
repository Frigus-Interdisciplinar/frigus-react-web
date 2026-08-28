import { type ReactNode } from "react";
import blueDecorative from "@/assets/blue-decorative.svg";
import yellowDecorative from "@/assets/yellow-decorative.svg";
import frigusLogoText from "@/assets/frigus-logo-text.svg";

export interface AuthLayoutProps {
  title: ReactNode;
  description: ReactNode;
  cardTitle: string;
  cardDescription: ReactNode;
  children: ReactNode;
}

export default function AuthLayout({
  title,
  description,
  cardTitle,
  cardDescription,
  children,
}: AuthLayoutProps) {
  return (
    <main className="flex min-h-screen w-screen bg-[#F4F7FC]">
      {/* Painel Institucional Lateral */}
      <section className="hidden lg:flex flex-col justify-between w-[610px] shrink-0 bg-frigus-navy relative overflow-hidden pl-[64px] pb-[60px] min-h-screen">
        <div>
          <a href="/login" className="inline-block mt-[54px]">
            <img
              src={frigusLogoText}
              alt="Frigus Logo"
              className="w-[150px] h-[45px]"
            />
          </a>

          <div className="flex flex-col gap-[24px] mt-[90px] max-w-[480px]">
            <h1 className="text-[40px] font-bold leading-[46px] text-frigus-white whitespace-pre-line">
              {title}
            </h1>

            <p className="text-[19px] leading-[27px] font-normal text-frigus-ice">
              {description}
            </p>
          </div>
        </div>

        {/* Formas decorativas */}
        <img
          src={blueDecorative}
          alt="Forma decorativa azul"
          className="w-[195px] h-[390px] absolute bottom-[-20px] right-0 pointer-events-none z-0"
        />
        <img
          src={yellowDecorative}
          alt="Forma decorativa amarela"
          className="w-[88px] h-[88px] absolute top-[98px] right-[48px] pointer-events-none z-0"
        />

        {/* Cartão de Benefício */}
        <div className="relative w-[430px] min-h-[125px] rounded-frigus bg-[#283064] z-10 flex flex-col gap-2 justify-center pl-[24px] pr-[20px] py-4 mt-8">
          <h3 className="font-bold text-frigus-white text-[18px]">
            {cardTitle}
          </h3>
          <p className="font-normal text-frigus-ice text-[15px] leading-[21px]">
            {cardDescription}
          </p>
        </div>
      </section>

      {/* Conteúdo Principal / Card de Autenticação */}
      <section className="flex-1 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {children}
      </section>
    </main>
  );
}
