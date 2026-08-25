import blueDecorative from "@/assets/blue-decorative.svg";
import yellowDecorative from "@/assets/yellow-decorative.svg";
import frigusLogoText from "@/assets/frigus-logo-text.svg";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import { useState, type FormEvent } from "react";
import { login } from "@/services/auth.service";
import { useStore } from "@/store/store";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [rawPassword, setRawPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const store = useStore();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    console.log(email, rawPassword, rememberMe);
    

    const res = await login({ email, rawPassword });
    console.log(res);
    
    store.login(res.user, res.accessToken, res.refreshToken);
    console.log(store.user, store.accessToken, store.refreshToken, rememberMe);
  };

  return (
    <main className="flex h-screen w-screen">
      <section className="w-[610px] bg-frigus-navy relative overflow-hidden pl-[64px]">
        <img
          src={frigusLogoText}
          alt="Frigus Logo with text"
          className="w-[150px] h-[45px] absolute top-[54px] left-[64px]"
        />

        <div className="flex flex-col gap-[24px] mt-[188px] w-fit">
          <h1 className="text-[40px] font-bold leading-[46px] text-frigus-white">
            Menos desperdício <br />
            Mais leveza no dia a dia
          </h1>

          <p className="text-[20px] font-medium leading-[27px] font-normal text-frigus-ice">
            Acompanhe seus alimentos, organize compras e <br />
            aproveite melhor tudo o que já está em casa
          </p>
        </div>

        <img
          src={blueDecorative}
          alt="Forma decorativa azul - Blue Decorative"
          className="w-[195px] h-[390px] absolute bottom-[-20px] right-0 pointer-events-none z-0"
        />
        <img
          src={yellowDecorative}
          alt="Forma decorativa amarela - Yellow Decorative"
          className="w-[88px] h-[88px] absolute top-[98px] right-[48px] pointer-events-none z-0"
        />

        <div className="relative w-[430px] h-[125px] rounded-frigus bg-[#283064] mt-[130px] z-10 flex flex-col gap-2 justify-center pl-[24px]">
          <h3 className="font-bold text-frigus-white text-[18px]">
            Sua rotina em um só lugar
          </h3>
          <p className="font-normal text-frigus-ice leading-[21px]">
            Estoque, validade, receitas e lista de compras <br />
            conectados de forma simples.
          </p>
        </div>
      </section>

      <section className="flex-1 flex items-center justify-center">
        <div className="rounded-frigus bg-frigus-white shadow-[0_16px_34px_0_rgba(19,28,85,0.10)] w-[520px] h-[575px] flex flex-col items-center justify-center">
          <div className="w-105 text-left">
            <h2 className="font-bold text-frigus-navy text-[28px]">
              Bem-vindo(a) de volta!
            </h2>

            <p className="font-normal text-[#70809F] text-[16px] mt-1">
              Entre para continuar cuidando melhor da sua rotina.
            </p>
          </div>

          <form className="flex flex-col gap-2 mt-10">
            <label
              htmlFor="login-input-email"
              className="text-blue-950 text-base font-semibold"
            >
              Email
            </label>
            <input
              type="text"
              id="login-input-email"
              className="w-105 h-12 bg-white rounded-xl border border-slate-200 mt-0 pl-3 text-sm focus:outline-blue-400"
              placeholder="Digite seu email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <label
              htmlFor="login-input-password"
              className="text-blue-950 text-base font-semibold mt-6"
            >
              Senha
            </label>
            <input
              type="password"
              id="login-input-password"
              className="w-105 h-12 bg-white rounded-xl border border-slate-200 mt-0 pl-3 text-sm focus:outline-blue-400"
              placeholder="Digite sua senha"
              onChange={(e) => setRawPassword(e.target.value)}
            />

            <div className="flex justify-between items-center w-105 mt-2">
              <Checkbox
                id="remember-me"
                label="Manter conectado"
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <a
                href="/forgot-password"
                className="text-blue-700 text-sm font-semibold underline"
              >
                Esqueci minha senha
              </a>
            </div>

            <div className="mt-4">
              <Button
                type="submit"
                variant="primary"
                className="w-105 h-12"
                onClick={handleSubmit}
              >
                Entrar
              </Button>
            </div>

            <p className="text-center mt-5 text-slate-500 text-sm">
              Ainda não tem uma conta?{" "}
              <a
                href="/register"
                className="text-blue-700 text-sm font-bold underline"
              >
                Cadastre-se
              </a>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
