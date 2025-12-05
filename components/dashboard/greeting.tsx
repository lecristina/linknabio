"use client";

type GreetingProps = {
  displayName?: string | null;
};

export function Greeting({ displayName }: GreetingProps) {
  return (
    <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
        Olá, <span className="text-primary">{displayName || "Usuário"}!</span>
      </h2>

      <p className="text-sm text-muted-foreground max-w-2xl">
        Descubra o poder que a Axolutions pode trazer para sua empresa.
      </p>
    </div>
  );
}
