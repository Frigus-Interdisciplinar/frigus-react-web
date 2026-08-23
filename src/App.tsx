import { useState } from "react";
import Sidebar, { type SectionString } from "@/components/Sidebar/Navbar";
import Button from "@/components/Button";

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionString>("home");

  return (
    <div className="flex min-h-screen bg-bg-app">
      <Sidebar activeSection={activeSection} />

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-title text-text-main mb-6">
          Teste da Sidebar e Componentes
        </h1>

        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="primary" onClick={() => setActiveSection("home")}>
            Visão geral
          </Button>
          <Button variant="secondary" onClick={() => setActiveSection("stock")}>
            Estoque
          </Button>
          <Button variant="accent" onClick={() => setActiveSection("recipe")}>
            Receitas
          </Button>
          <Button variant="destructive">
            Excluir
          </Button>
          <Button variant="outline">
            Configurações
          </Button>
        </div>
      </main>
    </div>
  );
}

