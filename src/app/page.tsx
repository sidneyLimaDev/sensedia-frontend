import { Card } from "./components/Card";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-sensedia-purple-secundary text-white p-8">
        <div className="max-w-[875px] mx-auto">
          <h1 className="text-3xl font-bold">Início</h1>
          <p>Bem-vindo à plataforma da Sensedia</p>
        </div>
      </div>

      <div className="flex justify-center p-8">
        <div className="w-full max-w-[875px] flex flex-col md:flex-row gap-8">
          <Card
            title="Usuários"
            subtitle="Gerencie os usuários da plataforma"
            description="Acesse a lista completa de usuários cadastrados na plataforma."
            buttonText="Ver usuários"
            link="/user"
          />
          <Card
            title="Registro"
            subtitle="Crie uma nova conta de usuário"
            description="Cadastre um novo usuário na plataforma de forma rápida e fácil."
            buttonText="Registrar"
            link="/user/new"
          />
        </div>
      </div>
    </div>
  );
}
