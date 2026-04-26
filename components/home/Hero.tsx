import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section id="hero" className="px-4 pt-10 sm:px-6 sm:pt-14 pb-4">
      {/* Contenedor Principal: Usa la foto entera y controla la estructura general */}
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl shadow-2xl h-[480px] sm:h-[550px] lg:h-[600px]">
        
        {/* Fondo de Imagen Completo (Frontis Alta Resolución) */}
        <div className="absolute inset-0 z-0 bg-azul-oscuro">
          <Image
            src="/images/frontis-noche-v3.webp"
            alt="Frente del Colegio Acrópolis de noche"
            fill
            className="object-cover object-[50%_90%] contrast-[1.05] saturate-[1.10]"
            priority
          />
          
          {/* 2. Tinte Institucional para sincronía con el resto de la web */}
          <div className="absolute inset-0 bg-azul-acropolis/10 mix-blend-overlay"></div>
          
          {/* 3. Gradiente Inferior para dar anclaje visual 3D a la Tarjeta de Cristal */}
          <div className="absolute inset-0 bg-gradient-to-t from-azul-oscuro/80 via-azul-oscuro/10 to-transparent"></div>
          
          {/* 4. Viñeta lateral/superior sutil para enfocar el centro */}
          <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.3)]"></div>
        </div>

        {/* Tarjeta de Cristal Flotante (Glassmorphism Premium) */}
        {/* Rediseñada: Más angosta y empujada a la izquierda para revelar la C del letrero */}
        <div className="absolute z-10 bottom-4 left-4 w-[calc(100%-2rem)] max-w-[280px] rounded-3xl bg-azul-acropolis/60 p-5 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] backdrop-blur-xl border border-white/20 sm:bottom-6 sm:left-6 sm:max-w-[340px] lg:bottom-8 lg:left-8 lg:max-w-[350px] lg:p-8">
          
          <h1 className="mb-3 leading-[1.1] tracking-tight lg:leading-[1.15]">
            <span className="mb-1 block text-[18px] font-bold tracking-normal text-white/95 sm:text-2xl">Bienvenidos al</span>
            <span className="block text-[30px] font-extrabold text-amarillo sm:text-4xl lg:text-[40px] leading-tight">Colegio<br/>Acrópolis</span>
          </h1>
          
          <p className="mb-5 text-[13px] leading-relaxed text-slate-100 sm:text-base">
            Formando estudiantes íntegros con excelencia académica en el corazón de Puente Alto, Santiago de Chile.
          </p>
          
          <div className="flex flex-col gap-3">
            {/* Botón Principal (Cian) */}
            <Link
              href="/admision"
              className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-cian px-6 text-[14px] font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:shadow-cian/30"
            >
              Proceso de Admisión
            </Link>
            
            {/* Botón Secundario (Transparente) */}
            <Link
              href="/nuestra-historia"
              className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-white/50 bg-transparent px-6 text-[15px] font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
            >
              Conócenos
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
