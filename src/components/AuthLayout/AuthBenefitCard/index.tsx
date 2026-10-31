import { type ReactNode } from "react";

export interface AuthBenefitCardProps {
  cardTitle: string;
  cardDescription: ReactNode;
}

export default function AuthBenefitCard({
  cardTitle,
  cardDescription,
}: AuthBenefitCardProps) {
  return (
    <div className="relative w-[430px] min-h-[125px] rounded-frigus bg-[#283064] z-10 flex flex-col gap-2 justify-center pl-[24px] pr-[20px] py-4 mt-8">
      <h3 className="font-bold text-frigus-white text-[18px]">{cardTitle}</h3>
      <p className="font-normal text-frigus-ice text-[15px] leading-[21px]">
        {cardDescription}
      </p>
    </div>
  );
}
